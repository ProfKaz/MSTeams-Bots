# Step 6: Run and Test Locally

This step focuses on running your bot locally using Node.js and testing it through the Bot Framework Emulator. You’ll also understand which packages are installed and what new files/folders are created during this process.

---

## 6.1. Install Dependencies

Your project comes with a `package.json` file that lists all the required dependencies.

### Steps:

1. Open a terminal in the root folder of your bot project.
2. Run:

   ```bash
   npm install
   ```

   This will:

   * Download and install all modules listed in `dependencies` and `devDependencies`
   * Create a new folder called `node_modules`
   * Generate or update a file named `package-lock.json`

---

## 6.2. Files and Folders Created

After running `npm install`, you should see:

* `node_modules/` – A directory containing all installed npm packages
* `package-lock.json` – A file that records the exact version of every installed package

These files are essential for consistent execution across environments.

> **Tip:** Add `node_modules/` to your `.gitignore` to avoid committing large binary files to version control.

---

## 6.3. Start the Bot

To run the bot locally:

```bash
node server/server.js
```

If successful, you should see console output indicating the bot is listening (e.g., `✅ Server running on port 3978`).

---

## 6.4. Connect Using Bot Framework Emulator

### Option A: Without Authentication

If you're running the bot locally and do not require Microsoft Entra authentication:

1. Ensure your `.env` file has these values **empty or commented out**:

   ```env
   # MicrosoftAppId=
   # MicrosoftAppPassword=
   ```
2. Restart the bot: `node server/server.js`
3. Open Bot Framework Emulator
4. Connect to:

   ```
   http://localhost:3978/api/messages
   ```
5. Leave **Microsoft App ID** and **Password** fields blank

### Option B: With Authentication

If you have defined values for `MicrosoftAppId` and `MicrosoftAppPassword` in your `.env`, then:

1. Use those exact values when prompted in the Emulator.
2. This will allow the Emulator to authenticate and connect correctly.

> ⚠️ If credentials are incorrect or mismatched, you will receive a 401 Unauthorized error.

---

## 6.5. Validation Checklist

* [ ] Bot starts without errors using `node server/server.js`
* [ ] Emulator connects to `http://localhost:3978/api/messages`
* [ ] Messages are sent and received successfully
* [ ] Optional: Memory/session features and OpenAI responses work as expected

---

### Next Step

You are now ready to create a **Teams App Manifest** and sideload your bot for testing inside Microsoft Teams.

---

<br><br>
