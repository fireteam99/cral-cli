const fetch = require('node-fetch');
const registerForIndex = require('registerForIndex.js');
const options = require('config/options');

const runRegistration = async ({ indexes, bruteForce, runOptions }) => {
  if (!indexes) {
    console.error('Error, indexes not passed.');
  }
  if (!runOptions) {
    console.error('Error, runOptions not passed.');
  }
  if (!bruteForce) {
    bruteForce = false;
  }
  try {
    if (bruteForce) {
      let statuses = [];
      let allRegistered = false;
      while (!allRegistered) {
        for (let index of indexes) {
          let i = 0;
          if (!status[i]) {
            runOptions.index = index;
            const status = registerForCourse(runOptions);
            statuses.push(status);
          }
          i++;
        }
        await Promise.all(statuses);
        allRegistered = statuses.every(status => status === true);
      }

    } else { // not brute force
      // call the rutgers api every 5 seconds
      let statuses = [];
      let allRegistered = false;
      while (!allRegistered) {
        // fetch all open sections from rutgers api
        const data = await fetch('https://sis.rutgers.edu/soc/openSections.gz?year=2019&term=1&campus=NB');
        const openSections = await data.json();

        for (let index of indexes) {
          let i = 0;
          if (!status[i]) {
            runOptions.index = index;
            const status = registerForCourse(runOptions);
            statuses.push(status);
          }
          i++;
        }
        await Promise.all(statuses);
        allRegistered = statuses.every(status => status === true);

        // timeout for 5 seconds
        await sleep(5000);
      }

    }
  } catch (err) {
    console.log(err);
  }
}
