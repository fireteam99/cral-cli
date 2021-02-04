const { prompt } = require('inquirer');

const configQuestions = require('../questions/configQuestions');
const readConfig = require('../util/readConfig');
const writeConfig = require('../util/writeConfig');

/**
 * Prompts the user to enter configuration questions, then saves them to the config file.
 *
 * @param {Object} cmdObj - The object passed by the commander action handler
 *   containing the user input information.
 */
async function configure(cmdObj) {
    // check flags to see which questions to prompt
    const selectedQuestions = configQuestions.filter(q => cmdObj[q.name]);
    try {
        const answers = await prompt(
            selectedQuestions.length == 0 ? configQuestions : selectedQuestions
        );
        let config = await readConfig();
        if (config == null) {
            config = {};
        }
        const updatedConfig = { ...config, ...answers };
        await writeConfig(updatedConfig);
    } catch (err) {
        throw err;
    }
}

module.exports = configure;
