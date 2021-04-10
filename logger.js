const chalk = require('chalk');

module.exports = {
    quietMode: false,
    info: function(msg) {
        if (!this.quietMode) {
            console.log('[INFO]', msg);
        }
    },
    warn: function(msg) {
        if (!this.quietMode) {
            console.log(chalk.yellow('[WARN] ' + msg));
        }
    },
    error: function(msg) {
        console.log(chalk.bold.red('[ERR] ' + msg));
    },
    success: function(msg) {
        console.log(chalk.bold.green('[SUCCESS] ' + msg));
    }
};
