# Step 3: Azure OpenAI Resource

To enable GPT-powered features in your bot, you must create and configure an Azure OpenAI resource. This step will guide you through provisioning the resource and setting the required values in your `.env` file.

---

## 3.1. Create an Azure OpenAI Resource

1. Go to the [Azure Portal](https://portal.azure.com/).
2. Click **Create a resource** and search for **Azure OpenAI**.
3. Click **Create** and fill in the required information:

   * **Subscription**: Select your Azure subscription.
   * **Resource Group**: Choose an existing group or create a new one.
   * **Region**: Select a supported region (e.g., East US).
   * **Name**: Choose a unique name for your resource.
4. Click **Review + Create** and then **Create**.

---

## 3.2. Deploy a Model

1. Once the resource is created, navigate to your **[Azure OpenAI](https://oai.azure.com/)** resource in the portal.
2. Go to the **Model deployments** section.
3. Click **Create** or **Deploy model**.
4. Choose a model (e.g., `gpt-35-turbo` or `gpt-4`).
5. Enter a **Deployment name** (e.g., `gpt-35-turbo-dev`).
   *This will be referenced in your `.env` file.*
6. Complete the deployment.

---

## 3.3. Collect Required Keys and Endpoints

1. In your Azure OpenAI resource, find the **Keys and Endpoint** section.
2. Copy the following values:

   * **Endpoint** (e.g., `https://<your-resource-name>.openai.azure.com/`)
   * **Key** (API Key for authenticating requests)

---

## 3.4. Store Values in Your .env File

Open your project’s `.env` file and add or update the following variables (replace with your real values):

```env
# Azure OpenAI Settings
AZURE_OPENAI_ENDPOINT=https://<your-resource-name>.openai.azure.com/
AZURE_OPENAI_KEY=your-azure-openai-key
AZURE_OPENAI_DEPLOYMENT=your-model-deployment-name
```

| Variable                  | Purpose                                  |
| ------------------------- | ---------------------------------------- |
| AZURE\_OPENAI\_ENDPOINT   | Base URL for Azure OpenAI API            |
| AZURE\_OPENAI\_KEY        | API Key for Azure OpenAI resource        |
| AZURE\_OPENAI\_DEPLOYMENT | Deployment name of your chosen GPT model |

---

## 3.5. Validation

* Confirm that your `.env` file contains the correct values and that the file is not committed to source control.
* You can test connectivity by running your bot locally and verifying that it responds to messages via the Bot Framework Emulator.

---

### Next Step

Proceed to **Step 4: (Optional) Azure Blob Storage** if you wish to enable persistent memory, or continue to running and testing your bot locally.

---
<br><br>
