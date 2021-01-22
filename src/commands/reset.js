const { prompt } = require('inquirer');
const chalk = require('chalk');
const writeConfig = require('../util/writeConfig');

module.exports = async () => {
    try {
        // confirm the user wants to reset their config
        const answer = await prompt([
            {
                type: 'confirm',
                name: 'continue',
                message:
                    'This will remove all of your current configurations. Would like to continue?',
            },
        ]);
        if (!answer) {
            console.log(chalk.red('Exiting...'));
        } else {
            // set the config file to null
            await writeConfig(null);
            console.log(chalk.green('Successfully reset configurations'));
        }
    } catch (err) {
        console.log(err);
    }
};
