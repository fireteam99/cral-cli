const dayFromLetter = require('./dayFromLetter');

test('passing M will return Monday', () => {
    expect(dayFromLetter('M')).toBe('Monday');
});
test('passing T will return Tuesday', () => {
    expect(dayFromLetter('T')).toBe('Tuesday');
});
test('passing W will return Wednesday', () => {
    expect(dayFromLetter('W')).toBe('Wednesday');
});
test('passing TH will return Thursday', () => {
    expect(dayFromLetter('TH')).toBe('Thursday');
});
test('passing F will return Friday', () => {
    expect(dayFromLetter('F')).toBe('Friday');
});
test('passing M will return Saturday', () => {
    expect(dayFromLetter('S')).toBe('Saturday');
});
test('passing M will return Sunday', () => {
    expect(dayFromLetter('SU')).toBe('Sunday');
});
test('passing L will return N/A', () => {
    expect(dayFromLetter('L')).toBe('N/A');
});
test('passing null will return N/A', () => {
    expect(dayFromLetter(null)).toBe('N/A');
});
test('passing undefined will return N/A', () => {
    expect(dayFromLetter(undefined)).toBe('N/A');
});
