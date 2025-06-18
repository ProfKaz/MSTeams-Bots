# 📁 Kaz Bot Project Structure & File Reference (v2.1 – June 2025)

Below is the actual structure based on your package. Every folder and file is detailed for its technical or operational purpose.

---

## Root Level

| Path / File    | Type   | Description                                                             |
| -------------- | ------ | ----------------------------------------------------------------------- |
| `/`            | Folder | Project root                                                            |
| `/commands/`   | Folder | All bot command registration, handlers, and command pattern logic.      |
| `/middleware/` | Folder | Custom Express/BotFramework middleware: request parsing, logging, auth. |
| `/server/`     | Folder | Main bot runtime, entrypoint, service setup, and environment detection. |
| `/services/`   | Folder | All integration modules; each as subfolder, fully pluggable.            |
| `/utils/`      | Folder | Reusable scripts: analytics, helpers, formatting, URL/build tools.      |
| `/public/`     | Folder | Exports, downloads, public assets.                                      |
| `/config/`     | Folder | Configuration loading and environment settings.                         |
| `.env`         | Config | Environment variables for secrets, keys, endpoints.                     |
| `package.json` | Config | Project definition, dependencies, scripts.                              |
| `README.md`    | Doc    | Quick start and top-level usage.                                        |

---

## /commands

| File                 | Type | Description                                                             |
| -------------------- | ---- | ----------------------------------------------------------------------- |
| `commandsHandler.js` | JS   | Main command parser/dispatcher. Routes recognized commands to handlers. |

---

## /middleware

| File                   | Type | Description                                                   |
| ---------------------- | ---- | ------------------------------------------------------------- |
| *(3 files, ex:)*       |      |                                                               |
| `authMiddleware.js`    | JS   | Handles authentication, token parsing, session injection.     |
| `loggingMiddleware.js` | JS   | Request and response logging for audit/debug.                 |
| `customMiddleware.js`  | JS   | (Sample) Any additional pre/post processing for bot requests. |

---

## /server

| File           | Type | Description                                                              |
| -------------- | ---- | ------------------------------------------------------------------------ |
| `server.js`    | JS   | **Entrypoint.** Sets up Express, BotFrameworkAdapter, loads all modules. |
| `routes.js`    | JS   | HTTP route definitions for API, downloads, health, etc.                  |
| `init.js`      | JS   | Initialization logic for the server.                                     |
| `bootstrap.js` | JS   | Bootstraps config, logging, diagnostics before main runtime.             |
| `constants.js` | JS   | Key constants for routing, command patterns, or settings.                |

---

## /utils

| File                    | Type | Description                                                      |
| ----------------------- | ---- | ---------------------------------------------------------------- |
| *(7 files, ex:)*        |      |                                                                  |
| `analyticsFormatter.js` | JS   | Formats usage and analytics output for bot commands.             |
| `getBaseUrl.js`         | JS   | Detects and builds public download URLs based on env/context.    |
| `warningMessage.js`     | JS   | Dynamic error messages if files/folders are missing/incomplete.  |
| `sessionHelper.js`      | JS   | Session utilities for splitting/joining windows, session states. |
| `memoryFormatter.js`    | JS   | Formatting and filtering memory logs for exports/analytics.      |
| `exportUtils.js`        | JS   | Export logic for memory/prompts/answers in various formats.      |
| `topicManager.js`       | JS   | Handles LLM topic grouping, switching, and context assignment.   |

---

## /services

| Path                        | Type   | Description                                                        |
| --------------------------- | ------ | ------------------------------------------------------------------ |
| `/services/`                | Folder | All modules here; each is pluggable, isolated, hot-reloadable.     |
| `/services/<module>/`       | Folder | One subfolder per integration (e.g., entra, purview, graph, etc.). |
| *(6 files per module, ex:)* |        |                                                                    |
| `main.js`                   | JS     | Module entrypoint; registers commands, handlers, lifecycle hooks.  |
| `info.md`                   | Doc    | Module-specific documentation, help, troubleshooting.              |
| `moduleStructure.js`        | JS     | (Optional) Describes/validates required files for this module.     |
| `config.js`                 | JS     | Module-specific configuration; overrides global config if needed.  |
| `commands.js`               | JS     | List of custom commands, usage patterns, and responses for module. |
| `api.js`                    | JS     | API integrations (Graph, Entra, etc.), endpoints for module logic. |

---

## /public

| File / Folder                  | Type   | Description                                           |
| ------------------------------ | ------ | ----------------------------------------------------- |
| `/public/`                     | Folder | Download/export area for session files, logs, assets. |
| `M365Reports-*.csv`            | CSV    | Sample exported report files.                         |
| `memory-*.json`/`answers-*.md` | Data   | Generated by export commands for user download.       |

---

## /config

| File        | Type | Description                                         |
| ----------- | ---- | --------------------------------------------------- |
| `config.js` | JS   | Loads, validates, exports configuration from `.env` |

---

## Example: `/services/entra` (integration module)

| File                 | Type | Description                                           |
| -------------------- | ---- | ----------------------------------------------------- |
| `main.js`            | JS   | Entry point for Entra module: commands, logic, API.   |
| `info.md`            | Doc  | User/developer guide for this module.                 |
| `moduleStructure.js` | JS   | (Optional) Required file/structure validator.         |
| `config.js`          | JS   | Module-specific configuration, secrets, and settings. |
| `commands.js`        | JS   | Declares custom commands for this integration.        |
| `api.js`             | JS   | REST/Graph API logic for Entra functions.             |

---

### Best Practices

* **Keep all module logic isolated** in its own `/services/<module>/` folder.
* **Never mix core utils and module logic.** Use `/utils` only for cross-bot helpers.
* **Always provide `info.md` for each module** to auto-populate in bot help and GitHub docs.
* **Maintain clear, consistent file naming** across modules for hot reload and developer experience.

---

### #KazBot #ProjectStructure #FileReference #NodeJS #ModularBot #IntegrationModules #OpenSource
