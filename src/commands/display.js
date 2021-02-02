const chalk = require('chalk');

const readConfig = require('../util/readConfig');
const configQuestions = require('../questions/configQuestions');

/**
 * Outputs the user's configuration file in a user friendly format.
 *
 * @param {Object} cmdObj - The object passed by the commander action handler
 *   containing the user input information.
 */
async function display(cmdObj) {
    try {
        console.log(chalk.cyan('Configuration Settings:'));
        const config = await readConfig();
        // check if its empty
        if (config == null) {
            console.log('No configuration set. Please run "cral c".');
        } else {
            // checks flag to see if we want to display password
            configQuestions.forEach(({ name, validate }) => {
                const value = config[name];
                if (config[name] == null) {
                    console.log(
                        `  ${chalk.yellow(name)}: ${chalk.dim.gray('Missing')}`
                    );
                } else if (name === 'password' && !cmdObj.password) {
                    console.log(
                        `  ${chalk.yellow(name)}: ${'*'.repeat(value.length)}`
                    );
                } else {
                    // check to see if the config entry is valid
                    console.log(
                        `  ${chalk.yellow(name)}: ${
                            validate && validate(value) !== true
                                ? chalk.red(value) +
                                  `\n    ${chalk.redBright(validate(value))}`
                                : chalk.green(value)
                        }`
                    );
                }
            });
        }
    } catch (err) {
        throw err;
    }
}

module.exports = display;
