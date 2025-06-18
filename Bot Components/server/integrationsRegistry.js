// integrationsRegistry.js

const path = require('path');
const fs = require('fs');

const loadedModules = {};

function getModuleFolder(moduleName) {
  // Read all folders in ../services
  const servicesRoot = path.join(__dirname, '../services');
  const folders = fs.readdirSync(servicesRoot, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  // Find a folder name that matches (case-insensitive, spaces ignored)
  const normalized = name => name.replace(/\s+/g, '').toLowerCase();
  const matched = folders.find(f => normalized(f) === normalized(moduleName));
  return matched ? path.join(servicesRoot, matched) : null;
}

function getModulePath(moduleName) {
  const folder = getModuleFolder(moduleName);
  return folder ? path.join(folder, 'main.js') : null;
}

function getHelpPath(moduleName) {
  const folder = getModuleFolder(moduleName);
  return folder ? path.join(folder, 'moduleHelp.md') : null;
}

async function initModule(moduleName) {
  if (loadedModules[moduleName]) {
    return `Module '${moduleName}' already initialized.`;
  }
  try {
    const mod = require(getModulePath(moduleName));
    if (mod.init) await mod.init();
    loadedModules[moduleName] = { mod, status: 'initialized' };
    return `Module '${moduleName}' initialized.`;
  } catch (e) {
    return `Failed to initialize module '${moduleName}': ${e.message}`;
  }
}

async function closeModule(moduleName) {
  if (!loadedModules[moduleName]) return `Module '${moduleName}' is not running.`;
  try {
    if (loadedModules[moduleName].mod.close) await loadedModules[moduleName].mod.close();
    delete loadedModules[moduleName];
    return `Module '${moduleName}' closed.`;
  } catch (e) {
    return `Error closing module '${moduleName}': ${e.message}`;
  }
}

async function statusModule(moduleName) {
  if (!loadedModules[moduleName]) return `Module '${moduleName}' is not initialized.`;
  try {
    if (loadedModules[moduleName].mod.status) {
      return await loadedModules[moduleName].mod.status();
    }
    return `Module '${moduleName}' status: loaded.`;
  } catch (e) {
    return `Error getting status for module '${moduleName}': ${e.message}`;
  }
}

async function restartModule(moduleName) {
  await closeModule(moduleName);
  return await initModule(moduleName);
}

async function helpModule(moduleName) {
  const helpPath = getHelpPath(moduleName);
  if (helpPath && fs.existsSync(helpPath)) {
    return fs.readFileSync(helpPath, 'utf8');
  } else {
    return `No help available for module '${moduleName}'.`;
  }
}

function getLoadedModule(moduleName) {
  // Handles folder normalization the same way as the rest of the code
  const normalized = name => name.replace(/\s+/g, '').toLowerCase();
  // Find the loaded module whose normalized name matches
  for (const loadedName of Object.keys(loadedModules)) {
    if (normalized(loadedName) === normalized(moduleName)) {
      return loadedModules[loadedName]?.mod || null;
    }
  }
  return null;
}

async function reloadModule(moduleName) {
  // Normalize folder name
  const modulePath = getModulePath(moduleName);
  if (!modulePath || !fs.existsSync(modulePath)) {
    throw new Error(`Module '${moduleName}' not found at expected path.`);
  }
  // Remove from require cache
  delete require.cache[require.resolve(modulePath)];
  // If the module was loaded, attempt to close it gracefully first
  if (loadedModules[moduleName] && loadedModules[moduleName].mod && loadedModules[moduleName].mod.close) {
    try {
      await loadedModules[moduleName].mod.close();
    } catch (err) {
      // Ignore errors during close, continue reload
    }
  }
  // Require again and re-init
  try {
    const mod = require(modulePath);
    if (mod.init) await mod.init();
    loadedModules[moduleName] = { mod, status: 'initialized' };
    return `Module '${moduleName}' reloaded successfully.`;
  } catch (e) {
    throw new Error(`Failed to reload module '${moduleName}': ${e.message}`);
  }
}

module.exports = {
  initModule,
  closeModule,
  statusModule,
  restartModule,
  helpModule,
  getLoadedModule, // Returns the loaded module object for the given moduleName, or null if not loaded.
  reloadModule
};
