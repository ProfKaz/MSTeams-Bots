// middleware/openAIIntegration.js
const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');
const config = require('../config/config');

const client = new OpenAIClient(
  config.azureOpenAI.endpoint,
  new AzureKeyCredential(config.azureOpenAI.key)
);

async function generateChatCompletion(messages) {
  try {
    const response = await client.getChatCompletions(config.azureOpenAI.deployment, messages, {
      maxTokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('🔴 OpenAI Chat Completion Error:', error);
    return '⚠️ An error occurred while contacting the OpenAI service.';
  }
}

module.exports = {
  generateChatCompletion,
};
