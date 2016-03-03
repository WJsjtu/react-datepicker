var cleanTask = require('./scripts/clean');
var webpackTask = require('./scripts/webpack');
var lessTask = require('./scripts/less');
var sassTask = require('./scripts/sass');
var clc = require('cli-color');

var argsFiles = process.argv.splice(2);

var jsFiles = [];
var lessFiles = [];
var sassFiles = [];

var noneArgs = !argsFiles.length;

if (!noneArgs) {
    argsFiles.forEach(function (file) {
        file = file.trim();
        if (file.match(/\.(js|jsx)$/g)) {
            jsFiles.push(file);
        } else if (file.match(/\.less$/g)) {
            lessFiles.push(file);
        } else if (file.match(/\.s(a|c)ss$/g)) {
            sassFiles.push(file);
        }
    });
}

var build = function () {
    webpackTask(noneArgs ? '*' : jsFiles);
    lessTask(noneArgs ? '*' : lessFiles);
    sassTask(noneArgs ? '*' : sassFiles);
};

if (noneArgs) {
    cleanTask().then(build, function () {
        console.error(clc.red(arguments));
    }).catch(function () {
        console.error(clc.red(arguments));
    });
} else {
    build();
}