const getInvalidConfigQuestions = require('./getInvalidConfigQuestions');

const validConfig = {
    username: 'user123',
    password: 'pass123',
    year: 2021,
    term: '0',
    campus: 'NB',
    level: 'U',
    notification: true,
    timeout: 30,
    randomization: 5,
    cloud: false,
    verifyIndex: true,
};
test('valid config should return empty list', () => {
    expect(getInvalidConfigQuestions(validConfig).length).toBe(0);
});

completelyInvalidConfig = {
    username: '',
    password: '',
    year: -32342,
    term: '-432',
    campus: 'ASDFAE',
    level: 'FDSASDF',
    notification: 328,
    timeout: 'abc',
    randomization: 'xyz',
    cloud: {},
    verifyIndex: 'AAAAAA',
};
test('completely config should return a list the size of the number of properties in config', () => {
    expect(getInvalidConfigQuestions(completelyInvalidConfig).length).toBe(
        Object.keys(completelyInvalidConfig).length
    );
});
