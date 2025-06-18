# 🧩 Kaz Bot Integration Modules — User & Developer Guide (2025 Update)

Kaz Bot’s modular architecture enables seamless integration of new services (modules), supporting lifecycle control, live reload, isolated analytics, and tailored user help—**all without restarting the main bot service**. Below, you will find detailed explanations for every available module-related command and capability.

---

## Table of Contents

* [Introduction to Integration Modules](#introduction-to-integration-modules)
* [Module Discovery & Help](#module-discovery--help)
* [Lifecycle Management Commands](#lifecycle-management-commands)
* [Session Memory & Analytics](#session-memory--analytics)
* [Export Features](#export-features)
* [LLM Chat and Fallback](#llm-chat-and-fallback)
* [Best Practices & Notes](#best-practices--notes)
* [Hashtags](#hashtags)

---

## Introduction to Integration Modules

Kaz Bot is designed for rapid business integration—every new capability, connector, or automation can be delivered as a plug-in module. Modules are placed under the `/services` folder, each with its own folder (e.g., `/services/entra`). **Adding or updating a module requires no restart**; changes are detected and loaded live, maximizing uptime and development velocity.

Each integration can define:

* Its own commands
* Help documentation
* Lifecycle hooks (init, reload, close)
* Analytics and export options
* Isolated session memory and prompt engineering

---

## Module Discovery & Help

| Command                      | Description                                                                                        |
| ---------------------------- | -------------------------------------------------------------------------------------------------- |
| `!kazbot command services`   | Lists all available integration modules, auto-discovered from the `/services` directory.           |
| `!kazbot <integration name>` | Shows a summary of the specified integration, including its current status and available commands. |
| `!kazbot help <module>`      | Shows module-specific help, including usage, supported commands, and troubleshooting info.         |

> **Example:**
> `!kazbot Microsoft Entra` — Get summary of Entra integration
> `!kazbot help Purview` — See all Purview module commands

---

## Lifecycle Management Commands

Lifecycle control empowers both admins and power users to manage integrations with fine granularity. Each module operates independently, so you can reload, restart, or unload modules on the fly.

| Command                    | Description                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------- |
| `!kazbot init <module>`    | Initialize (start) the specified integration. Loads module, runs setup logic if needed.           |
| `!kazbot close <module>`   | Unload (stop) the specified module, freeing up memory/resources but leaving other modules active. |
| `!kazbot status <module>`  | Displays current operational status (loaded, running, error, etc.) for the chosen module.         |
| `!kazbot restart <module>` | Fully restart the integration, helpful for applying code/config changes.                          |
| `!kazbot reload <module>`  | Hot reloads code and environment variables for a module. Changes are reflected immediately.       |
| `!kazbot help <module>`    | Provides module-specific command reference and troubleshooting.                                   |

---

## Session Memory & Analytics

Kaz Bot provides advanced tracking and analytics at both the global and per-module level.
You can filter, review, and export interaction histories—supporting compliance and detailed troubleshooting.

| Command                                 | Description                                                                |
| --------------------------------------- | -------------------------------------------------------------------------- |
| `list memory`                           | Show recent conversation memory (session-wide).                            |
| `list memory full`                      | Show the complete memory history for your session.                         |
| `show last <N>`                         | Show the last N messages from the current session.                         |
| `reset memory`                          | Clear all session memory (use with caution).                               |
| `list prompts`, `show last <N> prompts` | Display prompt history for session, including per module.                  |
| `clear prompts`                         | Clear all stored prompts for the session.                                  |
| `list answers`, `show last <N> answers` | Display answer (response) history, with module awareness.                  |
| `clear answers`                         | Clear all stored answers.                                                  |
| `show analytics`                        | Displays session and module-level usage statistics.                        |
| `!kazbot show session analytics`        | Module/window analytics, including counts, timestamps, and usage patterns. |

> **Note:**
> Analytics commands now track activity by integration module, providing insight into which services are most used and when.

---

## Export Features

Export capabilities support transparency, record-keeping, and business compliance.
Exports can be performed globally or scoped by module.

| Command                          | Description                                           |
| -------------------------------- | ----------------------------------------------------- |
| `export memory as json`          | Export the full session memory as a JSON file.        |
| `export prompts as json`         | Export prompt history as JSON.                        |
| `export answers as markdown`     | Export all answers in Markdown format.                |
| `!kazbot export session answers` | Module-specific export of answers.                    |
| `!kazbot export session memory`  | Export memory just for a specific integration module. |
| `!kazbot export session prompts` | Export prompts for the current session/module.        |

Kaz Bot responds to export commands with a clickable download link for each file.

---

## LLM Chat and Fallback

Any message that does not match a command will be sent to your configured LLM (e.g., Azure OpenAI).
LLM responses are **topic-aware**, and can leverage memory, prompts, and session context, including module-specific data if available.

> Need help with a specific integration?
> Use `!kazbot help <module>` (e.g., `!kazbot help Microsoft Entra`).

---

## Best Practices & Notes

* **Live reload**: Modules are hot-loaded and reloaded without affecting other services or the main bot.
* **No downtime for new modules**: Add, update, or fix any integration and see changes instantly.
* **Topic and context management**: LLM prompt handling is enhanced with topic and module awareness.
* **Composability**: Each module is fully independent—allowing isolated updates, debugging, and analytics.
* **Session transparency**: All session data, including commands, prompts, and LLM answers, can be reviewed or exported.
* **Auto-discovery**: New modules in `/services` are detected and made available immediately.
* **Extensible help**: Module help and troubleshooting are dynamically exposed.

---

### #KazBot #Integration #Automation #Lifecycle #Microsoft365 #LiveReload #ModularBot #HotReload #NodeJS #Analytics #SessionManagement #Compliance #OpenSource
