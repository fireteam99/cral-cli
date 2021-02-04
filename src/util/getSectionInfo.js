const soc = require('../apis/soc');

/**
 * Attempts to fetch the course and section information from the Rutgers SOC
 * API given a section index.
 *
 * @param {{
 *     index: String;
 *     year: String | Number;
 *     term: String;
 *     campus: String;
 *     level: String;
 * }} { Index,
 *   year, term, campus, level }
 * @returns {Object} An object that contains a `course` and `section` property
 */
async function getSectionInfo({ index, year, term, campus, level }) {
    try {
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
        let selectedCourse = null;
        let selectedSection = null;

        // search for matching course
        for (course of courses) {
            // search for matching section
            for (section of course.sections) {
                if (selectedCourse || selectedSection) {
                    break;
                }
                if (section.index === index) {
                    selectedCourse = course;
                    selectedSection = section;
                    break;
                }
            }
        }
        // console.log(selectedCourse);
        // console.log('-------------------------------------');
        // console.log(selectedSection);
        return {
            course: selectedCourse,
            section: selectedSection,
        };
    } catch (err) {
        throw err;
    }
}

module.exports = getSectionInfo;

// (async () => {
//     const result = await getSectionInfo({
//         index: '14502',
//         year: '2019',
//         term: '9',
//         campus: 'NB',
//         level: 'U',
//     });
//     console.log(result);
// })();
