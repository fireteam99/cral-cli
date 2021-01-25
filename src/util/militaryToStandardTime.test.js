const militaryToStandardTime = require('./militaryToStandardTime');

test('passing 0000 returns 12:00 AM', () => {
    expect(militaryToStandardTime('0000')).toBe('12:00 AM');
});
test('passing 0001 returns 12:01 AM', () => {
    expect(militaryToStandardTime('0001')).toBe('12:01 AM');
});
test('passing 0030 returns 12:30 AM', () => {
    expect(militaryToStandardTime('0030')).toBe('12:30 AM');
});
test('passing 0059 returns 12:59 AM', () => {
    expect(militaryToStandardTime('0059')).toBe('12:59 AM');
});
test('passing 0100 returns 1:00 AM', () => {
    expect(militaryToStandardTime('0100')).toBe('1:00 AM');
});
test('passing 0101 returns 1:01 AM', () => {
    expect(militaryToStandardTime('0101')).toBe('1:01 AM');
});
test('passing 0200 returns 2:00 AM', () => {
    expect(militaryToStandardTime('0200')).toBe('2:00 AM');
});
test('passing 0500 returns 5:00 AM', () => {
    expect(militaryToStandardTime('0500')).toBe('5:00 AM');
});
test('passing 1159 returns 11:59 AM', () => {
    expect(militaryToStandardTime('1159')).toBe('11:59 AM');
});
test('passing 1200 returns 12:00 PM', () => {
    expect(militaryToStandardTime('1200')).toBe('12:00 PM');
});
test('passing 1259 returns 12:59 PM', () => {
    expect(militaryToStandardTime('1259')).toBe('12:59 PM');
});
test('passing 1300 returns 1:00 PM', () => {
    expect(militaryToStandardTime('1300')).toBe('1:00 PM');
});
test('passing 2359 returns 11:59 PM', () => {
    expect(militaryToStandardTime('2359')).toBe('11:59 PM');
});
