// utils/helpText.js
const fs = require('fs');
const path = require('path');
module.exports = fs.readFileSync(path.join(__dirname, 'helpText.md'), 'utf8');
