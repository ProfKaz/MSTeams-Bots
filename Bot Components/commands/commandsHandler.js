// commands/commandsHandler.js
const { listMemory, resetMemory, getLastN } = require('../middleware/memoryProvider');
const { generateChatCompletion } = require('../middleware/openAIIntegration');
const { BlobServiceClient } = require('@azure/storage-blob');
const config = require('../config/config');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

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
    return `💡 Available commands:

📚 Memory Options:
- list memory
- list memory full
- reset memory

🧾 Prompts Options:
- list prompts
- show last N prompts
- show full prompts
- clear prompts

📬 Answers Options:
- list answers
- show last N answers
- show full answers
- clear answers

📤 Export Options:
- export memory as json
- export prompts as json
- export answers as markdown

📈 Analytics:
- show analytics`;
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

  const exportStats = Object.entries(analytics.exports || {})
    .map(([type, count]) => `  - ${type}: ${count}`)
    .join('\n') || '  - None';

  function getFriendlyExportText(name) {
    if (name.endsWith('-prompts.json')) return 'Your prompts';
    if (name.endsWith('-answers.md')) return 'Answers received';
    if (name.endsWith('.json')) return 'Memory collected';
    return 'Exported file';
  }

  // Display each export as a Markdown link with an emoji, each on its own line
  const exportDetails = (analytics.files || []).map(entry => {
    let size = '';
    try {
      const stat = fs.statSync(path.join(__dirname, '../public', entry.name));
      size = ` (${(stat.size / 1024).toFixed(2)} KB)`;
    } catch {}
    const friendly = getFriendlyExportText(entry.name);
    // Markdown-style link (works in Teams, Web Chat, etc)
    return `\n\t🔗 ${friendly}: ${getBaseUrl(context)}/download/${entry.name} ${size}`;
  }).join('\n') || '  • None';

  return `📊 Analytics for this session:\n`
    + `- User prompts: ${analytics.prompts}\n`
    + `- Bot answers: ${analytics.answers}\n`
    + `- Export counts:\n ${exportStats}\n`
    + `- Exported files:\n ${exportDetails}`;
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
