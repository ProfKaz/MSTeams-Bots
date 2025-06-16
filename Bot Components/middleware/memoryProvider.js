// middleware/memoryProvider.js
const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');

const blobServiceClient = BlobServiceClient.fromConnectionString(
  config.azureBlob.connectionString
);
const containerClient = blobServiceClient.getContainerClient(
  config.azureBlob.containerName
);

const getSessionBlobName = (sessionId) => `session-${sessionId}.json`;

async function storeMessage(sessionId, message) {
  const blobName = getSessionBlobName(sessionId);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  let existingMessages = [];
  try {
    const downloadBlockBlobResponse = await blockBlobClient.downloadToBuffer();
    existingMessages = JSON.parse(downloadBlockBlobResponse.toString());
  } catch (err) {
    if (err.statusCode !== 404) throw err;
  }

  existingMessages.push({ timestamp: new Date().toISOString(), ...message });
  await blockBlobClient.upload(JSON.stringify(existingMessages), Buffer.byteLength(JSON.stringify(existingMessages)));
}

async function listMemory(sessionId) {
  const blobName = getSessionBlobName(sessionId);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    const downloadBlockBlobResponse = await blockBlobClient.downloadToBuffer();
    return JSON.parse(downloadBlockBlobResponse.toString());
  } catch (err) {
    if (err.statusCode === 404) return [];
    throw err;
  }
}

async function resetMemory(sessionId) {
  const blobName = getSessionBlobName(sessionId);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.deleteIfExists();
}

async function getLastN(sessionId, n) {
  const history = await listMemory(sessionId);
  return history.slice(-n);
}

module.exports = {
  storeMessage,
  listMemory,
  resetMemory,
  getLastN,
};
