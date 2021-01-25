/* eslint-disable jest/no-disabled-tests */
/**
 * @jest-environment node
 */

const sectionOpen = require('./sectionOpen');

test.skip('passing in index: 09084, year: 2019, term: 9, campus: NB, level: U, should return true', async () => {
    const isOpen = await sectionOpen({
        index: '09084',
        year: '2019',
        term: '9',
        campus: 'NB',
        level: 'U',
    });
    expect(isOpen).toBe(true);
});

test.skip('passing in index: 99999, year: 2019, term: 9, campus: NB, level: U, should return false', async () => {
    const isOpen = await sectionOpen({
        index: '99999',
        year: '2019',
        term: '9',
        campus: 'NB',
        level: 'U',
    });
    expect(isOpen).toBe(false);
});
