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
node server.js
```

If successful, you should see console output indicating the bot is listening (e.g., `✅ Bot is running on http://localhost:3978/api/messages`).

---

## 6.4. Connect Using Bot Framework Emulator

1. Open [Bot Framework Emulator](https://aka.ms/botframework-emulator).
2. Click **Open Bot**.
3. Use the following endpoint:

   ```
   http://localhost:3978/api/messages
   ```
4. Interact with your bot to test capabilities such as:

   * Azure OpenAI responses
   * Memory storage (in-memory or Azure Blob if configured)
   * Logging and commands

> If you’ve configured authentication or Azure Blob, verify those functionalities as well.

---

## 6.5. Validation Checklist

* [ ] Bot starts without errors using `node server.js`
* [ ] Emulator successfully connects to `http://localhost:3978/api/messages`
* [ ] You can send and receive messages
* [ ] Memory and session handling behave as expected

---

### Next Step

You are now ready to create a **Teams App Manifest** and sideload your bot for testing inside Microsoft Teams.

---

<br><br>
