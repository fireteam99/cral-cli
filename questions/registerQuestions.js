const validateIndex = require('../util/registerForIndex');
const { prompt } = require('inquirer');
const Table = require('cli-table');

module.exports = [
    {
        type: 'input',
        name: 'index',
        message: 'Enter the index number of a course to register for...',
        validate: async v => {
            // intialize the node persist
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
            // grab the year, term, campus, and level from storage
            const config = storage.getItem('config');

            if (config == null) {
                throw new ConfigError(
                    'Error, cral configuration has not been set. Please run "cral config" before trying again.',
                    0
                );
            }

            const { year, term, campus, level } = config;

            try {
                const info = validateIndex({
                    index,
                    year,
                    term,
                    campus,
                    level,
                });
                const { section, course, year } = info;
                let confirmQuestion = '';
                if (section == null) {
                    confirmQuestion = `It appears the section ${index} you are trying to register for is invalid. Would you like to continue anyways?
                    Config Information: Year: ${year} \t Term: ${term} \t Campus: ${campus} \t Level: ${level}`;
                } else {
                    // course information
                    const { title, subjectDecription } = course;
                    let { credits } = course;
                    if (credits == null) {
                        credits = 'N/A';
                    }

                    // section information
                    const { meetingTimes } = section;
                    let { instructorsText } = section;
                    if (instructorsText === '') {
                        instructorsText = 'N/A';
                    }

                    const meetingTimesTable = new Table({
                        head: ['Day', 'Time', 'Location', 'Type'],
                        colWidths: [100, 200],
                    });

                    confirmQuestion = `You are attempting to register for section ${index}.
                    Course Information: Title - ${title} \t Subject - ${subjectDecription} - ${course.credits}
                    Section Information:
                    Config Information: Year - ${year} \t Term - ${term} \t Campus - ${campus} \t Level - ${level}`;
                }
            } catch (err) {
                console.log(err.message);
            }
        },
    },
    {
        type: 'list',
        name: 'Choose a time limit for your registration attempt... ',
        choices: [
            'None',
            '30 minutes',
            '1 hour',
            '3 hours',
            '5 hours',
            '10 hours',
            '24 hours',
        ],
        filter: v => {
            return v.map(e => {
                switch (e) {
                    case 'None':
                        return Infinity;
                    case '30 minutes':
                        return 30;
                    case '1 hour':
                        return 60;
                    case '3 hours':
                        return 60 * 3;
                    case '5 hours':
                        return 60 * 5;
                    case '10 hours':
                        return 60 * 10;
                    case '24 hours':
                        return 60 * 24;
                    default:
                        return -1;
                }
            });
        },
    },
];
