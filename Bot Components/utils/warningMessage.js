// utils/warningMessage.js

const fs = require('fs');
const path = require('path');

function missingComponentWarning(folder, missingFiles, modulePath) {
    const githubUrl = 'https://github.com/ProfKaz/MSTeams-Bots';
    const filesText = missingFiles.map(f => `- \`${f}\``).join('\n');

    // List all files in the module folder, besides info.md and main.js
    let extraFiles = [];
    try {
        const allFiles = fs.readdirSync(modulePath);
        extraFiles = allFiles.filter(f => !['main.js', 'info.md'].includes(f));
    } catch {}

    let additionalFilesNote = '';
    if (extraFiles.length > 0) {
        additionalFilesNote =
            `\n\n🔎 Note: This module folder also contains other file(s):\n`
            + extraFiles.map(f => `- \`${f}\``).join('\n')
            + `\nIf these files are mentioned in the module documentation or required for operation, please ensure they are present and up to date.`;
    }

    return (
        `⚠️ Warning: The integration folder **"${folder}"** is missing required file(s):\n${filesText}\n\n`
        + `At minimum, \`main.js\` is mandatory for all modules, but \`info.md\` and other files may also be required for proper operation.\n`
        + `This may indicate the module was not downloaded completely or is missing files.\n`
        + `\nPlease verify the module in the official repository:\n${githubUrl}\n`
        + `\nIf the issue persists, ensure that at least \`main.js\` and \`info.md\` exist in the integration folder, and review documentation for any additional requirements.`
        + additionalFilesNote
    );
}

module.exports = { missingComponentWarning };
