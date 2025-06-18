// config/config.js
require('dotenv').config();

module.exports = {
  microsoftAppId: process.env.MicrosoftAppId,
  microsoftAppPassword: process.env.MicrosoftAppPassword,
  azureOpenAI: {
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    key: process.env.AZURE_OPENAI_KEY,
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
  },
  azureBlob: {
    connectionString: process.env.AZURE_BLOB_CONNECTION_STRING,
    containerName: process.env.AZURE_BLOB_CONTAINER_NAME,
  },
  oauthConnectionName: process.env.OAUTH_CONNECTION_NAME,
  isLocal: process.env.NODE_ENV !== 'production',
  port: process.env.PORT || 3978,
  baseUrl: process.env.BASE_URL,
};
