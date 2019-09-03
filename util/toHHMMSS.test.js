const toHHMMSS = require('./toHHMMSS');

test('passing 1 will return 0:01', () => {
    expect(toHHMMSS(1)).toBe('00:01');
});
test('passing 60 will return 1:00', () => {
    expect(toHHMMSS(60)).toBe('01:00');
});
test('passing 3600 will return 01:00:00', () => {
    expect(toHHMMSS(3600)).toBe('01:00:00');
});
