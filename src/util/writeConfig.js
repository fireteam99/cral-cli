const jsonfile = require('jsonfile');
const path = require('path');

file = path.join(__dirname, '..', '..', 'config.json');

/**
 * Writes a config to file.
 *
 * @param {Object} config An object containing the configuration settings
 */
async function writeConfig(config) {
    try {
        await jsonfile.writeFile(file, config);
    } catch (err) {
        throw err;
    }
}

module.exports = writeConfig;
