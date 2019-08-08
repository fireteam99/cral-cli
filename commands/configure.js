const { prompt } = require('inquirer');
const configQuestions = require('../questions/configQuestions');

module.exports = async () => {
    try {
        const answers = await prompt(configQuestions);
        console.log(answers);
        await storage.init({
            dir: '../storage/data',
            stringify: JSON.stringify,
            parse: JSON.parse,
            encoding: 'utf8',
            logging: false,
            ttl: false,
            expiredInterval: 2 * 60 * 1000,
            forgiveParseErrors: false,
        });
        await storage.updateItem('config', answers);
    } catch (err) {}
};
