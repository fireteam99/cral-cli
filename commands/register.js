const storage = require('node-persist');
const inquirer = require('inquirer');
const { prompt } = inquirer;
const ui = new inquirer.ui.BottomBar();
const Table = require('cli-table2');
const ora = require('ora');
const notifier = require('node-notifier');
const path = require('path');
const chalk = require('chalk');

const configure = require('./configure');
const soc = require('../apis/soc');
const registerForIndex = require('../util/registerForIndex');
const registerQuestions = require('../questions/registerQuestions');
const dayFromLetter = require('../util/dayFromLetter');
const militaryToStandardTime = require('../util/militaryToStandardTime');
const validateIndex = require('../util/validateIndex');
const codeToTerm = require('../util/codeToTerm');
const toHHMMSS = require('../util/toHHMMSS');

// define a sleep function to use
const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const register = async cmdObj => {
    // define spinners
    let checkSpinner = null;
    let regSpinner = null;
    let notification = false;
    let cloud = 'true';
    try {
        // read in config from node persist
        await storage.init({ dir: path.join(__dirname, '..', 'storage') });

        const config = await storage.getItem('config');

        if (config == null) {
            // prompt the user to set their configuration
            const answer = await prompt([
                {
                    type: 'confirm',
                    name: 'continue',
                    message: chalk.yellow(
                        'You need to configure cral first. Would like to continue?'
                    ),
                },
            ]);
            if (answer.confirm) {
                await configure();
                await register();
                return;
            } else {
                console.log(
                    chalk.red('Exiting... Cannot register until configured.')
                );
                return;
            }
        }
        const { cloud } = config;
        let index = null;
        let duration = null;
        // check to see if index was manually passed in through flags
        if (cmdObj.index != null) {
            index = cmdObj.index;
            if (cmdObj.T == null) {
                duration = Infinity;
            } else {
                duration = cmdObj.T;
            }
        } else {
            // get run options from user
            const options = await prompt(registerQuestions);
            index = options.index;
            duration = options.duration;
        }

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
                console.log(chalk.red('Exiting registration...'));
                return;
            }
        }
        const durationText =
            duration === Infinity ? '...' : ` for ${duration} minutes...`;
        console.log(
            chalk.green(
                `Proceeding with registration for index: ${index}${durationText}`
            )
        );

        const maxDuration = duration * 60;
        const time = process.hrtime();
        let currentDuration = -1;

        const { timeout, randomization } = config;
        let { username, password } = config;
        // check to see if username or password was overriden
        if (cmdObj.U != null) {
            username = cmdObj.U;
        }
        if (cmdObj.P != null) {
            password = cmdObj.P;
        }
        // set notification
        notification = config.notification;
        // console.log(`max duration: ${maxDuration}`);
        const { year, term, campus, level } = config;
        let openingFound = false;
        let registered = false;
        while (currentDuration < maxDuration) {
            checkSpinner = ora({
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
                let puppeteerOptions = {};
                if (cloud) {
                    puppeteerOptions.args = [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                    ];
                }
                if (cmdObj.debug) {
                    puppeteerOptions.headless = false;
                }
                regSpinner = ora({
                    text: `${chalk.green(
                        'Opening found!'
                    )} Attempting to register...`,
                    color: 'green',
                }).start();
                const status = await registerForIndex({
                    username,
                    password,
                    index,
                    term,
                    year,
                    puppeteerOptions,
                });
                if (status.hasRegistered) {
                    regSpinner.succeed(
                        `${status.message} ${status.screenshot}`
                    );
                    registered = true;
                    break;
                } else {
                    // log failure only if verbose or debug mode passed
                    if (cmdObj.debug || cmdObj.verbose) {
                        regSpinner.fail(
                            `${status.message} ${status.screenshot}`
                        );
                    } else {
                        regSpinner.stop();
                    }
                }
            }
            // calculate timeout
            const adjustedTimeout =
                timeout + Math.floor(Math.random() * randomization);

            for (let i = 0; i < adjustedTimeout; i++) {
                if (openingFound) {
                    ui.updateBottomBar(
                        `${chalk.red(
                            'Failed to register'
                        )}. Waiting for: ${chalk.yellow(
                            adjustedTimeout - i
                        )} seconds...`
                    );
                } else {
                    ui.updateBottomBar(
                        `${chalk.yellow(
                            'No opening found.'
                        )} Waiting for: ${chalk.yellow(
                            adjustedTimeout - i
                        )} seconds...`
                    );
                }
                await sleep(1000);
            }
            ui.updateBottomBar(''); // clears the ui bar
            currentDuration = process.hrtime(time)[0];
        }

        // print out finishing information to user
        const finalDuration = process.hrtime(time)[0];
        console.log(
            chalk.yellow(`Registration attempt finished for index ${index}.`)
        );
        const resultsTable = new Table({
            head: ['Status', 'Duration', 'Timestamp'],
            colWidths: [20, 20, 35],
            wordWrap: true,
        });
        const date = new Date();
        const dateText = `${date.getFullYear()}-${date.getMonth() +
            1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        const finalStatus = registered
            ? chalk.green('Succeeded')
            : chalk.red('Failed');
        resultsTable.push([
            finalStatus,
            `${toHHMMSS(finalDuration)}`,
            dateText,
        ]);
        console.log(resultsTable.toString());
        if (!cloud && notification) {
            if (registered) {
                notifier.notify({
                    title: 'Succeeded',
                    message: chalk.green(
                        `Registration for ${index} succeeded...`
                    ),
                });
            } else {
                notifier.notify({
                    title: 'Failed',
                    message: chalk.red(`Registration for ${index} failed...`),
                });
            }
        }
    } catch (err) {
        // notification for an unexpected error
        if (!cloud && notification) {
            notifier.notify({
                title: 'Error',
                message: chalk.red('Registration failed due to an error...'),
            });
        }
        // stops any currently running spinners
        if (checkSpinner) {
            checkSpinner.stop();
        }
        if (regSpinner) {
            regSpinner.fail(err.message);
        }
        if (cmdObj.debug != null) {
            console.log(chalk.red(err));
        }
    }
};

module.exports = register;
