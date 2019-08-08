const storage = require('node-persist');
const { prompt } = require('inquirer');

const registerForIndex = require('../util/registerForIndex');

const registerForOne = async options => {
    const { index } = options;
    try {
        // read in config from node persist
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

        const config = storage.getItem('config');
        if (config == null) {
            // prompt the user to set their configuration
            const answer = await prompt([
                {
                    type: 'confirm',
                    name: 'continue',
                    message:
                        'You need to configure cral before registering. Would like to continue?',
                },
            ]);
            if (answer.confirm) {
                registerForOne(options);
                return;
            } else {
                console.log('Exiting... Cannot register until configured.');
                return;
            }
        }

        let registered = false;

        while (!registered) {
            // check the api to see if the class is open
            const response = await rusocapi.get('/openSections.gz', {
                params: {
                    year: '2019',
                    term: '9',
                    campus: 'NB',
                    level: 'U',
                },
            });
            const openSections = (await response).data;
            if (openSections.includes(index)) {
                const status = await registerForIndex(options);
                if (status.hasRegistered) {
                    return status;
                }
            }
        }
    } catch (err) {
        console.log(err.message);
    }
};

module.exports = registerForOne;
