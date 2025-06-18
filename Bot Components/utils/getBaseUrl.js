// utils/getBaseUrl.js

module.exports = function getBaseUrl(context) {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL.replace(/\/$/, '');
  }
  return 'http://localhost:3978'; // fallback for local dev
};