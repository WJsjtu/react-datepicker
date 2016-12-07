var clc = require('cli-color');

var parseDate = function (date) {
    var hour = parseInt(date.getHours());
    var minutes = parseInt(date.getMinutes());
    var seconds = parseInt(date.getSeconds());
    hour = (hour < 10 ? '0' : '') + hour;
    minutes = (minutes < 10 ? '0' : '') + minutes;
    seconds = (seconds < 10 ? '0' : '') + seconds;
    return [hour, minutes, seconds].join(':');
};

function Logger(taskName, fileName) {

    this.taskName = taskName;

    this.fileName = fileName;

    this.start = function () {
        this.startTime = new Date();
        console.log(
            '[' + clc.blackBright(parseDate(this.startTime)) + '] ' +
            'Starting \'' + clc.cyan(this.taskName) + '\'...'
        );
        return this;
    };

    this.finish = function () {
        this.finishTime = new Date();
        console.log(
            '[' + clc.blackBright(parseDate(this.finishTime)) + '] ' +
            clc.green('Finished') + ' \'' +
            clc.cyan(this.taskName) +
            '\' after ' +
            clc.magenta('' + this.finishTime.getTime() - this.startTime.getTime() + ' ms ') +
            clc.blue(this.fileName)
        );
        return this;
    };

    this.error = function (args) {
        this.errorTime = new Date();
        console.error(
            '[' + clc.blackBright(parseDate(this.errorTime)) + '] ' +
            clc.red('Error') +
            '\' after ' +
            clc.magenta('' + this.errorTime.getTime() - this.startTime.getTime() + ' ms ') +
            clc.blue(this.fileName) +
            clc.red(' ' + args)
        );
        return this;
    };

}

module.exports = function (taskName, fileName) {
    return new Logger(taskName, fileName);
};