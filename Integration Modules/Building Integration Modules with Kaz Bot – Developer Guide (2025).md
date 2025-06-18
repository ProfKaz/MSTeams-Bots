# 🛠️ Building Integration Modules with Kaz Bot – Developer Guide (2025)

Kaz Bot’s modular architecture empowers developers to rapidly create, test, and deploy new integrations—whether you’re connecting to Microsoft 365 APIs, third-party services, or internal tools. This guide provides a clear process and best practices for building integration modules with maximum maintainability and developer agility.

---

## Why Use the Modular Approach?

* **Isolation:** Each module lives in its own folder under `/services/<module>`, ensuring clear separation of logic, configuration, and documentation.
* **Scalability:** Add, update, or remove modules independently—no impact on the core bot or other integrations.
* **Hot Reload:** Modules can be updated and reloaded instantly, supporting continuous integration and rapid prototyping.
* **Security:** Separate `.env` files per module allow fine-grained control over secrets and API keys.
* **Documentation:** Each module includes its own `info.md`—keeping end-user and developer help close to the code.
* **Open Source & Team-Friendly:** This architecture enables parallel development and easy contribution reviews.

---

## 🧩 Standard Integration Module Structure

Every module should follow this structure:

```
/services/<module>/
  ├── main.js             # Entrypoint – commands, handlers, registration
  ├── info.md             # Module documentation and usage
  ├── config.js           # Module-specific configuration logic
  ├── .env                # (Optional) Module-scoped secrets, keys, endpoints
  ├── commands.js         # (Optional) List and implement custom bot commands
  ├── api.js              # (Optional) REST/Graph API logic, external calls
  ├── moduleStructure.js  # (Optional) Validates required files for this module
```

---

## 📝 The Role of `main.js`

* **Entry Point:**
  All module logic begins in `main.js`. Here you define:

  * Which commands are registered with the bot.
  * How those commands are handled (handlers, middleware, callbacks).
  * Any setup or teardown logic (`init`, `close`, `reload`, etc.).
* **Registration:**
  The bot automatically loads each `main.js` in `/services/*` at runtime, wiring up commands and endpoints.
* **Loose Coupling:**
  `main.js` can import helpers from other files in its folder (e.g., `api.js`, `commands.js`), keeping logic modular and easy to test.
* **Lifecycle Hooks:**
  Implement `init`, `close`, `reload`, and status-checking for advanced lifecycle control.

---

## 🌡️ Hot Reload & Instant Testing

* **No Restart Needed:**
  Any changes to your module (`main.js`, `commands.js`, etc.) are detected instantly—no need to restart the main bot.
* **Faster Prototyping:**
  Try new logic, debug, and roll out fixes in seconds.
* **Safe Updates:**
  Faulty or incomplete modules only affect themselves; the bot will continue to run and alert you to specific errors.
* **Best Practice:**
  Make small, incremental changes and test commands via the bot’s interface—hot reload gives you immediate feedback.

---

## 🔐 Module-Level `.env` Files (Security & Flexibility)

* **Why Separate `.env`?**
  Each module may require unique secrets, API keys, or endpoints (e.g., different Azure tenants, API providers).
  Keeping these settings in a module-specific `.env` avoids leaking secrets between modules and reduces blast radius for security issues.
* **How To Use:**
  Place a `.env` in your module folder (e.g., `/services/entra/.env`), and load it in `config.js` or at module init.
* **Best Practices:**

  * Never commit `.env` files with real secrets to version control—always use `.env.example`.
  * Use clear, descriptive variable names (`ENTRA_CLIENT_ID`, `PURVIEW_API_KEY`, etc.).
  * Support fallback to the global `.env` for defaults if module-scoped values are not set.

---

## ⚡ Step-by-Step: Creating a New Module

1. **Create the Folder:**

   * `mkdir /services/myIntegration`

2. **Add Required Files:**

   * `main.js` — Entry point and command logic.
   * `info.md` — Module help, usage, and troubleshooting.
   * (Optional) `config.js`, `.env`, `commands.js`, `api.js` as needed.

3. **Implement Commands in `main.js`:**

   * Define and export your custom commands.
   * Use lifecycle hooks (`init`, `reload`, etc.) for setup or resource management.
   * Leverage utilities from `/utils` for analytics, session management, and exports.

4. **Configure Secrets:**

   * Place sensitive info in `.env` in your module.
   * Reference these in `config.js` for secure loading.

5. **Document Everything:**

   * Fill out `info.md` with usage examples, prerequisites, and troubleshooting tips.

6. **Test and Iterate:**

   * Use bot commands like `!kazbot reload myIntegration` or test commands via chat.
   * Monitor analytics with `!kazbot show session analytics`.

7. **Hot Reload for Updates:**

   * Edit and save your code; changes are applied immediately.
   * Use status/lifecycle commands to confirm or debug.

---

## ✅ Advantages for Developers

* **Rapid iteration:** Try new APIs, business logic, or compliance checks and see results instantly.
* **Parallel development:** Teams can build and test modules without blocking each other.
* **Easier onboarding:** New contributors only need to understand module APIs—not the whole bot.
* **Lower risk:** Module crashes don’t bring down the whole bot. Warnings and logs are module-specific.
* **Compliance ready:** Exports, memory, and audit logs can be module scoped for business/legal requirements.

---

## 🚀 Pro Tips

* Use `moduleStructure.js` to enforce required files for every new integration.
* Extend the bot’s command list in `commands.js` for user-friendly or advanced operations.
* Keep API logic (`api.js`) separate from command handlers for clean code.
* Use module analytics for feature usage stats and troubleshooting.
* Always provide clear help and troubleshooting in `info.md` for end users and admins.

---

## 🔍 Advanced Module Patterns: `mainModuleTopic.js` & `moduleStructure.js`

### `mainModuleTopic.js` — Topic Intelligence for LLM & API Context

* **Purpose:**
  This file enables each integration module to define and manage its own topics—key for LLM-powered bots and API connectors that benefit from topic-aware memory, prompts, and context filtering.

* **Advantages:**

  * **LLM Optimization:**
    By structuring how topics are created, retrieved, and referenced within a module, you can ensure LLM responses are always contextually relevant and leverage the most appropriate memory and prompts.
  * **Scoped API Interactions:**
    APIs that require context switching (e.g., user profiles, tickets, workflows) can map bot “topics” to external resources, making it easy to maintain state across commands.
  * **Separation of Concerns:**
    Keeps topic logic modular—changes in how topics are handled in one module won’t impact others.
  * **Easy Testing:**
    Developers can adjust topic logic in isolation, enabling rapid experiments on LLM prompt engineering or context windows.

* **Best Practice:**
  Always provide a `mainModuleTopic.js` in your module to define how topics are created, updated, listed, or linked to API entities.
  Expose helper functions to main command handlers (in `main.js`) and document expected topic patterns in `info.md`.

---

### `moduleStructure.js` — Enforcing Module Consistency

* **Purpose:**
  This file formally lists the expected files and dependencies for every module (e.g., `main.js`, `info.md`, `config.js`, `commands.js`, `api.js`, `mainModuleTopic.js`, `.env`). It serves both as **documentation** and as a **runtime validator**.

* **Advantages:**

  * **Predictable Structure:**
    Maintains uniformity across all integrations, so developers and automation tools know what to expect.
  * **Automated Checks:**
    The bot can check for missing files at startup or module load, warning developers or blocking incomplete modules from running.
  * **Better Onboarding:**
    New contributors see immediately what files are required, optional, or recommended.
  * **Safer Refactoring:**
    Changes to module patterns are easier to enforce and propagate across all services.

* **Best Practice:**
  Every module should include `moduleStructure.js` and update it as the module evolves.
  Use this file for both automated file presence checks and as living documentation for required/optional pieces.

---

## Example: Complete Module File List

```
/services/myIntegration/
  ├── main.js               # Entrypoint – commands, handlers
  ├── info.md               # Help and usage docs
  ├── config.js             # Configuration loader
  ├── .env                  # Module-specific secrets
  ├── commands.js           # Custom command list and handlers
  ├── api.js                # API call logic
  ├── mainModuleTopic.js    # Topic management for LLM/API context
  ├── moduleStructure.js    # Expected file/documentation list and runtime validation
```

---

**Using both `mainModuleTopic.js` and `moduleStructure.js` ensures your modules are not only powerful and context-aware, but also maintainable, discoverable, and team-friendly.**

---

### #KazBot #IntegrationModules #DevGuide #ModularBot #HotReload #NodeJS #OpenSource #DevExperience #BestPractices
