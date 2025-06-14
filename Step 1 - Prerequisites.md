# Step 1: Prerequisites

Before starting your local middleware bot installation, make sure you have the following accounts, tools, and permissions in place.

## 1.1. Accounts and Access

* **Azure Account**
  Required to register applications (Entra), create Azure OpenAI resources, and manage API keys.

* **Microsoft Account (Personal or Work)**
  Needed if you want to access Microsoft Teams, Graph API, or authenticate via Microsoft Entra.

## 1.2. Tools to Install

* **Node.js**
  Install [Node.js LTS version](https://nodejs.org/) (check your project's `package.json` for exact version).
  *Verify installation:*

  ```bash
  node -v
  npm -v
  ```

* **Bot Framework Emulator**
  Download from [here](https://aka.ms/botframework-emulator).
  This is essential for local bot development and debugging.

* **Text Editor or IDE**
  [VS Code](https://code.visualstudio.com/) is recommended for best experience with Node.js and debugging.

* **Git (optional)**
  For source code version control and GitHub integration.

## 1.3. Permissions

* **Azure Portal access**
  Permissions to create resources: App registrations, Azure OpenAI, and manage resource groups.

* **API Management**
  Access to required endpoints (e.g., OpenAI endpoints, Graph API, etc.) depending on your bot’s feature set.

---

## 1.4. Checklist Before You Begin

* [ ] Azure and Microsoft account credentials available
* [ ] Node.js (LTS) and npm installed and verified
* [ ] Bot Framework Emulator installed
* [ ] Text editor or IDE (VS Code recommended) installed
* [ ] Git installed (optional, but recommended)
* [ ] Permissions to create/manage Azure resources
* [ ] Access to required API endpoints (OpenAI, Graph, etc.)

---

#### **Next Step**

Proceed to **Step 2: Microsoft Entra App Registration** to create the authentication backbone for your bot.

---
<br><br>
