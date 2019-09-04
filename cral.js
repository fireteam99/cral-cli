#!/usr/bin/env node

const program = require('commander');
const { prompt } = require('inquirer');

const configure = require('./commands/configure');
const register = require('./commands/register');
const display = require('./commands/display');

program.version('1.0.0')
    .description(`Command line interface to automated course registration for
        Rutgers University.`);

// error on unknown commands
program.on('command:*', function() {
    console.error(
        'Invalid command: %s\nSee --help for a list of available commands.',
        program.args.join(' ')
    );
    process.exit(1);
});

// TODO: implement this
program
    .command('display')
    .alias('d')
    .description(`Displays user configuration options.`)
    .option('-p, --password', 'Display password')
    .action(async function(cmdObj) {
        await display(cmdObj);
        process.exit(0);
    });

program
    .command('configure')
    .alias('c')
    .option('-u, --username', 'Configure username')
    .option('-p, --password', 'Configure password')
    .option('-y, --year', 'Configure year')
    .option('-t, --term', 'Configure term')
    .option('-c, --campus', 'Configure campus')
    .option('-l, --level', 'Configure level')
    .option('-n, --notification', 'Configure notification')
    .option('-t, --timeout', 'Configure timeout')
    .option('-r, --randomization', 'Configure randomization')
    .option('-c, --cloud', 'Configure cloud')
    .option('-v, --verify', 'Configure index verification')
    .description('Allows user to configure their registration options.')
    .action(async function(cmdObj) {
        process.exit(0);
    });

program
    .command('register [index]')
    .alias('r')
    .option('-v, --verbose', 'Log more information to console')
    .option('-d, --debug', 'Runs puppeteer in non-headless mode')
    .option(
        '-t <time>',
        'Specify number of minutes to attempt registration',
        parseInt
    )
    .option('-u <username>', 'Overrides the configured username')
    .option('-p <password>', 'Overrides the configured password')
    .description('Allows user to register for a section of a course.')
    .action(async function(index, cmdObj) {
        console.log(cmdObj);
        await register({ index, ...cmdObj });
        process.exit(0);
    });

// checks for empy commands
if (process.argv.length < 3) {
    program.help();
}

program.parse(process.argv);
