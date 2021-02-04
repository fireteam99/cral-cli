const { prompt } = require('inquirer');
const chalk = require('chalk');

const configQuestions = require('../questions/configQuestions');
const readConfig = require('../util/readConfig');
const writeConfig = require('../util/writeConfig');
const getInvalidConfigQuestions = require('../util/getInvalidConfigQuestions');

/**
 * Prompts the user to enter configuration options for any missing/invalid config fields.
 *
 * @param {Object} cmdObj - The object passed by the commander action handler
 *   containing the user input information.
 */
async function fix() {
    try {
        const config = await readConfig();

        // finds questions for invalid config values
        const questions =
            config == null
                ? configQuestions
                : getInvalidConfigQuestions(config);

        // if there are no issues don't prompt anything
        if (questions.length === 0) {
            console.log(chalk.green('Configuration valid. Nothig to fix.'));
            return;
        }

        // prompt questions that correspond to issues
        const answers = await prompt(questions);
        const updatedConfig = { ...config, ...answers };
        await writeConfig(updatedConfig);
    } catch (err) {
        throw err;
    }
}

module.exports = fix;
