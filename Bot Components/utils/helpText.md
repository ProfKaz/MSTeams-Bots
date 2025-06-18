# KazBot Help

---

## 🧩 Integration Modules
- `!kazbot command services` — List all available integration modules.
- `!kazbot <integration name>` — View a summary of a specific integration (e.g., `!kazbot Microsoft Entra`).

---

## 🔄 Lifecycle Management
- `!kazbot init <module>` — Initialize an integration.
- `!kazbot close <module>` — Unload an integration.
- `!kazbot status <module>` — Show module status.
- `!kazbot restart <module>` — Restart a module.
- `!kazbot reload <module>` — Reload the code and environment variables for a module.
- `!kazbot help <module>` — Module-specific help.

---

## 📦 Session Memory and Analytics
- `list memory` — Show recent conversation.
- `list memory full` — Show full session memory.
- `show last <N>` — Show last N messages.
- `reset memory` — Clear memory.
- `list prompts`, `show last <N> prompts`, `show full prompts`, `clear prompts`
- `list answers`, `show last <N> answers`, `show full answers`, `clear answers`
- `show analytics`, `!kazbot show session analytics`

---

## 📤 Export Features
- `export memory as json`, `export prompts as json`, `export answers as markdown`
- `!kazbot export session answers`, `!kazbot export session memory`, `!kazbot export session prompts`

---

## 💬 Fallback: Chat with OpenAI
Any other message will be answered by the AI.

---

Need help with a specific integration?  
Use `!kazbot help <module>` (e.g., `!kazbot help Microsoft Entra`).

KazBot © 2024 | #KazBot #Integration #Automation #Lifecycle #Microsoft365
