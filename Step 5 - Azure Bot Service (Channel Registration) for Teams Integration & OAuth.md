# Step 5: Azure Bot Service (Channel Registration) for Teams Integration & OAuth

> **Disclaimer:**
> Enabling Azure Bot Service with Teams integration and an OAuth connection allows you to manage user sessions through Microsoft Entra, supporting persistent chat memory and multiple connections per user across different devices or Teams clients. When running your bot locally with the Bot Framework Emulator, these capabilities are not used—session management is handled in-memory, and authentication flows are skipped. However, if you plan to deploy to Teams or other production channels, completing this step is essential for robust authentication and user experience.

---

Azure Bot Service is required to:

* Make your bot available on Microsoft Teams (and other channels).
* Configure secure OAuth connections for Microsoft Entra or third-party authentication.
* Enable advanced session management for multi-device and cross-client scenarios.

---

## 5.1. Create an Azure Bot Service (via Marketplace)

1. Go to the [Azure Portal](https://portal.azure.com/).
2. Click **Create a resource** and search for **Azure Bot** in the Azure Marketplace.
3. Select **Azure Bot** from the marketplace results.
4. Click **Create** and complete all required fields:

   * **Bot handle**: Choose a globally unique name.
   * **Subscription/Resource Group**: Select as appropriate.
   * **Region**: Select your preferred Azure region.
   * **Microsoft App ID & Password**: Use the values from your `.env` (`MicrosoftAppId`, `MicrosoftAppPassword`). You can create a new App Registration here if not already created.
   * **Messaging endpoint**: For local testing, use `http://localhost:3978/api/messages`. For remote testing, use your ngrok HTTPS URL.
   * Complete other fields as required.
5. Click **Review + Create** and then **Create** to deploy the bot resource.

---

## 5.2. Access Bot Service for Channel Configuration

1. After deployment, navigate to the new resource by searching for **Bot Services** in the Azure Portal menu.
2. Select your newly created bot from the list.
3. Here you will find the **Channels** blade, where you can enable Teams and other channels, and the **Settings** for OAuth connections.

---

## 5.3. Configure Microsoft Teams Channel

1. In the **Channels** blade of your Bot Service, click **Microsoft Teams**.
2. Follow the prompts to enable the Teams channel.
3. Save and configure Teams-specific settings (e.g., calling, notifications) as needed.

---

## 5.4. Add an OAuth Connection (for Authentication)

1. In your Bot Service, go to **Settings** > **Configuration**.
2. Scroll down and click **Add OAuth Connection Settings**.
3. Fill out the connection details:

   * **Name**: Must match the `OAUTH_CONNECTION_NAME` in your `.env`
   * **Service Provider**: Select **Azure Active Directory v2**.
   * **Client ID / Secret / Tenant ID**: Use your Microsoft Entra App values.
   * **Scopes**: Enter the necessary permissions (e.g., `openid profile User.Read`).
4. Click **Save** to create the connection.
5. Your bot can now initiate authentication flows through this connection when used in Microsoft Teams.

---

## 5.5. Update Your .env File (Reference)

Ensure the following values are present:

```env
MicrosoftAppId=your-application-client-id
MicrosoftAppPassword=your-client-secret
OAUTH_CONNECTION_NAME=your-oauth-connection-name
```

---

## 5.6. Validation

* In the Azure portal, your bot status should show as **Registered**.
* Teams channel should show as **Running**.
* Test OAuth connection by invoking an authentication flow from Teams (your bot may prompt for sign-in if implemented).

> **Note:** When running locally, you may need to use a tool like [ngrok](https://ngrok.com/) to expose your local bot endpoint to Teams.

---

## 5.7. Streaming Endpoint Configuration

The **Enable Streaming Endpoint** option under **Settings > Configuration** in Azure Bot Service should remain **unchecked** unless you specifically need support for:

* WebSocket-based **Direct Line** clients
* **Speech SDK** scenarios
* **Proactive messaging** via WebSockets

For most use cases, including local development with the Bot Framework Emulator and Teams integration via HTTP(S), **this setting is not required**.

---

### Next Step

Proceed to creating a Teams app manifest and sideloading the bot in Teams for user testing, or begin full deployment to your desired channels.

---

<br><br>
