const rusocapi = require('./api');
const registerForCourse = require('../util/registerForIndex');

/**
 * Unused brute force function that attempts to register for a set of indexes
 * every n seconds.
 *
 * @deprecated Since v1.0.0
 */
async function registerMany({ indexes, runOptions }) {
    if (!indexes) {
        console.error('Error, indexes not passed.');
    }
    if (!runOptions) {
        console.error('Error, runOptions not passed.');
    }
    try {
        // call the rutgers api every 5 seconds
        const indexStatuses = {};
        for (let index of indexes) {
            indexStatuses[index] = {
                hasRegistered: false,
                error: null,
            };
        }

        let allRegistered = false;
        while (!allRegistered) {
            // fetch all open sections from rutgers api
            const response = await rusocapi.get('/openSections.gz', {
                params: {
                    year: '2019',
                    term: '9',
                    campus: 'NB',
                    level: 'U',
                },
            });
            const openSections = await response.json();

            for (let index in indexStatuses) {
                // checks to see if index has already been registered for then checks if it is open
                if (
                    !indexStatuses[index].hasRegistered &&
                    openSections.includes(indexStatuses[index].indexNum)
                ) {
                    runOptions.index = index;
                    const registrationStatus = registerForCourse(runOptions);
                    registrationStatuses.push(registrationStatus);
                }
            }
            await Promise.all(registrationStatuses);
            // check to see if all sections were registered for of if there was a non recoverable error
            allRegistered = registrationStatuses.every(
                status => status.hasRegistered === true || status.error != null
            );

            // write to our statuses
            for (status of registrationStatus) {
                indexStatuses[status.index].hasRegistered =
                    status.hasRegistered;
                indexStatuses[status.index].error = status.error;
            }

            // timeout for 5 seconds
            await sleep(5000);
        }
    } catch (err) {
        console.log(err);
    }
}
