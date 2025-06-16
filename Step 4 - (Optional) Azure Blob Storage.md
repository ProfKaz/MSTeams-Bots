# Step 4: (Optional) Azure Blob Storage

> **Disclaimer:**
> If you do not configure an Azure Blob Storage account, your bot will store all session data and message history only in memory. This means the total number of prompts and answers that can be retained per session is limited by available system memory and the constraints in your codebase. Without persistent storage, all session data will be lost when the bot is restarted, and features such as exporting full session history or retrieving conversations across restarts will not function reliably. For complete export and persistent session features, it is recommended to enable Azure Blob Storage.

If you want your bot to persist memory or conversation history beyond the current runtime (for example, to support advanced session features or analytics), you can configure Azure Blob Storage as a backend. This step is optional—your bot will still run locally without it, but features requiring persistent storage will not be available.

---

## 4.1. Create an Azure Storage Account

1. Go to the [Azure Portal](https://portal.azure.com/).
2. Click **Create a resource** and search for **Storage account**.
3. Click **Create** and fill in the required information:

   * **Subscription**: Select your Azure subscription.
   * **Resource Group**: Use an existing one or create a new one.
   * **Storage account name**: Choose a unique name.
   * **Region**: Select your preferred Azure region.
4. Click **Review + Create** and then **Create**.

---

## 4.2. Create a Blob Container

1. After the storage account is deployed, navigate to it.
2. Under **Data storage**, select **Containers**.
3. Click **+ Container** to create a new container.

   * **Name**: Choose a name (e.g., `bot-memory`).
   * **Public access level**: Set to **Private (no anonymous access)**.
4. Click **Create**.

---

## 4.3. Retrieve Connection Information

1. In your storage account, go to **Access keys** (under **Security + networking**).
2. Copy the **Connection string** for **key1**.

---

## 4.4. Update Your .env File

Add the following variables to your `.env` file (replace with your actual values):

```env
# Azure Blob Storage
AZURE_BLOB_CONNECTION_STRING=your-azure-blob-connection-string
AZURE_BLOB_CONTAINER_NAME=bot-memory
```

| Variable                        | Purpose                                |
| ------------------------------- | -------------------------------------- |
| AZURE\_BLOB\_CONNECTION\_STRING | Full connection string to storage acct |
| AZURE\_BLOB\_CONTAINER\_NAME    | Name of the blob container to use      |

---

## 4.5. Validation

* Confirm your bot starts and logs show successful connection to Azure Blob Storage (check your bot logs/output).
* Data (e.g., memory or logs) should now persist even if the bot restarts.

---

### Next Step

You can now proceed to some final steps at **[Step 5: Azure Bot Service (Channel Registration) for Teams Integration & OAuth](Step%205%20-%20Azure%20Bot%20Service%20%28Channel%20Registration%29%20for%20Teams%20Integration%20&%20OAuth.md)**

---
<br><br>
