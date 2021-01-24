const chalk = require('chalk');

const readConfig = require('../util/readConfig');
const configQuestions = require('../questions/configQuestions');

module.exports = async cmdObj => {
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
};
