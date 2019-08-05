module.exports = [
    {
        type: 'input',
        name: 'username',
        message: 'Enter your netID username...'
    },
    {
        type: 'password',
        name: 'password',
        message: 'Enter your netID password...'
    },
    {
        type: 'list',
        name: 'year',
        message: 'Enter the year you would liked to register for...',
        choices: [
            '2019'
        ]
    },
    {
        type: 'list',
        name: 'term',
        message: 'Choose the term you would liked to register for...',
        choices: [
            'Winter',
            'Spring',
            'Summer',
            'Fall'
        ],
        filter: (v) => {
            switch(v) {
                case "Winter":
                    return 0;
                case "Spring":
                    return 1;
                case "Summer":
                    return 7;
                case "Fall":
                    return 9;
                default:
                    return -1;
            }
        }
    },
    {
        type: 'number',
        name: 'timeout',
        message: `Enter a delay in seconds. Checking too often may be considered suspicious and could result in an account or IP ban from rutgers. Defaults to 180 seconds (2 minutes).`,
        default: 180,
        validate: (v) => {
            if (v > 0) {
                return true;
            } else {
                return 'Please enter a non-negative number of seconds.'
            }
        }
    },
    {
        type: 'number',
        name: 'randomization',
        message: `Enter a maximum randomization amount in seconds for the timeout as a disguise. Defaults to 10 seconds.`,
        default: 10,
        validate: (v) => {
            if (v > 0) {
                return true;
            } else {
                return 'Please enter a non-negative number of seconds.'
            }
        }
    }
];
