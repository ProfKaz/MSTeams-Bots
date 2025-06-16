// utils/exportUtils.js
const { BlobSASPermissions, generateBlobSASQueryParameters, SASProtocol, StorageSharedKeyCredential } = require('@azure/storage-blob');
const { URL } = require('url');
const config = require('../config/config');

const sharedKeyCredential = new StorageSharedKeyCredential(
  config.azureBlob.connectionString.match(/AccountName=([^;]+)/)[1],
  config.azureBlob.connectionString.match(/AccountKey=([^;]+)/)[1]
);

function generateExportUrl(sessionId) {
  const blobName = `session-${sessionId}.json`;
  const now = new Date();
  const expiresOn = new Date(now.valueOf() + 60 * 60 * 1000); // 1 hour

  const sasToken = generateBlobSASQueryParameters({
    containerName: config.azureBlob.containerName,
    blobName,
    permissions: BlobSASPermissions.parse('r'),
    startsOn: now,
    expiresOn,
    protocol: SASProtocol.Https,
  }, sharedKeyCredential).toString();

  return new URL(`/` + config.azureBlob.containerName + `/${blobName}?${sasToken}`,
    `https://${config.azureBlob.connectionString.match(/AccountName=([^;]+)/)[1]}.blob.core.windows.net`
  ).href;
}

module.exports = {
  generateExportUrl,
};