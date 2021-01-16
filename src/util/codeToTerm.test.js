const codeToTerm = require('./codeToTerm');

test('inputs 0 to return Winter', () => {
    expect(codeToTerm('0')).toBe('Winter');
});
test('inputs 1 to return Spring', () => {
    expect(codeToTerm('1')).toBe('Spring');
});
test('inputs 7 to return Summer', () => {
    expect(codeToTerm('7')).toBe('Summer');
});
test('inputs 9 to return Fall', () => {
    expect(codeToTerm('9')).toBe('Fall');
});
test('inputs 3 to return Error', () => {
    expect(codeToTerm('3')).toBe('Error');
});
test('inputs the number 3 to return Error', () => {
    expect(codeToTerm(3)).toBe('Error');
});
