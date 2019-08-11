const soc = require('../apis/soc');

// checks to see if an index is valid and returns some data about that index
const validateIndex = async ({ index, year, term, campus, level }) => {
    // get a list of all the availible courses
    const response = await soc.get('/courses.gz', {
        params: {
            year,
            term,
            campus,
            level,
        },
    });
    const courses = response.data;
    const selectedCourse = courses.filter(course => {
        course.sections.forEach(section => {
            console.log(section.index);
            if (section.index === index) {
                console.log('matched-----------------------');
                return true;
            }
        });
        return true;
    });
    console.log(selectedCourse);
};

(async () => {
    await validateIndex({
        index: '14502',
        year: '2019',
        term: '9',
        campus: 'NB',
        level: 'U',
    });
})();
