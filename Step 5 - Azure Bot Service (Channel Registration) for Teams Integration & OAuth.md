# Step 5: Azure Bot Service (Channel Registration) for Teams Integration & OAuth

> **Disclaimer:**
> Enabling Azure Bot Service with Teams integration and an OAuth connection allows you to manage user sessions through Microsoft Entra, supporting persistent chat memory and multiple connections per user across different devices or Teams clients. When running your bot locally with the Bot Framework Emulator, these capabilities are not used—session management is handled in-memory, and authentication flows are skipped. However, if you plan to deploy to Teams or other production channels, completing this step is essential for robust authentication and user experience.

---

Azure Bot Service is required to:

* Make your bot available on Microsoft Teams (and other channels).
* Configure secure OAuth connections for Microsoft Entra or third-party authentication.
* Enable advanced session management for multi-device and cross-client scenarios.

---

## 5.1. Create an Azure Bot Channel Registration

1. Go to the [Azure Portal](https://portal.azure.com/).
2. Click **Create a resource** and search for **Bot Channels Registration**.
3. Click **Create** and complete the required fields:

   * **Bot handle**: Choose a globally unique name.
   * **Subscription/Resource Group**: Select as appropriate.
   * **Region**: Select your preferred Azure region.
   * **Messaging endpoint**: For local testing, set to `http://localhost:3978/api/messages` (use your ngrok URL when exposing your bot externally)
   * **Microsoft App ID** and **Password**: Use the values from your `.env` (`MicrosoftAppId`, `MicrosoftAppPassword`).
4. Click **Review + Create** and then **Create**.

---

## 5.2. Configure Microsoft Teams Channel

1. After deployment, open your Bot Service in Azure.
2. In the **Channels** blade, click **Microsoft Teams**.
3. Follow the prompts to enable the Teams channel.
4. Save and note any Teams-specific settings you may want to configure (calling, notifications, etc.).

---

## 5.3. Add an OAuth Connection (for Authentication)

1. In your Bot Service, go to the **Settings** or **OAuth Connections** blade.
2. Click **+ Add Setting** or **+ New Connection Setting**.
3. Fill out the connection details:

   * **Name**: Must match the `OAUTH_CONNECTION_NAME` in your `.env`
   * **Service Provider**: Select **Azure Active Directory v2**.
   * **Client id / Secret / Tenant id**: Use your Microsoft Entra App values.
   * **Scopes**: Enter the necessary permissions (e.g., `openid profile User.Read`).
4. Save your connection.
5. Your bot code can now use this OAuth connection to prompt users for authentication in Teams.

---

## 5.4. Update Your .env File (Reference)

Ensure the following values are present:

```env
MicrosoftAppId=your-application-client-id
MicrosoftAppPassword=your-client-secret
OAUTH_CONNECTION_NAME=your-oauth-connection-name
```

---

## 5.5. Validation

* In the Azure portal, your bot status should show as **Registered**.
* Teams channel should show as **Running**.
* Test OAuth connection by invoking an authentication flow from Teams (your bot may prompt for sign-in if implemented).

> **Note:** When running locally, you may need to use a tool like [ngrok](https://ngrok.com/) to expose your local bot endpoint to Teams.

---

### Next Step

Proceed to creating a Teams app manifest and sideloading the bot in Teams for user testing, or begin full deployment to your desired channels.

---
<br><br>
