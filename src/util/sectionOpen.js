const soc = require('../apis/soc');

async function sectionOpen({ index, year, term, campus, level }) {
    // fetch a list of the open courses
    try {
        const response = await soc.get('/openSections.gz', {
            params: {
                year,
                term,
                campus,
                level,
            },
        });
        const openSections = response.data;
        return openSections.includes(index);
    } catch (err) {
        throw err;
    }
}

module.exports = sectionOpen;
