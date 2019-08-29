#!/usr/bin/env node

const program = require('commander');
const { prompt } = require('inquirer');

const configure = require('./commands/configure');
const register = require('./commands/register');

program.version('0.0.1')
    .description(`Command line tool for automated course registration for
        Rutgers University.`);
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

// TODO: implement this
program
    .command('register')
    .alias('r')
    .description(
        'Allows user to register for a section of a course. If the section is closed, will monitor for an opening then attempt to register.'
    )
    .action(register);

// checks for invalid commands
if (process.argv.length < 3) {
    program.help();
}

program.on('*').action(function() {
    program.help();
});

program.parse(process.argv);
