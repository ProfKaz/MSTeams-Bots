# 📊 Microsoft 365 Reports Module — Deep Dive & Microsoft Graph API Integration

This section provides a **step-by-step breakdown** for developers integrating Microsoft Graph with Kaz Bot, particularly for reporting and Q\&A scenarios using an Entra App and best-in-class patterns for natural language and analytics.

---

## 🪪 Microsoft Entra App — Authentication & Permissions

### 1. **Register Your App**

* **In Microsoft Entra Admin Center:**

  * Go to **App registrations** > **New registration**.
  * Name your app (e.g., `KazBot-M365Reports`).
  * Set Redirect URI as needed for your bot (or leave blank for client\_credentials).
* **Record these values**:

  * **Application (client) ID**
  * **Directory (tenant) ID**
  * **Client secret** (create under Certificates & Secrets tab)

### 2. **Assign API Permissions**

* Add delegated or application permissions for:

  * `Reports.Read.All` (for all usage/activity reports)
  * `Directory.Read.All` (if you want group/user details)
* **Grant admin consent** to activate the permissions for your tenant.

### 3. **Configure .env**

Add these variables in `/services/m365reports/.env`:

```dotenv
M365_CLIENT_ID=your-app-id
M365_CLIENT_SECRET=your-secret
M365_TENANT_ID=your-tenant-id
```

---

## 🔗 Microsoft Graph API — Endpoints, URLs, and Data

### 1. **API Base URL**

```
https://graph.microsoft.com/v1.0/
```

* For preview/beta features:
  `https://graph.microsoft.com/beta/`

### 2. **Reports Endpoints**

| Report Type           | URL Example                                                 | Notes                   |
| --------------------- | ----------------------------------------------------------- | ----------------------- |
| Teams User Activity   | `/reports/getTeamsUserActivityUserDetail(period='D7')`      | Returns per-user detail |
| Teams Activity Totals | `/reports/getTeamsUserActivityTotalUserCounts(period='D7')` | Daily/period totals     |
| Teams Device Usage    | `/reports/getTeamsDeviceUsageUserDetail(period='D7')`       | Device/platform info    |
| SharePoint Usage      | `/reports/getSharePointSiteUsageDetail(period='D7')`        | Site-level stats        |
| OneDrive Usage        | `/reports/getOneDriveUsageAccountDetail(period='D7')`       | Account activity        |

**Period** can be `D7`, `D30`, `D90`, or `D180`.

**Example Full URL**:

```
https://graph.microsoft.com/v1.0/reports/getTeamsUserActivityUserDetail(period='D7')
```

### 3. **Querying the API from Your Module**

* Use `@microsoft/microsoft-graph-client` or plain `axios`/`fetch` with OAuth 2.0 Bearer token.
* Example (using `axios`):

```js
const axios = require('axios');
const qs = require('querystring');

async function getAccessToken() {
  const tokenUrl = `https://login.microsoftonline.com/${process.env.M365_TENANT_ID}/oauth2/v2.0/token`;
  const params = {
    client_id: process.env.M365_CLIENT_ID,
    scope: 'https://graph.microsoft.com/.default',
    client_secret: process.env.M365_CLIENT_SECRET,
    grant_type: 'client_credentials'
  };
  const { data } = await axios.post(tokenUrl, qs.stringify(params));
  return data.access_token;
}

async function getTeamsUserActivity(period = 'D7') {
  const token = await getAccessToken();
  const url = `https://graph.microsoft.com/v1.0/reports/getTeamsUserActivityUserDetail(period='${period}')`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data; // Usually CSV string for these endpoints
}
```

**Note:** Most Graph reporting endpoints return a CSV string. You may need to parse the CSV with a library (like `csv-parse`).

---

## 📊 Data Returned: Structure and Insights

* **User/Device-level Reports**: Contain fields like `User Principal Name`, `Last Activity Date`, `Teams Chats`, `Calls`, `Meetings`, etc.
* **Totals and Summaries**: Some endpoints give daily summaries (totals) and can be used for quick stats or "how many users used Teams last week?" type questions.
* **Site/Drive Usage**: Returns activity count, storage used, file count, etc.

---

## 📝 Deep Dive: `main.js` — Building for LLM, Analytics, and Q\&A

### **Command Handling and Pattern Matching**

* Map user commands like:

  * `!kazbot m365 reports teams activity D7`
  * `!kazbot m365 reports sharepoint usage D30`
* Extract the topic (Teams, SharePoint, OneDrive), the action (activity, usage), and the period (D7, D30, ...).

### **Topic Management via `mainModuleTopics.js`**

* **Topics** represent logical report types.

* Enables users (or the LLM) to simply ask:
  “How many Teams meetings happened this week?”
  → Module detects “Teams Activity”, queries the right endpoint, summarizes, and replies.

* *mainModuleTopics.js* Example:

  ```js
  module.exports = {
    topics: [
      { name: 'Teams Activity', endpoint: 'getTeamsUserActivityUserDetail', defaultPeriod: 'D7', summaryFields: ['Teams Chats', 'Meetings'] },
      { name: 'SharePoint Usage', endpoint: 'getSharePointSiteUsageDetail', defaultPeriod: 'D7', summaryFields: ['ViewedOrEditedFileCount'] },
    ],
    getEndpointForTopic(topicName) {
      return this.topics.find(t => t.name === topicName);
    }
  };
  ```

### **Pre-configured Q\&A Patterns**

* Predefine questions the module can answer, like:

  * "Show total Teams meetings this month."
  * "Export all user activity for SharePoint."
* These can be pattern-matched or exposed as LLM prompt templates, making Q\&A responses instant and accurate.

### **Totals, Summaries, and LLM Interactions**

* **Totals**: Parse and sum relevant CSV columns for quick stats ("There were 732 Teams meetings in the last 7 days").
* **Custom Analytics**: Provide breakdowns by user, department, or activity.
* **Natural Language Summaries**: Return results in friendly language for end users or LLM follow-up (“Your organization’s SharePoint activity increased by 10% compared to last period”).

#### Example: Totals Calculation

```js
const csv = require('csv-parse/sync');

async function getTeamsMeetingsTotal(period = 'D7') {
  const csvData = await getTeamsUserActivity(period);
  const records = csv.parse(csvData, { columns: true });
  const totalMeetings = records.reduce((sum, rec) => sum + Number(rec['Meetings Organized'] || 0), 0);
  return totalMeetings;
}
```

#### Example: Responding in `main.js`

```js
bot.registerCommand('!kazbot m365 reports teams meetings total', async (context) => {
  const total = await getTeamsMeetingsTotal('D7');
  return `Total Teams meetings in the last 7 days: **${total}**.`;
});
```

---

## 💡 **Best Practices for This Kind of Module**

* **Decouple logic:**
  Keep all Graph/auth logic in `api.js`. Only command registration and orchestration in `main.js`.
* **Centralize topic config:**
  Use `mainModuleTopics.js` for mapping human topics/LLM queries to endpoints, and expose helper methods.
* **Support flexible periods:**
  Default to `D7`, but parse user input for other periods (`D30`, `D90`, etc.).
* **Robust error handling:**
  Always validate API results; handle token expiry, permission errors, malformed CSV, or missing fields gracefully.
* **Pre-configure useful Q\&A:**
  Anticipate common business questions and offer ready-made patterns in help and LLM prompt lists.
* **Self-documenting commands:**
  Register help text with every command so users and the LLM can discover capabilities.
* **Enable exports:**
  Allow users to download raw CSV/JSON/Markdown from every major query.

---

### #KazBot #MicrosoftGraph #M365Reports #BotIntegration #EntraApp #LLM #QnA #OpenSource #Analytics #BotDevelopment
