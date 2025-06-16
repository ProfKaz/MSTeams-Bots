// server/botAdapter.js
const { BotFrameworkAdapter } = require('botbuilder');
const config = require('../config/config');

const adapter = new BotFrameworkAdapter({
  appId: config.microsoftAppId,
  appPassword: config.microsoftAppPassword,
});

adapter.onTurnError = async (context, error) => {
  console.error('[onTurnError] 💥 Unhandled error:', error);
  await context.sendActivity('⚠️ The bot encountered an error. Please try again later.');
};

module.exports = adapter;
