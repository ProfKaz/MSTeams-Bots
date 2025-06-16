# 📘 Kaz Bot Command Guide for End Users

This guide explains how to interact with Kaz Bot using simple, human-friendly commands. Each command is designed to either help you manage your session, explore available data, or export content.

---

## 🧠 Memory Commands

| Command            | Description                                                      |
| ------------------ | ---------------------------------------------------------------- |
| `list memory`      | Shows a short summary of memory entries for the current session. |
| `list memory full` | Displays the full memory history for your session.               |
| `reset memory`     | Clears all stored memory. Use with caution.                      |

---

## ✏️ Prompts Commands

| Command               | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `list prompts`        | Shows all prompts stored in the session.              |
| `show last N prompts` | Displays the last N prompts. Replace N with a number. |
| `show full prompts`   | Displays the entire prompt history.                   |
| `clear prompts`       | Clears all stored prompts from the session.           |

---

## 📬 Answers Commands

| Command               | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `list answers`        | Shows all answers generated during the session.       |
| `show last N answers` | Displays the last N answers. Replace N with a number. |
| `show full answers`   | Displays the entire answer history.                   |
| `clear answers`       | Clears all stored answers.                            |

---

## 📤 Export Commands

| Command                      | Description                                            |
| ---------------------------- | ------------------------------------------------------ |
| `export memory as json`      | Exports the memory log as a JSON file.                 |
| `export prompts as json`     | Exports prompt history as a JSON file.                 |
| `export answers as markdown` | Exports answers in Markdown format with download link. |

After these commands are run, Kaz Bot will reply with a clickable download link.

---

## 📈 Analytics

| Command          | Description                                                   |
| ---------------- | ------------------------------------------------------------- |
| `show analytics` | Displays statistics about usage, memory counts, and activity. |

---

## 🤖 General Use

| Command          | Description                                                   |
| ---------------- | ------------------------------------------------------------- |
| `KazBot help!`   | Shows a categorized list of all supported commands.           |
| *Any other text* | Sent to Azure OpenAI (ChatGPT) for a conversational response. |

---

## 💬 Welcome Behavior

Kaz Bot will greet you automatically when a new conversation begins with:

* A friendly welcome message
* A list of supported command categories
* A prompt to use `KazBot help!` for more details

---

## 🛠 Behind the Scenes

* Commands are routed dynamically based on text patterns.
* Session data (memory, prompts, answers) is stored in memory or Azure Blob Storage.
* Supports downloading history and inspecting bot behavior for transparency and review.

---

> Have fun exploring, learning, and chatting. If you're ever stuck, just type: `KazBot help!`

<br><br>

