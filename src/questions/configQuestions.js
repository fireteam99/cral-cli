module.exports = [
    {
        type: 'input',
        name: 'username',
        message: 'Enter your netID username...',
        validate: v => {
            if (v) {
                return true;
            } else {
                return 'NetID username (username) cannot be empty.';
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
                return 'NetID password (password) cannot be empty.';
            }
        },
    },
    {
        type: 'list',
        name: 'year',
        message: 'Enter the year you would liked to register for...',
        choices: [
            new Date().getFullYear() - 1,
            new Date().getFullYear(),
            new Date().getFullYear() + 1,
        ],
        // ensure we have a string in the form of a four digit year
        validate: v => {
            if (!v) {
                return 'Year (year) cannot be empty.';
            }
            if (Number.isInteger(v) && v.toString().length === 4) {
                return true;
            }
            return 'Year (year) must be a four digit integer.';
        },
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
        validate: v =>
            ['0', '1', '7', '9'].includes(v)
                ? true
                : 'Term (term) must be "0" for winter, "1" for spring, "7" for summer, or "9" for fall.',
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
        validate: v =>
            ['NB', 'NK', 'CM'].includes(v)
                ? true
                : 'Campus (campus) must be "NB" for New Brunswick, "NK" for Newark, or "CM" for camden.',
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
        validate: v =>
            v === 'U' || v === 'G'
                ? true
                : 'Level (level) must be "U" for undergraduate or "G" for graudate.',
    },
    {
        type: 'confirm',
        name: 'notification',
        message: 'Would you like notifications?',
        default: true,
        validate: v =>
            typeof v === 'boolean'
                ? true
                : 'Notification (notification) must be a boolean.',
    },
    {
        type: 'number',
        name: 'timeout',
        message:
            'Enter a delay in seconds. Checking too often may be considered suspicious and could result in an account or IP ban from rutgers. Defaults to 30 seconds.',
        default: 30,
        validate: v =>
            !Number.isInteger(v) || v < 0
                ? 'Timeout (timeout) must be a non-negative integer of seconds.'
                : true,
    },
    {
        type: 'number',
        name: 'randomization',
        message:
            'Enter a maximum randomization amount in seconds for the timeout as a disguise. Defaults to 5 seconds. The randomization should be greater than or equal to the timeout for thie program to work properly.',
        default: 5,
        validate: v =>
            !Number.isInteger(v) || v < 0
                ? 'Randomization (randomization) must be a non-negative integer of seconds and greater than or equal to timeout.'
                : true,
    },
    {
        type: 'confirm',
        name: 'cloud',
        message:
            'Are you running this program on the cloud? Eg: Heroku or c9.io...',
        default: false,
        validate: v =>
            typeof v === 'boolean' ? true : 'Cloud (cloud) must be a boolean.',
    },
    {
        type: 'confirm',
        name: 'verifyIndex',
        message: 'Would like to validate your index before registering?',
        default: true,
        validate: v =>
            typeof v === 'boolean'
                ? true
                : 'Verify index (verifyIndex) must be a boolean.',
    },
];
