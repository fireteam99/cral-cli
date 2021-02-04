const jsonfile = require('jsonfile');
const path = require('path');

file = path.join(__dirname, '..', '..', 'config.json');

/**
 * Reads the configuration file from disk. Returns null if the file is not found.
 *
 * @returns {Object} The configuration file object
 */
async function readConfig() {
    try {
        const config = await jsonfile.readFile(file);
        return config;
    } catch (err) {
        // if the config file is not found return null
        if (err.code === 'ENOENT') {
            return null;
        } else {
            throw err;
        }
    }
}

module.exports = readConfig;
