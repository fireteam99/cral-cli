function handleUnexpectedError(err, cmdObj) {
    console.error(
        chalk.red(cmdObj && cmdObj.verbose ? err.stack : err.message)
    );
}

module.exports = handleUnexpectedError;
