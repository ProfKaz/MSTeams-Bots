// index.js (summary index to launch Server2.0 bot)
const config = require('./config/config');
const adapter = require('./server/botAdapter');
const oauthPrompt = require('./server/oauthPrompt');
const memory = require('./middleware/memoryProvider');
const analytics = require('./middleware/analytics');
const ai = require('./middleware/openAIIntegration');
const commands = require('./commands/commandsHandler');
const sessionUtils = require('./utils/sessionUtils');
const exportUtils = require('./utils/exportUtils');

module.exports = {
  config,
  adapter,
  oauthPrompt,
  memory,
  analytics,
  ai,
  commands,
  sessionUtils,
  exportUtils,
};
