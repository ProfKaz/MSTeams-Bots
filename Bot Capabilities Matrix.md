# Bot Capabilities Matrix

This matrix includes all validated capabilities available in the Kaz Bot implementation, confirmed from the `server.js` source, `.env` configuration, and past chat-based setup instructions. Tables are grouped by function: runtime services, memory handling, command parsing, and advanced configurations.

---

## ✅ Core Runtime Features

| Feature             | Present | Notes                                              |
| ------------------- | ------- | -------------------------------------------------- |
| Express Server      | Yes     | Listens on `/api/messages` and `/health`           |
| dotenv config       | Yes     | Loads environment variables from `.env`            |
| BotFrameworkAdapter | Yes     | Fully configured with optional App ID and Password |
| Error Handling      | Yes     | User-friendly emoji-based error responses          |
| Message Routing     | Yes     | All user messages routed via `handleMessage()`     |
| Health Endpoint     | Yes     | Returns `200 OK` at `/health`                      |

---

## 🧠 Memory and Session Management

| Capability                 | Present | Notes                                                       |
| -------------------------- | ------- | ----------------------------------------------------------- |
| MemoryProvider integration | Yes     | Loads/stores memory per user                                |
| In-memory state            | Yes     | Conversation and User scoped memory fallback                |
| Azure Blob support         | Yes     | Enabled via `.env` and used through `memoryProvider.js`     |
| Long-term session tracking | Yes     | Memory persists across restarts if Azure Blob is configured |

---

## 💬 Command Parsing and Responses

| Command                           | Present | Notes                                     |
| --------------------------------- | ------- | ----------------------------------------- |
| `KazBot help!`                    | Yes     | Lists supported commands                  |
| `list memory`, `list memory full` | Yes     | Lists short or complete memory log        |
| `show last N`                     | Yes     | Fetches N latest memory entries via regex |
| `reset memory`                    | Yes     | Clears all saved memory                   |
| Fallback to OpenAI Chat           | Yes     | All other text is sent to Azure OpenAI    |
| `conversationUpdate`              | Yes     | Sends greeting + help menu on join        |

---

## 🔐 Authentication Methods

| Method                                  | Present   | Notes                                                            |
| --------------------------------------- | --------- | ---------------------------------------------------------------- |
| Microsoft Entra OAuthPrompt scaffolding | Preserved | Uses `OAUTH_CONNECTION_NAME` from `.env`, dialog included        |
| App ID / Password Authentication        | Optional  | Only used when configured in `.env`, otherwise skipped for local |
| Bot Service OAuth Connection            | Available | Required when used in Teams via Azure Bot configuration          |

---

## 🧪 Advanced or Placeholder Features

| Feature                             | Status           | Notes                                                          |
| ----------------------------------- | ---------------- | -------------------------------------------------------------- |
| Middleware Bot Logic for eDiscovery | Placeholder only | Architecture ready, functionality can be wired into middleware |
| Static File Export (Markdown, JSON) | Yes              | Memory export written to files and available via public route  |
| Client/Secret for Azure identity    | Yes              | Configured via `.env` and referenced in OAuth connection       |
| Azure OpenAI integration            | Partially active | Keys and deployment name set, endpoint format needs validation |

---

If new modules are added (e.g., proactive notifications, adaptive cards, APIs), this matrix should be updated accordingly.

<br><br>
