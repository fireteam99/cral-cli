/**
 * @constant
 * A list of inquirer.js questions to be prompted during registration.
 */
const registerQuestions = [
    {
        type: 'input',
        name: 'index',
        message: 'Enter the index number of a section...',
        validate: v => {
            return v < 0
                ? 'Please enter a non-negative number as the index.'
                : true;
        },
    },
    {
        type: 'list',
        name: 'duration',
        message: 'Choose a time limit for your registration attempt... ',
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
            switch (v) {
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
        },
    },
];

module.exports = registerQuestions;
