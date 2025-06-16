// middleware/analytics.js
const { storeMessage } = require('./memoryProvider');

async function trackUserActivity(sessionId, activity) {
  const analyticsEntry = {
    type: 'analytics',
    action: activity.type,
    text: activity.text || '',
    timestamp: new Date().toISOString(),
  };

  await storeMessage(sessionId, analyticsEntry);
}

module.exports = {
  trackUserActivity,
};
