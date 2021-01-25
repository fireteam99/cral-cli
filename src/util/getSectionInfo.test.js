/**
 * @jest-environment node
 */
const getSectionInfo = require('./getSectionInfo');
test('passing in index: 09084, year: 2019, term: 9, campus: NB, level: U, should result in the relevant section/course information to return', async () => {
    const info = await getSectionInfo({
        index: '14502',
        year: '2019',
        term: '9',
        campus: 'NB',
        level: 'U',
    });
    const { course, section } = info;
    const { title, courseString, subjectDescription } = course;
    expect(title).toBe('HBSE');
    expect(courseString).toBe('19:910:502');
    expect(subjectDescription).toBe('SOCIAL WORK');
    const { instructorsText, openStatusText, examCode } = section;
    expect(instructorsText).toBe('POPE, DONNA');
    expect(typeof openStatusText === 'string').toBeTruthy();
    expect(examCode).toBe('A');
}, 30000);
