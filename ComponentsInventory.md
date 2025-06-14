# Local Installation – Component Inventory

## 1. Microsoft Entra App Registration

* Required for authentication if your bot uses OAuth flows or calls Microsoft APIs.

## 2. Azure OpenAI Resource

* Needed if your bot uses GPT or Azure OpenAI APIs.

## 3. Node.js Environment

* Node.js (matching your version in `package.json`)
* NPM (Node Package Manager)

## 4. Source Code

* Your middleware bot codebase, including all files and folders as per the working version you will share.

## 5. Environment Variable Configuration

* `.env` file or environment variable setup, containing secrets (client IDs, tenant IDs, API keys, etc.).

## 6. Bot Framework Emulator

* For local bot conversation testing and debugging.

---

### Optional / Advanced (not required for basic local test, but often used)

* **Azure Storage Account:** For session/memory persistence if not handled in-memory.
* **Microsoft Teams App Manifest:** Only needed if you later want to sideload into Teams for local testing.

---

| Component                    | Required for Local? | Purpose                               |
| ---------------------------- | ------------------- | ------------------------------------- |
| Microsoft Entra App          | Yes                 | Bot authentication (OAuth, API calls) |
| Azure OpenAI Resource        | Yes (if used)       | GPT-powered features                  |
| Node.js Environment          | Yes                 | Runs the server code                  |
| Source Code                  | Yes                 | Middleware and all supporting files   |
| Environment Variables (.env) | Yes                 | Securely store credentials/config     |
| Bot Framework Emulator       | Yes                 | Test bot locally                      |
| Azure Storage Account        | Optional            | Persist session/memory beyond runtime |
| Teams App Manifest           | Optional            | Teams channel integration (later)     |

<\br><\br>
