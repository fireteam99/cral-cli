const readConfig = require('./readConfig');
const configQuestions = require('../questions/configQuestions');

// returns an array of questions for fields that failed validation
async function validateConfig() {
    const config = await readConfig();

    // find the config properties that failed validation
    const failed = configQuestions.filter(({ name, validate }) => {
        configProp = config[name];
        // fail if config property is missing
        if (configProp == null) {
            return true;
        }
        // fail if there is a validation function and it fails
        // note that `q.validate` return a string if is invalid
        // and true if valid
        if (validate && validate(configProp) !== true) {
            return true;
        }
        return false;
    });
    return failed;
}

module.exports = validateConfig;
