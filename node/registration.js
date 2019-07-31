const program = require('commander');
const { prompt } = require('inquirer');
const fs = require('fs')

const registerForIndex = require('./registerForIndex');
const options = require('./config/options');
const rusocapi = require('./api');

program
    .version('0.0.1')
    .description(`Command line tool for automated course registration for
        Rutgers University`);

program
    .command('sections')
    .alias('s')
    .description(`Displays a list of sections to register for`);

program
    .command('options')
    .alias('o')
    .description(`Displays user configuration options`);

const configQuestions = [
    {
        type: 'input',
        name: 'username',
        message: 'Enter your netID username...'
    },
    {
        type: 'password',
        name: 'password',
        message: 'Enter your netID password...'
    },
    {
        type: 'list',
        name: 'year',
        message: 'Enter the year you would liked to register for...',
        choices: [
            '2019'
        ]
    },
    {
        type: 'list',
        name: 'term',
        message: 'Choose the term you would liked to register for...',
        choices: [
            'Winter',
            'Spring',
            'Summer',
            'Fall'
        ],
        filter: (v) => {
            switch(v) {
                case "Winter":
                    return 0;
                case "Spring":
                    return 1;
                case "Summer":
                    return 7;
                case "Fall":
                    return 9;
                default:
                    return -1;
            }
        }
    },
    {
        type: 'number',
        name: 'timeout',
        message: `Enter a delay in seconds
            Rutgers SOC API. Checking too often may be considered suspicious
            and could result in a ban. Defaults to 180 seconds (2 minutes).`,
        default: 180,
        validate: (v) => {
            if (v > 0) {
                return true;
            } else {
                return 'Please enter a non negative number of seconds.'
            }
        }
    },
    {
        type: 'number',
        name: 'randomization',
        message: `Enter a maximum randomization amount in seconds for the
            timeout as a disguise. Defaults to 10 seconds.`,
        default: 10,
        validate: (v) => {
            if (v > 0) {
                return true;
            } else {
                return 'Please enter a non negative number of seconds.'
            }
        }
    }
];

program
    .command('configure')
    .alias('c')
    .description('Allows user to configure their registration options')
    .action(() => {
        const answers = await prompt(questions);
        // write to config file
    });


const runRegistration = async ({ indexes, runOptions }) => {
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
          error: null
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
                level: 'U'
            }
        });
        const openSections = await response.json();

        for (let index in indexStatuses) {
          // checks to see if index has already been registered for then checks if it is open
          if (!indexStatuses[index].hasRegistered && openSections.includes(indexStatuses[index].indexNum)) {
            runOptions.index = index;
            const registrationStatus = registerForCourse(runOptions);
            registrationStatuses.push(registrationStatus);
          }
        }
        await Promise.all(registrationStatuses);
        // check to see if all sections were registered for of if there was a non recoverable error
        allRegistered = registrationStatuses.every(status => status.hasRegistered === true || status.error != null);

        // write to our statuses
        for (status of registrationStatus) {
          indexStatuses[status.index].hasRegistered = status.hasRegistered;
          indexStatuses[status.index].error = status.error;
        }

        // timeout for 5 seconds
        await sleep(5000);
      }
  } catch (err) {
    console.log(err);
  }
}
