const validateIndex = require('./validateIndex');

test('passing in index: 09084, year: 2019, term: 9, campus: NB, level: U, will result in the section/course information to return', async () => {
    const info = await validateIndex({
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
