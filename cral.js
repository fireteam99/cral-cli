#!/usr/bin/env node

const program = require('commander');
const { prompt } = require('inquirer');

const configure = require('./commands/configure');
const register = require('./commands/register');

program.version('0.0.1')
    .description(`Command line tool for automated course registration for
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
    .command('sections')
    .alias('s')
    .description(`Displays a list of sections to watch for.`);

// TODO: implement this
program
    .command('watch')
    .alias('w')
    .description(
        'Notifies user when a section opens up and gives them an option to register.'
    );

// TODO: implement this
program
    .command('options')
    .alias('o')
    .description(`Displays user configuration options.`);

// TODO: implement this
program
    .command('configure')
    .alias('c')
    .description('Allows user to configure their registration options.')
    .action(configure);

program
    .command('register [index]')
    .alias('r')
    .option('-v, --verbose', 'Log more information to console')
    .option('-d, --debug', 'Runs puppeteer in non headless mode')
    .option(
        '-t <time>',
        'Specify number of minutes to attempt registration',
        parseInt
    )
    .description('Allows user to register for a section of a course.')
    .action(function(index, cmdObj) {
        // console.log(index);
        // console.log(cmdObj);
        register({ index, ...cmdObj });
    });

// checks for empy commands
if (process.argv.length < 3) {
    program.help();
}

program.parse(process.argv);
