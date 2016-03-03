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

module.exports = {
    start: function (name, fileName) {
        var start = new Date();
        var startTime = start.getTime();
        console.log(
            '[' + clc.blackBright(parseDate(start)) + '] ' +
            'Starting \'' + clc.cyan(name) + '\'...')
        ;
        return {
            name: name,
            startTime: startTime,
            fileName: fileName
        };
    },
    end: function (startObject) {
        var end = new Date();
        console.log(
            '[' + clc.blackBright(parseDate(end)) + '] ' +
            clc.green('Finished') + ' \'' +
            clc.cyan(startObject.name) +
            '\' after ' +
            clc.magenta('' + end.getTime() - startObject.startTime + ' ms ') +
            clc.blue(startObject.fileName)
        );
    }
};