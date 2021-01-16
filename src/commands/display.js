const storage = require('node-persist');
const chalk = require('chalk');
const path = require('path');

module.exports = async cmdObj => {
    try {
        console.log(chalk.cyan('Configuration Settings:'));
        await storage.init({ dir: path.join(__dirname, '..', 'storage') });
        const config = await storage.getItem('config');
        // check if its empty
        if (config == null) {
            console.log('No configuration set. Please run "cral c".');
        } else {
            // checks flag to see if we want to display password
            for (key of Object.keys(config)) {
                if (key === 'password' && !cmdObj.password) {
                    console.log(
                        `  ${chalk.yellow(key)}: ${'*'.repeat(
                            config[key].length - 1
                        )}`
                    );
                } else {
                    console.log(`  ${chalk.yellow(key)}: ${config[key]}`);
                }
            }
        }
    } catch (err) {
        console.log(chalk.red(err.message));
    }
};
