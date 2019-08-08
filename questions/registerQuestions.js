module.exports = [
    {
        type: 'input',
        name: 'index',
        message: 'Enter the index number of a course to register for...',
        validate: v => {
            // todo verify the index
            return true;
        },
    },
];
