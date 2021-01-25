const { prompt } = require('inquirer');
const chalk = require('chalk');

const configQuestions = require('../questions/configQuestions');
const readConfig = require('../util/readConfig');
const writeConfig = require('../util/writeConfig');
const getInvalidConfigQuestions = require('../util/getInvalidConfigQuestions');

module.exports = async cmdObj => {
    // check to see if there are any invalid configs to fix
    const config = await readConfig();
    const questions =
        config == null ? configQuestions : getInvalidConfigQuestions(config);
    if (questions.length === 0) {
        console.log(chalk.green('Configuration valid. Nothig to fix.'));
        return;
    }
    try {
        const answers = await prompt(questions);
        const updatedConfig = { ...config, ...answers };
        await writeConfig(updatedConfig);
    } catch (err) {
        throw err;
    }
};
