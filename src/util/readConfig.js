const jsonfile = require('jsonfile');
const path = require('path');

file = path.join(__dirname, '..', '..', 'config.json');

module.exports = async () => {
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
};
