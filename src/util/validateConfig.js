const readConfig = require('./readConfig');
const configQuestions = require('../questions/configQuestions');

// returns an array of questions for fields that failed validation
async function validateConfig() {
    const config = await readConfig();

    // find the config properties that failed validation
    const failed = configQuestions.filter(q => {
        configProp = config[q.name];
        // fail if config property is missing
        if (configProp == null) {
            return true;
        }
        // try to validate the config property
        if (q.validate && !q.validate(configProp)) {
            return true;
        }
        return false;
    });
    return failed;
}

module.exports = validateConfig;
