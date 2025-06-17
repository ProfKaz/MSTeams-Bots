// server/serviceManager.js
const fs = require('fs');
const path = require('path');

const SERVICES_DIR = path.join(__dirname, '..', 'services'); // Go up one level to root

function ensureServicesDir() {
    if (!fs.existsSync(SERVICES_DIR)) {
        fs.mkdirSync(SERVICES_DIR);
    }
}

function getAvailableIntegrations() {
    ensureServicesDir();
    const folders = fs.readdirSync(SERVICES_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    if (folders.length === 0) {
        return null;
    }

    return folders.map(folder => {
        const infoPath = path.join(SERVICES_DIR, folder, 'info.md');
        let info = "_No description available._";
        if (fs.existsSync(infoPath)) {
            info = fs.readFileSync(infoPath, 'utf-8').trim();
        }
        return `### ${folder}\n${info}`;
    });
}

module.exports = {
    getAvailableIntegrations
};
