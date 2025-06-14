# Step 2: Microsoft Entra App Registration

> **Disclaimer:**
> The API permissions you grant to your Microsoft Entra App will depend on the final use and features of your bot. This initial release is focused on creating a functional bot connected to Azure OpenAI for conversational interaction. In the current version, the bot does **not** make use of Microsoft Graph or other API permissions—these can be expanded in future releases as needed.

---

To enable authentication and prepare for future API integration, you must register an app in Microsoft Entra (Azure AD).
All IDs, secrets, and tenant info will be stored in your project's `.env` file, using the exact variable names required by your codebase.

## 2.1. Register a New App

1. Go to the [Azure Portal](https://portal.azure.com/).
2. Navigate to **Microsoft Entra ID** > **App registrations**.
3. Click **New registration**.
4. Enter a **Name** (e.g., `MyLocalBot`).
5. Set **Supported account types** to “Accounts in this organizational directory only” (default).
6. (Optional) Add a **Redirect URI** for local testing:
   `http://localhost:3978/auth/callback`
7. Click **Register**.

---

## 2.2. Gather Required Application Information

After registration, go to the new app’s **Overview** page and copy:

* **Application (client) ID** (for use as `MicrosoftAppId`)
* **Client Secret** (for use as `MicrosoftAppPassword`)
* (Optional) Directory (tenant) ID, if needed for advanced scenarios

---

## 2.3. Create a Client Secret

1. In your app registration, go to **Certificates & secrets**.
2. Under **Client secrets**, click **New client secret**.
3. Add a description (e.g., “Local Dev Secret”) and select an expiration.
4. Click **Add**.
5. **Copy the value** immediately and save it securely (it will not be shown again).

---

## 2.4. API Permissions

> **Note:** For this initial release, you may leave the default permissions (`User.Read`) assigned to your app. Additional permissions (such as those for Microsoft Graph) are only required if you later add features that need them.

1. Go to **API permissions**.
2. Review the default permission: `User.Read` (Microsoft Graph > Delegated).
3. You may add more permissions in the future as your bot evolves.

---

## 2.5. Store Values in Your .env File

In your bot’s root folder, edit the `.env` file as follows (replace with your real values):

```env
# Bot Framework / Microsoft Entra settings
MicrosoftAppId=your-application-client-id
MicrosoftAppPassword=your-client-secret

# (Optional) Microsoft Entra OAuth Connection
OAUTH_CONNECTION_NAME=your-oauth-connection-name
```

| Variable                | Purpose                                        |
| ----------------------- | ---------------------------------------------- |
| MicrosoftAppId          | App registration Application (client) ID       |
| MicrosoftAppPassword    | App registration client secret                 |
| OAUTH\_CONNECTION\_NAME | Name of OAuth connection in Azure Bot Channels |

> **Note:** The variable names must match those expected by your bot’s source code.

---

## 2.6. Validation

* Ensure the values in your `.env` file match those from the Azure Portal.
* **Do not commit your `.env` file to a public repository!**
  Make sure `.env` is included in your `.gitignore` file.

---

### Next Step

Proceed to **Step 3: Azure OpenAI Resource** to enable AI-powered capabilities.

---
<br><br>
