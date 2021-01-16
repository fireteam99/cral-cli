const { prompt } = require('inquirer');
const configQuestions = require('../questions/configQuestions');
const storage = require('node-persist');
const path = require('path');
const chalk = require('chalk');

module.exports = async cmdObj => {
    // check flags to see which questions to prmopt
    const selectedQuestions = configQuestions.filter(q => cmdObj[q.name]);
    try {
        const answers =
            selectedQuestions.length == 0
                ? await prompt(configQuestions)
                : await prompt(selectedQuestions);
        await storage.init({ dir: path.join(__dirname, '..', 'storage') });
        let updatedConfig = await storage.getItem('config');
        if (updatedConfig == null) {
            updatedConfig = {};
        }
        for (const key of Object.keys(answers)) {
            updatedConfig[key] = answers[key];
        }
        await storage.updateItem('config', updatedConfig);
    } catch (err) {
        console.log(chalk.red(err.message));
    }
};
