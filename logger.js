const chalk = require('chalk');

module.exports = {
    info: function(msg) {
        console.log('[INFO]', msg);
    },
    warn: function(msg) {
        console.log(chalk.yellow('[WARN] ' + msg));
    },
    error: function(msg) {
        console.log(chalk.bold.red('[ERR] ' + msg));
    },
    success: function(msg) {
        console.log(chalk.bold.green('[SUCCESS] ' + msg));
    }
};
