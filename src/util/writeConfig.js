const jsonfile = require('jsonfile');
const path = require('path');

file = path.join(__dirname, '..', '..', 'config.json');

module.exports = async config => {
    try {
        await jsonfile.writeFile(file, config);
    } catch (err) {
        throw err;
    }
};
