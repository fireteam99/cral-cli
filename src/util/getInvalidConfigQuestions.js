const configQuestions = require('../questions/configQuestions');

/**
 * Finds a list of questions to prompt to fix invalid config fields
 *
 * @param {Object} config - The user's configuration object
 * @returns {Array} Questions for config fields that failed validation
 */
function getInvalidConfigQuestions(config) {
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

module.exports = getInvalidConfigQuestions;
