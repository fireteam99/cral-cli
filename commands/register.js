const storage = require('node-persist');
const inquirer = require('inquirer');
const { prompt } = inquirer;
const Table = require('cli-table2');
const ora = require('ora');

const soc = require('../apis/soc');
const registerForIndex = require('../util/registerForIndex');
const registerQuestions = require('../questions/registerQuestions');
const dayFromLetter = require('../util/dayFromLetter');
const militaryToStandardTime = require('../util/militaryToStandardTime');
const validateIndex = require('../util/validateIndex');
const codeToTerm = require('../util/codeToTerm');
const configure = require('./configure');

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
        const { index, duration } = options;

        // check if the user wants to verify an index before registering
        const { verifyIndex } = config;

        // verify the index if configured
        if (verifyIndex) {
            // if (config == null) {
            //     throw new ConfigError(
            //         'Error, cral configuration has not been set. Please run "cral config" before trying again.',
            //         0
            //     );
            // }
            // destructure config
            const { year, term, campus, level } = config;

            // display a loading spinner
            //ui.updateBottomBar('Verifying index... please wait...');
            const spinner = ora({
                text: 'Verifying index, this might take a moment...',
                stream: process.stdout,
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

        let registered = false;

        const maxDuration = duration * 60;
        const startTime = process.hrtime()[0];
        let currentDuration = -Infinity;

        while (!registered && currentDuration < maxDuration) {
            // check the api to see if the class is open
            const response = await soc.get('/openSections.gz', {
                params: {
                    year,
                    term,
                    campus,
                    level,
                },
            });
            const { openSections } = response;
            // attempt to register if the section is open
            if (openSections.includes(index)) {
                const { username, password, cloud } = config;
                const puppeteerOptions = cloud
                    ? { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
                    : {};
                const status = await registerForIndex({
                    username,
                    password,
                    index,
                    puppeteerOptions,
                });
                if (status.hasRegistered) {
                    registered = true;
                }
            }
            currentDuration = process.hrtime(startTime)[0];
        }
        const finalDuration = process.hrtime(startTime)[0];
        console.log(`Registration attempt finished for index ${index}.`);
        const resultsTable = new Table({
            head: ['Status', 'Duration'],
            colWidths: [20, 20],
            wordWrap: true,
        });
        const finalStatus = registered ? 'Suceeded' : 'Failed';
        resultsTable.push([finalStatus, `${finalDuration} seconds`]);
        console.log(resultsTable.toString);
    } catch (err) {
        console.log(err);
    }
};

module.exports = register;
