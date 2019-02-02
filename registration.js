const registerForCourse = require('registerForCourse.js');
const options = require('config/options');

const runRegistration = async ({ courses, bruteForce, runOptions }) => {
  if (!courses) {
    console.error('Error, courses not passed.');
  }
  if (!runOptions) {
    console.error('Error, runOptions not passed.')
  }
  if (!bruteForce) {
    bruteForce = false;
  }
  try {
    if (bruteForce) {
      let statuses = [];
      let allRegistered = false;
      while (!allRegistered) {
        for (let i = 0; i < courses.length; i++) {
          options.course = courses[i];
          const status = registerForCourse(options);
          statuses.push(status);
        }
        await Promise.all(statuses);
        allRegistered = statuses.every(status => status === true);
      }

    } else {

    }
  } catch (err) {

  }
}
