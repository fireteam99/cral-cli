const program = require('commander');
const { prompt } = require('inquirer');

const configure = require('./commands/configure');
const register = require('./commands/register');

program.version('0.0.1')
    .description(`Command line tool for automated course registration for
        Rutgers University.`);

program
    .command('sections')
    .alias('s')
    .description(`Displays a list of sections to watch for.`);

program
    .command('watch')
    .alias('w')
    .description(
        'Notifies user when a section opens up and gives them an option to register.'
    );

program
    .command('options')
    .alias('o')
    .description(`Displays user configuration options.`);

program
    .command('configure')
    .alias('c')
    .description('Allows user to configure their registration options.')
    .action(configure());

program.parse(process.argv);
