// commands/commandsHandler.js
const { listMemory, resetMemory, getLastN } = require('../middleware/memoryProvider');
const { generateChatCompletion } = require('../middleware/openAIIntegration');
const { BlobServiceClient } = require('@azure/storage-blob');
const config = require('../config/config');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');
const helpText = require('../utils/helpText');
const servicesDir = path.join(__dirname, '../services');
const { missingComponentWarning } = require('../utils/warningMessage');
const integrationsRegistry = require('../server/integrationsRegistry');
const sessionActiveModules = {}; // Key: sessionId, Value: moduleName (string)
const sessionModuleWindows = {}; // Key: sessionId, Value: Array of {name, initTime, closedAt}

function sanitizeFilename(input) {
  return input.replace(/[^a-z0-9-_]/gi, '_');
}

function generateFileName(context, sessionId, suffix, ext) {
  const safeSessionId = sanitizeFilename(sessionId);
  const safeUserId = sanitizeFilename(context.activity.from?.id || 'anonymous');
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15);
  return `${safeUserId}_${safeSessionId}_${timestamp}${suffix}.${ext}`;
}

const publicDir = path.join(__dirname, '../../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const blobServiceClient = BlobServiceClient.fromConnectionString(
  config.azureBlob.connectionString
);
const containerClient = blobServiceClient.getContainerClient(
  config.azureBlob.containerName
);
const getSessionBlobName = (sessionId) => `session-${sessionId}.json`;

async function overwriteMemory(sessionId, entriesToKeep) {
  const blobName = getSessionBlobName(sessionId);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.upload(
    JSON.stringify(entriesToKeep),
    Buffer.byteLength(JSON.stringify(entriesToKeep)),
    { overwrite: true }
  );
}

async function storeAnalytics(sessionId, type, fileName = null) {
  const analyticsBlobName = `session-${sessionId}-analytics.json`;
  const analyticsClient = containerClient.getBlockBlobClient(analyticsBlobName);
  let analytics = {
    prompts: 0,
    answers: 0,
    exports: {},
    files: []
  };
  try {
    const download = await analyticsClient.downloadToBuffer();
    analytics = JSON.parse(download.toString());
  } catch (err) {
    if (err.statusCode !== 404) throw err;
  }

  if (type === 'prompt') analytics.prompts++;
  else if (type === 'answer') analytics.answers++;
  else if (type.startsWith('export:')) {
    const key = type.split(':')[1];
    analytics.exports[key] = (analytics.exports[key] || 0) + 1;
    if (fileName) {
      analytics.files = analytics.files || [];
      analytics.files.push({
        name: fileName,
        timestamp: new Date().toISOString()
      });
    }
  }

  const data = JSON.stringify(analytics);
  await analyticsClient.upload(data, Buffer.byteLength(data), { overwrite: true });
}

function getBaseUrl(context) {
  const scheme = context.activity.serviceUrl?.startsWith('https') ? 'https' : 'http';
  const host = context.activity.channelId === 'emulator' ? 'localhost:3978' : context.activity.serviceUrl;
  return `${scheme}://${host}`;
}

async function handleCommand(text, sessionId, context) {
  await storeAnalytics(sessionId, 'prompt');
  const command = text.trim().toLowerCase();

  // Export Options
  if (command === 'export memory as json') {
    const fileName = generateFileName(context, sessionId, '', 'json');
    await storeAnalytics(sessionId, 'export:memory', fileName);
    const history = (await listMemory(sessionId)).filter(m => !m.isWelcome);
    const filePath = path.join(__dirname, `../public/${fileName}`);
    fs.writeFileSync(filePath, JSON.stringify(history, null, 2));
    const baseUrl = getBaseUrl(context);
    return `📎 Download link: ${baseUrl}/download/${fileName}`;
  }

  if (command === 'export prompts as json') {
    const fileName = generateFileName(context, sessionId, '-prompts', 'json');
    await storeAnalytics(sessionId, 'export:prompts', fileName);
    const history = (await listMemory(sessionId)).filter(m => !m.isWelcome);
    const prompts = history.filter(m => m.from === 'user' && !m.isWelcome);
    const filePath = path.join(__dirname, `../public/${fileName}`);
    fs.writeFileSync(filePath, JSON.stringify(prompts, null, 2));
    const baseUrl = getBaseUrl(context);
    return `📎 Download link: ${baseUrl}/download/${fileName}`;
  }

  if (command === 'export answers as markdown') {
    const fileName = generateFileName(context, sessionId, '-answers', 'md');
    await storeAnalytics(sessionId, 'export:answers', fileName);
    const history = (await listMemory(sessionId)).filter(m => !m.isWelcome);
    const answers = history.filter(m => m.from === 'bot' && !m.isWelcome).map(m => `- ${m.text}`);
    const markdown = answers.join(' ');
    const filePath = path.join(__dirname, `../public/${fileName}`);
    fs.writeFileSync(filePath, markdown);
    const baseUrl = getBaseUrl(context);
    return `📎 Download link: ${baseUrl}/download/${fileName}`;
  }

  if (command === 'kazbot help!') {
    return helpText;
  }

  // Support "!kazbot command services" or "kazbot command services" (case insensitive, with or without exclamation mark)
  const normalized = command.replace(/^!/, '').trim();
  if (normalized === 'kazbot command services') {
      const { getAvailableIntegrations } = require('../server/serviceManager');
      const integrations = getAvailableIntegrations();
      if (!integrations) {
          return "No modules are loaded.";
      } else {
          return `**Available integrations:**\n\n${integrations.join('\n\n')}`;
      }
  }

    // 1. Parse for lifecycle commands FIRST
  const lifecycleMatch = normalized.match(/^kazbot\s+(init|close|status|restart|help)\s+(.+)$/);
  if (lifecycleMatch) {
    const [, action, rawModule] = lifecycleMatch;
    const moduleName = rawModule.trim();
    switch(action) {
      case 'init': {
        const result = await integrationsRegistry.initModule(moduleName);
        // Set as active module for this session
        sessionActiveModules[sessionId] = moduleName;

        // Track module windows
        if (!sessionModuleWindows[sessionId]) sessionModuleWindows[sessionId] = [];
        sessionModuleWindows[sessionId].push({
          name: moduleName,
          initTime: new Date().toISOString(),
          closedAt: null
        });
        return result;
      }
      case 'close': {
        const result = await integrationsRegistry.closeModule(moduleName);
        if (sessionActiveModules[sessionId] === moduleName) {
          delete sessionActiveModules[sessionId];
        }
        // Mark window as closed
        const windowArr = sessionModuleWindows[sessionId];
        if (windowArr) {
          const last = windowArr.reverse().find(w => w.name === moduleName && !w.closedAt);
          if (last) last.closedAt = new Date().toISOString();
          windowArr.reverse(); // Restore order
        }
        return result;
      }
      case 'status':
        return await integrationsRegistry.statusModule(moduleName);
      case 'restart':
        return await integrationsRegistry.restartModule(moduleName);
      case 'help':
        return await integrationsRegistry.helpModule(moduleName);
      default:
        return `Unknown action "${action}".`;
    }
  }

  if (command === '!kazbot show session analytics') {
    const { formatAnalytics } = require('../utils/analyticsFormatter');
    const windows = sessionModuleWindows[sessionId] || [];
    let summary = 'Session analytics for each module window:\n\n';
    for (const w of windows) {
      const all = await listMemory(sessionId);
      const windowStart = new Date(w.initTime);
      const windowEnd = w.closedAt ? new Date(w.closedAt) : new Date();
      const windowMessages = all.filter(m =>
        new Date(m.timestamp) >= windowStart && new Date(m.timestamp) <= windowEnd
      );
      const prompts = windowMessages.filter(m => m.from === 'user');
      const answers = windowMessages.filter(m => m.from === 'bot');
      summary += `- ${w.name}: ${windowMessages.length} total, ${prompts.length} prompts, ${answers.length} answers (${w.initTime} - ${w.closedAt || 'now'})\n`;
    }
    return `\`\`\`\n${summary}\n\`\`\``;  // This will preserve line breaks in most chat clients
  }

  const exportSessionMatch = command.match(/^!kazbot export session (answers|memory|prompts)$/);
  if (exportSessionMatch) {
    const type = exportSessionMatch[1]; // "answers", "memory", or "prompts"
    const windows = sessionModuleWindows[sessionId] || [];
    let exported = [];
    const all = await listMemory(sessionId);

    for (const w of windows) {
      const windowStart = new Date(w.initTime);
      const windowEnd = w.closedAt ? new Date(w.closedAt) : new Date();
      const windowMessages = all.filter(m =>
        new Date(m.timestamp) >= windowStart && new Date(m.timestamp) <= windowEnd
      );
      if (type === 'answers') {
        exported.push(...windowMessages.filter(m => m.from === 'bot'));
      } else if (type === 'prompts') {
        exported.push(...windowMessages.filter(m => m.from === 'user'));
      } else {
        exported.push(...windowMessages);
      }
    }
    // Export as markdown
    let markdown = '';
    if (type === 'answers') {
      markdown = exported.map(m => `- ${m.text}`).join('\n');
    } else if (type === 'prompts') {
      markdown = exported.map(m => `- ${m.text}`).join('\n');
    } else {
      markdown = exported.map(m => `- ${m.text || JSON.stringify(m)}`).join('\n');
    }
    const fileName = generateFileName(context, sessionId, `-session-${type}`, 'md');
    fs.writeFileSync(path.join(__dirname, `../public/${fileName}`), markdown);
    const baseUrl = getBaseUrl(context);
    return `📎 Download link: ${baseUrl}/download/${fileName}`;
  }

  // 2. If no lifecycle match, parse legacy info command
  if (command.startsWith('!kazbot ')) {
    const requestedService = command.slice('!kazbot '.length).trim();
    // ... rest of your legacy info logic ...
  }

  const servicesDir = path.join(__dirname, '../services');
  // Detect commands like "!kazbot Microsoft Entra"
  if (command.startsWith('!kazbot ')) {
    const requestedService = command.slice('!kazbot '.length).trim();
    const folders = fs.readdirSync(servicesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    const matchedFolder = folders.find(f => f.toLowerCase() === requestedService.toLowerCase());
    if (matchedFolder) {
        const modulePath = path.join(servicesDir, matchedFolder);

        // 1. Check for moduleStructure.json
        let requiredFiles = ['main.js', 'info.md'];
        const moduleStructurePath = path.join(modulePath, 'moduleStructure.json');
        if (fs.existsSync(moduleStructurePath)) {
            try {
                const raw = fs.readFileSync(moduleStructurePath, 'utf-8');
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed.required)) requiredFiles = parsed.required;
            } catch {}
        }

        // 2. Validate presence
        let missing = [];
        requiredFiles.forEach(file => {
            if (!fs.existsSync(path.join(modulePath, file))) missing.push(file);
        });

        if (missing.length > 0) {
            return missingComponentWarning(matchedFolder, missing, modulePath);
        } else {
            const infoContent = fs.readFileSync(path.join(modulePath, 'info.md'), 'utf-8');
            return `### ${matchedFolder}\n${infoContent}`;
        }
    } else {
        return `Integration "${requestedService}" not found. Type "!kazbot command services" to see available integrations.`;
    }
  }

  if (command === 'list memory') {
    const history = (await listMemory(sessionId)).filter(m => !m.isWelcome);
    return history.map((m, i) => `${i + 1}. ${m.text || JSON.stringify(m)}`).join('\n');
  }

  if (command === 'list memory full') {
    const history = (await listMemory(sessionId)).filter(m => !m.isWelcome);
    return JSON.stringify(history, null, 2);
  }

  if (command.startsWith('show last') && !command.includes('prompts') && !command.includes('answers')) {
    const parts = command.split(' ');
    const n = parseInt(parts[2], 10);
    const recent = await getLastN(sessionId, n);
    return recent.map((m, i) => `${i + 1}. ${m.text || JSON.stringify(m)}`).join('\n');
  }

  if (command === 'reset memory') {
    await resetMemory(sessionId);
    return '✅ Memory has been cleared.';
  }

  if (command === 'list prompts') {
    const history = await listMemory(sessionId);
    const promptMessages = history.filter(m => m.from === 'user' && !m.isWelcome);
    return promptMessages.map((m, i) => `${i + 1}. ${m.text}`).join('\n');
  }

  if (command.startsWith('show last') && command.includes('prompts')) {
    const n = parseInt(command.split(' ')[2], 10);
    const history = await listMemory(sessionId);
    const promptMessages = history.filter(m => m.from === 'user' && !m.isWelcome);
    return promptMessages.slice(-n).map((m, i) => `${i + 1}. ${m.text}`).join('\n');
  }

  if (command === 'show full prompts') {
    const history = await listMemory(sessionId);
    const promptMessages = history.filter(m => m.from === 'user' && !m.isWelcome);
    return JSON.stringify(promptMessages, null, 2);
  }

  if (command === 'clear prompts') {
    const history = await listMemory(sessionId);
    const answersOnly = history.filter(m => m.from === 'bot');
    await overwriteMemory(sessionId, answersOnly);
    return '🧹 All prompts have been cleared.';
  }

  if (command === 'list answers') {
    const history = await listMemory(sessionId);
    await storeAnalytics(sessionId, 'answer');
    const answerMessages = history.filter(m => m.from === 'bot' && !m.isWelcome);
    return answerMessages.map((m, i) => `${i + 1}. ${m.text}`).join('\n');
  }

  if (command.startsWith('show last') && command.includes('answers')) {
    const n = parseInt(command.split(' ')[2], 10);
    const history = await listMemory(sessionId);
    const answerMessages = history.filter(m => m.from === 'bot' && !m.isWelcome);
    return answerMessages.slice(-n).map((m, i) => `${i + 1}. ${m.text}`).join('\n');
  }

  if (command === 'show full answers') {
    const history = await listMemory(sessionId);
    const answerMessages = history.filter(m => m.from === 'bot' && !m.isWelcome);
    return JSON.stringify(answerMessages, null, 2);
  }

  if (command === 'clear answers') {
    const history = await listMemory(sessionId);
    const promptsOnly = history.filter(m => m.from === 'user');
    await overwriteMemory(sessionId, promptsOnly);
    return '🧹 All answers have been cleared.';
  }

  if (command === 'show analytics') {
    const analyticsBlobName = `session-${sessionId}-analytics.json`;
    const analyticsClient = containerClient.getBlockBlobClient(analyticsBlobName);
    let analytics = {
      prompts: 0,
      answers: 0,
      exports: {},
      files: []
    };
    try {
      const download = await analyticsClient.downloadToBuffer();
      analytics = JSON.parse(download.toString());
    } catch (err) {
      if (err.statusCode !== 404) throw err;
    }
    const { formatAnalytics } = require('../utils/analyticsFormatter');
    return formatAnalytics(analytics, sessionModuleWindows[sessionId] || []);
  }

  // If an integration module is active for this session, try to answer using its ask method
  const activeModuleName = sessionActiveModules[sessionId];
  if (activeModuleName) {
    // Load module topics if they exist
    const moduleTopicsPath = path.join(__dirname, `../services/${activeModuleName}/mainModuleTopics.js`);
    let topics = [];
    if (fs.existsSync(moduleTopicsPath)) {
      try {
        topics = require(moduleTopicsPath);
      } catch (e) {
        topics = [];
      }
    }
    // Check if any topic matches the user message (case insensitive)
    const messageLower = text.toLowerCase();
    const isApiTopic = topics.some(topic => messageLower.includes(topic.toLowerCase()));

    const mod = integrationsRegistry.getLoadedModule(activeModuleName);

    // If a topic matches, call the API and inject as context to LLM
    if (isApiTopic && mod && typeof mod.run === 'function') {
      const stats = await mod.run();
      if (stats && !stats.error) {
        const prompt = [
          `You have real-time Microsoft Entra data available.`,
          `User Question: "${text}"`,
          `Data: ${JSON.stringify(stats)}`,
          `Answer based ONLY on the provided data above. If the question is unrelated, respond as usual.`
        ].join('\n');
        const aiResponse = await generateChatCompletion([{ role: 'user', content: prompt }]);
        return aiResponse;
      }
    }

    // Otherwise, fallback to module's ask method for pattern matches, if you want to keep this:
    if (mod && typeof mod.ask === 'function') {
      const moduleAnswer = await mod.ask(text);
      if (moduleAnswer && !moduleAnswer.startsWith("I don't understand")) {
        return moduleAnswer;
      }
    }
  }


    // ✅ Fallback to OpenAI chat completion
    const messages = [{ role: 'user', content: text }];
    const aiResponse = await generateChatCompletion(messages);
    return aiResponse;
  }

module.exports = {
  handleCommand,
  storeAnalytics,
};
