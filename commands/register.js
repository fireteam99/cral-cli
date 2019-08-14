const storage = require('node-persist');
const { prompt } = require('inquirer');
const Table = require('cli-table');

const soc = require('../apis/soc');
const registerForIndex = require('../util/registerForIndex');
const registerQuestions = require('../questions/registerQuestions');
const dayFromLetter = require('../util/dayFromLetter');
const militaryToStandardTime = require('../util/militaryToStandardTime');
const validateIndex = require('../util/validateIndex');

const register = async options => {
    const { index } = options;
    try {
        // read in config from node persist
        await storage.init();

        const config = await storage.getItem('config');

        if (config == null) {
            // prompt the user to set their configuration
            const answer = await prompt([
                {
                    type: 'confirm',
                    name: 'continue',
                    message:
                        'You need to configure cral first. Would like to continue?',
                },
            ]);
            if (answer.confirm) {
                registerForOne(options);
                return;
            } else {
                console.log('Exiting... Cannot register until configured.');
                return;
            }
        }
        // destructure config
        const { year, term, campus, level, verifyIndex } = config;

        // get run options from user
        const options = await prompt(registerQuestions);

        // verify the index if configured
        if (verifyIndex) {
            // if (config == null) {
            //     throw new ConfigError(
            //         'Error, cral configuration has not been set. Please run "cral config" before trying again.',
            //         0
            //     );
            // }

            const info = await validateIndex({
                index,
                year,
                term,
                campus,
                level,
            });
            const { section, course } = info;
            let confirmQuestion = '';
            if (section == null) {
                confirmQuestion = `It appears the index: ${index} you are trying to register for is invalid. Would you like to continue anyways?
                    Config Information: Year: ${year} \t Term: ${term} \t Campus: ${campus} \t Level: ${level}`;
            } else {
                // course information
                const { title, subjectDecription } = course;
                let { credits } = course;
                if (credits == null) {
                    credits = 'N/A';
                }

                // section information
                const { meetingTimes } = section;
                let { instructorsText } = section;
                if (instructorsText === '') {
                    instructorsText = 'N/A';
                }

                const meetingTimesTable = new Table({
                    head: ['Day', 'Time', 'Location', 'Type'],
                    colWidths: [100, 200],
                });

                for (meetingTime of meetingTimes) {
                    const {
                        meetingDay,
                        startTimeMilitary,
                        endTimeMilitary,
                        campusAbbrev,
                        buildingCode,
                        roomNumber,
                        meetingModeDesc,
                    } = meetingTime;
                    const startTime = militaryToStandardTime(startTimeMilitary);
                    const endTime = militaryToStandardTime(endTimeMilitary);
                    const time = `${startTime} - ${endTime}`;

                    const location =
                        campusAbbrev == null ||
                        buildingCode == null ||
                        roomNumber == null
                            ? 'N/A'
                            : `${campusAbbrev} - ${buildingCode} - ${roomNumber}`;

                    meetingTimesTable.push([
                        dayFromLetter(meetingDay),
                        time,
                        location,
                        meetingModeDesc,
                    ]);
                }

                confirmQuestion = `You are attempting to register for section ${index}. Would you like to continue?
                    Course Information: Title - ${title} \t Subject - ${subjectDecription} - ${
                    course.credits
                }
                    Section Information: Instructors - ${instructorsText}
                    Meeting Times: ${meetingTimesTable.toString()}
                    Config Information: Year - ${year} \t Term - ${term} \t Campus - ${campus} \t Level - ${level}`;
            }
            // ask the user if they want to continue
            const continueAnswer = await prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: confirmQuestion,
                },
            ]);
            // exit the command
            if (!continueAnswer.confirm) {
                console.log('exiting registration');
                return;
            }
        }
        console.log('proceeding with registration');

        // let registered = false;
        //
        // while (!registered) {
        //     // check the api to see if the class is open
        //     const response = await soc.get('/openSections.gz', {
        //         params: {
        //             year,
        //             term,
        //             campus,
        //             level,
        //         },
        //     });
        //     const openSections = response.data;
        //     if (openSections.includes(index)) {
        //         const status = await registerForIndex(options);
        //         if (status.hasRegistered) {
        //             return status;
        //         }
        //     }
        // }
    } catch (err) {
        console.log(err);
    }
};

module.exports = register;
