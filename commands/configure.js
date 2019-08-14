const { prompt } = require('inquirer');
const configQuestions = require('../questions/configQuestions');
const storage = require('node-persist');

module.exports = async () => {
    try {
        const answers = await prompt(configQuestions);
        await storage.init();
        await storage.updateItem('config', answers);
        console.log(await storage.getItem('config'));
    } catch (err) {
        console.log(err);
    }
};
