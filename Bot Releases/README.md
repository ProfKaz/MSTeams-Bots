# 📦 Kaz Bot Release Packages – README (June 2025)

This page tracks the different release packages of the Kaz Bot shared through versioned ZIP archives. Use this index to reference available builds, understand their purpose, and access the right version for your needs.

---

## 🔖 Versioned Packages Table

| Date       | File Name                          | Version | Description                                                                                                                       |
| ---------- | ---------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 2025-06-16 | KazBot - 2.0 (local execution).zip | 2.0     | First public release for local development. Includes full command handling, OpenAI integration, session memory, and export logic. |
| 2025-06-17 | Unavailable | 2.1     | Enhanced topic-based Teams/SharePoint/OneDrive analytics, advanced CSV parsing, LLM prompt improvements, new module standards.    |
| 2025-06-18 | KazBot - 2.2 (local execution).zip | 2.2     | Improved hot reload, updated dependency management, new export/download features, README and documentation updates.               |

---

## 📁 Folder Usage

* **Bot Releases/** — This is the folder where official release ZIP packages like `KazBot - 2.2 (local execution).zip` are shared.
* **Bot Components/** — This folder always contains the **latest functional version** of the bot code, which may include hotfixes or untagged updates.

> 📌 Tip: Always start from the latest ZIP in **Releases/** for clean installs, and monitor **Bot Components/** for enhancements.

---

## 🆕 Module Update & Compatibility Guidance

Kaz Bot and its modules (including Microsoft 365 Reports) follow a continuous integration and release practice. For developers and contributors:

* Always test module updates with the latest bot version from **Bot Components/** before releasing or packaging.
* Follow new best practices: hot reload, module structure (`moduleStructure.js`), topic management (`mainModuleTopics.js`), module-level `.env` files.
* Document all module changes in both the module `info.md` and this `README.md` release table.
* For each release, summarize new features, bug fixes, and compatibility considerations.
* Stay aligned with the current export/download and directory conventions defined by the latest release.

| Date       | Version | Module Change Summary                                               | Required Bot Version |
| ---------- | ------- | ------------------------------------------------------------------- | -------------------- |
| 2025-06-17 | 2.1     | Added topic-based Teams/SharePoint/OneDrive analytics, CSV parsing. | 2.1                  |
| 2025-06-18 | 2.2     | Enhanced LLM prompt handling, export/download improvements.         | 2.2                  |

---

## 📣 Release & Compatibility Best Practices

* Modules should remain compatible with both the current release and the previous major version unless stated otherwise.
* When introducing breaking changes (commands, config, API endpoints), update `info.md` and `README.md` accordingly.
* Always provide clear documentation of new dependencies or Microsoft Graph API use.

---

### #KazBot #ReleaseManagement #VersionControl #M365Reports #OpenSource #IntegrationBestPractices #BotComponents

<br><br>
