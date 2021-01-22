const { prompt } = require('inquirer');
const chalk = require('chalk');

const configQuestions = require('../questions/configQuestions');
const readConfig = require('../util/readConfig');
const writeConfig = require('../util/writeConfig');

module.exports = async cmdObj => {
    // check flags to see which questions to prmopt
    const selectedQuestions = configQuestions.filter(q => cmdObj[q.name]);
    try {
        const answers =
            selectedQuestions.length == 0
                ? await prompt(configQuestions)
                : await prompt(selectedQuestions);
        let config = await readConfig();
        if (config == null) {
            config = {};
        }
        const updatedConfig = { ...config, ...answers };
        await writeConfig(updatedConfig);
    } catch (err) {
        console.log(chalk.red(err.message));
    }
};
