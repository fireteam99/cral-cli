const storage = require('node-persist');
const inquirer = require('inquirer');
const { prompt } = inquirer;
const ui = new inquirer.ui.BottomBar();
const Table = require('cli-table2');
const ora = require('ora');

const soc = require('../apis/soc');
const registerForIndex = require('../util/registerForIndex');
const registerQuestions = require('../questions/registerQuestions');
const dayFromLetter = require('../util/dayFromLetter');
const militaryToStandardTime = require('../util/militaryToStandardTime');
const validateIndex = require('../util/validateIndex');
const codeToTerm = require('../util/codeToTerm');

// define a sleep function to use
const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const register = async () => {
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
                register();
                return;
            } else {
                console.log('Exiting... Cannot register until configured.');
                return;
            }
        }

        // get run options from user
        const options = await prompt(registerQuestions);
        const { index } = options;

        // check to see if the index is in the proper format
        if (!index.match(/^\d{5}$/)) {
            throw new Error(
                `Error, index: ${index} is not the correct format. It must be a 5 digit non-negative integer.`
            );
        }

        // check if the user wants to verify an index before registering
        const { verifyIndex } = config;

        // verify the index if configured
        if (verifyIndex) {
            if (config == null) {
                throw new ConfigError(
                    'Error, cral configuration has not been set. Please run "cral config" before trying again.',
                    0
                );
            }
            // destructure config
            const { year, term, campus, level } = config;

            // display a loading spinner
            //ui.updateBottomBar('Verifying index... please wait...');
            const spinner = ora({
                text: 'Verifying index, this might take a moment...',
            }).start();

            // validate the index
            const info = await validateIndex({
                index,
                year,
                term,
                campus,
                level,
            });
            const { section, course } = info;

            // create config information table
            const configInfoTable = new Table({
                head: ['Year', 'Term', 'Campus', 'Level'],
                colWidths: [7, 10, 7, 7],
            });
            configInfoTable.push([
                year,
                `${term} - ${codeToTerm(term)}`,
                campus,
                level,
            ]);

            let confirmQuestion = '';
            if (section == null) {
                spinner.fail('Index verification failed.');
                confirmQuestion =
                    `It appears the section: ${index} you are trying to register for is invalid. Would you like to continue anyways?\n` +
                    `Config Information:\n` +
                    `${configInfoTable.toString()}\n`;
            } else {
                spinner.succeed('Index verification succeeded.');
                // course information
                const { title, courseString, subjectDescription } = course;
                let { credits } = course;
                if (credits == null) {
                    credits = 'N/A';
                }
                const courseInfoTable = new Table({
                    head: ['Title', 'Code', 'Description', 'Credits'],
                    colWidths: [25, 12, 25, 9],
                    wordWrap: true,
                });
                courseInfoTable.push([
                    title,
                    courseString,
                    subjectDescription,
                    credits,
                ]);

                // section information
                let { instructorsText, openStatusText, examCode } = section;
                if (instructorsText === '') {
                    instructorsText = 'N/A';
                }
                openStatus =
                    openStatusText.charAt(0) +
                    openStatusText.slice(1).toLowerCase();
                const sectionInfoTable = new Table({
                    head: ['Instructor(s)', 'Open Status', 'Exam Code'],
                    colWidths: [25, 17, 12],
                    wordWrap: true,
                });
                sectionInfoTable.push([instructorsText, openStatus, examCode]);

                // create table of meeting times
                const { meetingTimes } = section;
                const meetingTimesTable = new Table({
                    head: ['Day', 'Time', 'Campus', 'Building', 'Room', 'Type'],
                    colWidths: [9, 22, 10, 11, 6, 6],
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
                    console.log(startTimeMilitary);
                    console.log(endTimeMilitary);
                    const startTime = militaryToStandardTime(startTimeMilitary);
                    const endTime = militaryToStandardTime(endTimeMilitary);
                    const time = `${startTime} - ${endTime}`;

                    const campus = campusAbbrev ? campusAbbrev : 'N/A';
                    const building = buildingCode ? buildingCode : 'N/A';
                    const room = roomNumber ? roomNumber : 'N/A';

                    meetingTimesTable.push([
                        dayFromLetter(meetingDay),
                        time,
                        campus,
                        building,
                        room,
                        meetingModeDesc,
                    ]);
                }

                confirmQuestion =
                    `You are attempting to register for section ${index}. Would you like to continue?\n` +
                    `Course Information:\n` +
                    `${courseInfoTable.toString()}\n` +
                    `Section Information:\n` +
                    `${sectionInfoTable.toString()}\n` +
                    `Meeting Times:\n` +
                    `${meetingTimesTable.toString()}\n` +
                    `Config Information:\n` +
                    `${configInfoTable.toString()}\n`;
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
                console.log('Exting registration...');
                return;
            }
        }
        console.log('Proceeding with registration...');

        const { duration } = options;
        // console.log(duration);
        const maxDuration = duration * 60;
        const time = process.hrtime();
        let currentDuration = -1;

        const { timeout, randomization } = config;
        // console.log(`max duration: ${maxDuration}`);
        const { year, term, campus, level } = config;
        let openingFound = false;
        while (currentDuration < maxDuration) {
            const checkSpinner = new ora({
                text: 'Checking for opening...',
            }).start();
            // check the api to see if the class is open
            const response = await soc.get('/openSections.gz', {
                params: {
                    year,
                    term,
                    campus,
                    level,
                },
            });
            const openSections = response.data;
            checkSpinner.stop();
            // attempt to register if the section is open
            if (openSections.includes(index)) {
                openingFound = true;
                const regSpinner = ora({
                    text: 'Opening found! Attempting to register...',
                    color: 'green',
                });
                const { username, password, cloud } = config;
                const puppeteerOptions = cloud
                    ? { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
                    : {};
                const status = await registerForIndex({
                    username,
                    password,
                    index,
                    term,
                    year,
                    puppeteerOptions,
                });
                regSpinner.stop();
                if (status.hasRegistered) {
                    break;
                }
            }
            // calculate timeout
            const adjustedTimeout =
                timeout + Math.floor(Math.random() * randomization);

            for (let i = 0; i < adjustedTimeout; i++) {
                if (openingFound) {
                    ui.updateBottomBar(
                        `Failed to register. Waiting for: ${adjustedTimeout -
                            i} seconds...`
                    );
                } else {
                    ui.updateBottomBar(
                        `No opening found. Waiting for: ${adjustedTimeout -
                            i} seconds...`
                    );
                }
                await sleep(1000);
            }
            ui.updateBottomBar('');
            currentDuration = process.hrtime(time)[0];
        }

        const finalDuration = process.hrtime(time)[0];
        console.log(`Registration attempt finished for index ${index}.`);
        const resultsTable = new Table({
            head: ['Status', 'Duration'],
            colWidths: [20, 20],
            wordWrap: true,
        });
        const finalStatus = registered ? 'Suceeded' : 'Failed';
        resultsTable.push([finalStatus, `${finalDuration} seconds`]);
        console.log(resultsTable.toString());
    } catch (err) {
        console.log(err);
    }
};

module.exports = register;
