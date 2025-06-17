const axios = require('axios');
require('dotenv').config();

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_KEY;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;

if (!endpoint || !apiKey || !deployment) {
  throw new Error("Missing Azure OpenAI environment variables.");
}

// Azure endpoint expects format: https://YOUR_RESOURCE.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT/chat/completions?api-version=2024-02-15-preview
const apiVersion = '2024-02-15-preview'; // Make sure your Azure resource supports this version

/**
 * Call Azure OpenAI for chat completion (with optional functions)
 * @param {Array} messages - [{role: 'user', content: '...'}]
 * @param {Array} functions - (optional) array of function schemas (JSON)
 * @param {Object} functionHandlers - (optional) mapping functionName -> async handler
 */
async function generateChatCompletion(messages, functions = [], functionHandlers = {}) {
  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
  const headers = {
    'api-key': apiKey,
    'Content-Type': 'application/json'
  };
  const data = {
    messages,
    temperature: 0.2
  };
  if (functions && functions.length) {
    data.functions = functions;
    data.function_call = 'auto';
  }

  const response = await axios.post(url, data, { headers });
  const choice = response.data.choices[0];

  // Function calling logic
  if (choice.finish_reason === 'function_call' && choice.message.function_call) {
    const { name, arguments: argsJSON } = choice.message.function_call;
    const args = JSON.parse(argsJSON || '{}');
    if (functionHandlers[name]) {
      const functionResult = await functionHandlers[name](args);
      // Add the function response as a message and re-ask LLM
      messages.push(choice.message);
      messages.push({
        role: 'function',
        name,
        content: JSON.stringify(functionResult)
      });
      // Recursive call: let the model compose a final answer for the user
      return generateChatCompletion(messages, functions, functionHandlers);
    }
    return `Error: No handler found for function ${name}`;
  }

  // No function call, return standard reply
  return choice.message.content;
}

module.exports = { generateChatCompletion };
