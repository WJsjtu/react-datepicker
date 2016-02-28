var cleanTask = require('./scripts/clean');
var webpackTask = require('./scripts/webpack');
var lessTask = require('./scripts/less');
var sassTask = require('./scripts/sass');
var options = require('./config/options');

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
    noneArgs ? webpackTask('*') : webpackTask(jsFiles, options.webpack);
    noneArgs ? lessTask('*') : lessTask(lessFiles);
    noneArgs ? sassTask('*') : sassTask(sassFiles);
};

if (noneArgs) {
    cleanTask().then(build, function (err) {
        console.error(err);
    });
} else {
    build();
}