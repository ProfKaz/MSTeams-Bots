# 🗂️ Kaz Bot Folder Structure & Component Guide

This guide provides an overview of the folder structure and the purpose of each file in the Kaz Bot project. It is intended to help developers understand the architecture and contribute more effectively.

---

## Root Files

| File           | Purpose                                                            |
| -------------- | ------------------------------------------------------------------ |
| `index.js`     | Entry point if using alternate startup or routing methods.         |
| `package.json` | Declares all dependencies and scripts used by the bot.             |
| `.env`         | Stores environment variables used by the bot (secrets, endpoints). |

---

## 📁 commands/

| File                 | Purpose                                                         |
| -------------------- | --------------------------------------------------------------- |
| `commandsHandler.js` | Core logic for processing user commands and dispatching output. |

---

## 📁 config/

| File        | Purpose                                                         |
| ----------- | --------------------------------------------------------------- |
| `config.js` | Centralized configuration loading and helper logic for the bot. |

---

## 📁 middleware/

| File                   | Purpose                                                             |
| ---------------------- | ------------------------------------------------------------------- |
| `analytics.js`         | Tracks and logs command usage for basic analytics reporting.        |
| `memoryProvider.js`    | Stores, retrieves, and manages user session memory (local or blob). |
| `openAIIntegration.js` | Connects to Azure OpenAI to send prompts and receive responses.     |

---

## 📁 public/

> 📁 This folder is used to serve exported files via static links.
> When a user exports memory or prompts, downloadable links point here.

---

## 📁 server/

| File             | Purpose                                                       |
| ---------------- | ------------------------------------------------------------- |
| `server.js`      | Main Express server startup file and bot configuration logic. |
| `botAdapter.js`  | Initializes and configures the Bot Framework Adapter.         |
| `oauthPrompt.js` | Handles user authentication flows via Microsoft Entra ID.     |

---

## 📁 utils/

| File              | Purpose                                                          |
| ----------------- | ---------------------------------------------------------------- |
| `exportUtils.js`  | Logic for exporting memory/prompts/answers to markdown or JSON.  |
| `sessionUtils.js` | Helpers for formatting and managing session-specific operations. |

---

This structure ensures clean separation of concerns, making it easy to scale or replace components independently. For example, `openAIIntegration.js` could be swapped with another LLM provider, or `memoryProvider.js` could point to Redis instead of Azure Blob.

> 🧱 Modify with care: Any changes in `middleware`, `server`, or `commands` should be validated through local testing.

<br><br>
