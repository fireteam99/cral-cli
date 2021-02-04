const soc = require('../apis/soc');

/**
 * Checks to see if a particular section is open.
 *
 * @param {{ index; year; term; campus; level }} options
 * @returns {Boolean} Whether or not the given section is open
 */
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
        // grab open indexes array
        const openSections = response.data;
        // check to see if the index exists in array
        return openSections.includes(index);
    } catch (err) {
        throw err;
    }
}

module.exports = sectionOpen;
