// server/oauthPrompt.js
const { OAuthPrompt } = require('botbuilder-dialogs');
const config = require('../config/config');

const oauthPrompt = new OAuthPrompt('OAuthPrompt', {
  connectionName: config.oauthConnectionName,
  text: 'Please sign in to continue.',
  title: 'Sign In',
  timeout: 300000, // 5 minutes
});

module.exports = oauthPrompt;
