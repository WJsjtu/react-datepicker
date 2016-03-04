var path = require('path'),
    fs = require('fs');

var ls_rf = require('./scripts/utils/ls_rf');
var config = require('./config/build');

var webpackTool = require('./scripts/tools/webpack'),
    lessTool = require('./scripts/tools/less'),
    sassTool = require('./scripts/tools/sass'),
    cleanTool = require('./scripts/tools/clean');

var argsFiles = process.argv.splice(2);

var taskList = {
    'webpack': {
        'DatePicker': function () {
            webpackTool('DatePicker.js').then(function (filePath, stats) {
                fs.renameSync(filePath, filePath.replace(/DatePicker\.js$/, 'react-datepicker.js'));
            }).catch(console.log.bind(console));
        }
    },
    'less': {
        'DatePicker': function () {
            lessTool('DatePicker.less').then(function (filePath, css) {
                fs.renameSync(filePath, filePath.replace(/DatePicker\.css$/, 'react-datepicker.css'));
            }).catch(console.log.bind(console));
        }
    },
    'sass': {
        'DatePicker': function () {
            sassTool('DatePicker.scss').then(function (filePath, css) {
                fs.renameSync(filePath, filePath.replace(/DatePicker\.css$/, 'react-datepicker.css'));
            }).catch(console.log.bind(console));
        }
    }
};

if (argsFiles.length) {
    if (argsFiles.length == 1) {
        if (taskList[argsFiles[0]]) {
            var j;
            for (j in taskList[argsFiles[0]]) {
                taskList[argsFiles[0]][j]();
            }
        }
    } else if (argsFiles.length == 2) {
        if (taskList[argsFiles[0]] && taskList[argsFiles[0]][argsFiles[1]]) {
            taskList[argsFiles[0]][argsFiles[1]]();
        }
    }
} else {
    cleanTool().then(function (targetDir) {
        var i;
        for (i in taskList.webpack) {
            taskList.webpack[i]();
        }
        for (i in taskList.less) {
            taskList.less[i]();
        }
        for (i in taskList.sass) {
            taskList.sass[i]();
        }
    }).catch(console.log.bind(console));
}
