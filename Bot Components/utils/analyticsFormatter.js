// utils/analyticsFormatter.js
function formatAnalytics(analytics, modules = []) {
  let out = `📊 Analytics for this session:\n`
    + `- User prompts: ${analytics.prompts}\n`
    + `- Bot answers: ${analytics.answers}\n`
    + `- Export counts:\n`;

  if (analytics.exports) {
    for (const [type, count] of Object.entries(analytics.exports)) {
      out += `  - ${type}: ${count}\n`;
    }
  } else {
    out += '  - None\n';
  }

  if (analytics.files && analytics.files.length) {
    out += `- Exported files:\n`;
    for (const entry of analytics.files) {
      out += `  • ${entry.name} (${entry.timestamp})\n`;
    }
  } else {
    out += `- Exported files:\n  • None\n`;
  }

  if (modules.length) {
    out += `\n=== Integration Module Usage ===\n`;
    modules.forEach(m => {
      out += `- ${m.name}: initiated at ${m.initTime}${m.closedAt ? `, closed at ${m.closedAt}` : ', still active'}\n`;
    });
  }
  return out;
}
module.exports = { formatAnalytics };
