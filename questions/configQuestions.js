module.exports = [
    {
        type: 'input',
        name: 'username',
        message: 'Enter your netID username...',
        validate: v => {
            if (v) {
                return true;
            } else {
                return 'NetID username cannot be empty.';
            }
        },
    },
    {
        type: 'password',
        name: 'password',
        message: 'Enter your netID password...',
        validate: v => {
            if (v) {
                return true;
            } else {
                return 'NetID password cannot be empty.';
            }
        },
    },
    {
        type: 'list',
        name: 'year',
        message: 'Enter the year you would liked to register for...',
        choices: ['2019', '2020'],
    },
    {
        type: 'list',
        name: 'term',
        message: 'Choose the academic term to register for...',
        choices: ['Winter', 'Spring', 'Summer', 'Fall'],
        filter: v => {
            switch (v) {
                case 'Winter':
                    return '0';
                case 'Spring':
                    return '1';
                case 'Summer':
                    return '7';
                case 'Fall':
                    return '9';
                default:
                    return -1;
            }
        },
    },
    {
        type: 'list',
        name: 'campus',
        message: 'Choose a university location to register for...',
        choices: ['New Brunswick', 'Newark', 'Camden'],
        filter: v => {
            switch (v) {
                case 'New Brunswick':
                    return 'NB';
                case 'Newark':
                    return 'NK';
                case 'Camden':
                    return 'CM';
                default:
                    return 'ERR';
            }
        },
    },
    {
        type: 'list',
        name: 'level',
        message: 'Choose your study level...',
        choices: ['Undergraduate', 'Graduate'],
        filter: v => {
            switch (v) {
                case 'Undergraduate':
                    return 'U';
                case 'Graduate':
                    return 'G';
                default:
                    return 'ERR';
            }
        },
    },
    {
        type: 'confirm',
        name: 'notification',
        message: 'Would you like notifications?',
        default: true,
    },
    {
        type: 'number',
        name: 'timeout',
        message: `Enter a delay in seconds. Checking too often may be considered suspicious and could result in an account or IP ban from rutgers. Defaults to 30 seconds.`,
        default: 30,
        validate: v => {
            if (v > 0) {
                return true;
            } else {
                return 'Please enter a non-negative number of seconds.';
            }
        },
    },
    {
        type: 'number',
        name: 'randomization',
        message: `Enter a maximum randomization amount in seconds for the timeout as a disguise. Defaults to 5 seconds.`,
        default: 5,
        validate: v => {
            if (v > 0) {
                return true;
            } else {
                return 'Please enter a non-negative number of seconds.';
            }
        },
    },
    {
        type: 'confirm',
        name: 'cloud',
        message:
            'Are you running this program on the cloud? Eg: Heroku or c9.io...',
        default: false,
    },
    {
        type: 'confirm',
        name: 'verify',
        message: 'Would like to validate your index before registering?',
        default: true,
    },
];
