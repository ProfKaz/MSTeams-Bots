// utils/sessionUtils.js
const { v4: uuidv4 } = require('uuid');

function getSessionId(activity) {
  // Prefer conversation ID; fallback to user ID
  return activity.conversation?.id || activity.from?.id || uuidv4();
}

function getTimestamp() {
  return new Date().toISOString();
}

module.exports = {
  getSessionId,
  getTimestamp,
};
