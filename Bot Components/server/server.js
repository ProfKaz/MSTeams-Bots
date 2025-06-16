// server/server.js
const express = require('express');
const config = require('../config/config');
const adapter = require('./botAdapter');
const { handleCommand } = require('../commands/commandsHandler');
const { storeAnalytics } = require('../commands/commandsHandler');
const { getSessionId } = require('../utils/sessionUtils');
const { trackUserActivity } = require('../middleware/analytics');
const { storeMessage } = require('../middleware/memoryProvider');
const path = require('path');

const app = express();
app.use(express.json());
app.use('/download', express.static(path.join(__dirname, '../public')));

app.post('/api/messages', (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    const sessionId = getSessionId(context.activity);

    if (context.activity.type === 'message') {
      const userText = context.activity.text;

      await trackUserActivity(sessionId, context.activity);
      await storeMessage(sessionId, { from: 'user', text: userText });

      const reply = await handleCommand(userText, sessionId, context);
      await storeMessage(sessionId, { from: 'bot', text: reply });
      await storeAnalytics(sessionId, 'answer');
      await context.sendActivity(reply);

    } else if (context.activity.type === 'conversationUpdate') {
      for (const member of context.activity.membersAdded) {
        if (member.id !== context.activity.recipient.id) {
          const welcomeMessage = '👋 Welcome to Kaz Bot demos! Let me know how I can assist you today.';
          const commandsMessage = `💡 Available commands:

📚 Memory Options:
- list memory
- list memory full
- reset memory

🧾 Prompts Options:
- list prompts
- show last N prompts
- show full prompts
- clear prompts

📬 Answers Options:
- list answers
- show last N answers
- show full answers
- clear answers

📤 Export Options:
- export memory as json
- export prompts as json
- export answers as markdown

📈 Analytics:
- show analytics`;

          await context.sendActivity(welcomeMessage);
          await context.sendActivity(commandsMessage);

          await storeMessage(sessionId, { from: 'bot', text: welcomeMessage, isWelcome: true });
          await storeMessage(sessionId, { from: 'bot', text: commandsMessage, isWelcome: true });
        }
      }
    }
  });
});

app.get('/health', (req, res) => res.status(200).send('OK'));

app.listen(config.port, () => {
  console.log(`✅ Server running on port ${config.port}`);
});
