// utils/helpText.js

module.exports = `
# KazBot Help

Welcome to KazBot! Below are the main commands and features you can use:

---

## 🧩 **Integration Modules**

- \`!kazbot command services\`  
  List all available integration modules.

- \`!kazbot <integration name>\`  
  View a summary and description of a specific integration (e.g., \`!kazbot Microsoft Entra\`).

---

## 🔄 **Lifecycle Management**

Use these commands to control any integration module (replace <module> with the name as listed):

- \`!kazbot init <module>\`  
  Initialize and prepare the integration module.

- \`!kazbot close <module>\`  
  Dispose or unload the integration module.

- \`!kazbot status <module>\`  
  Show the current status of the module.

- \`!kazbot restart <module>\`  
  Restart (close + init) the module.

- \`!kazbot help <module>\`  
  Display usage help and custom commands for the module.

---

## 📦 **Session Memory and Analytics**

- \`list memory\`  
  List your recent conversation (excluding welcome messages).

- \`list memory full\`  
  Show the full JSON of your memory.

- \`show last <N>\`  
  Show the last N messages.

- \`reset memory\`  
  Clear the session memory.

- \`list prompts\`  
  List all user prompts.

- \`show last <N> prompts\`  
  Show the last N user prompts.

- \`show full prompts\`  
  Show all user prompts in JSON.

- \`clear prompts\`  
  Remove all prompts.

- \`list answers\`  
  List all bot answers.

- \`show last <N> answers\`  
  Show the last N bot answers.

- \`show full answers\`  
  Show all bot answers in JSON.

- \`clear answers\`  
  Remove all bot answers.

- \`show analytics\`  
  View full session analytics and integration module usage.

- \`!kazbot show session analytics\`  
  Show analytics only for the period(s) when any integration module was active.

---

## 📤 **Export Features**

- \`export memory as json\`  
  Export your session memory as a downloadable JSON file.

- \`export prompts as json\`  
  Export only user prompts.

- \`export answers as markdown\`  
  Export all answers in Markdown format.

- \`!kazbot export session answers\`  
  Export only answers generated while any integration module was active (Markdown).

- \`!kazbot export session memory\`  
  Export only memory items from active module windows (Markdown).

- \`!kazbot export session prompts\`  
  Export only prompts (user questions) from active module windows (Markdown).

---

## 💬 **Fallback: Chat with OpenAI**

Any message that does not match a command will be answered by the AI.

---

Need help with a specific integration?  
Use \`!kazbot help <module>\` (e.g., \`!kazbot help Microsoft Entra\`) for module-specific usage.

---
KazBot © 2024 | #KazBot #Integration #Automation #Lifecycle #Microsoft365
`;
