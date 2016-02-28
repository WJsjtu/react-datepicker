var path = require('path');
var argsFiles = process.argv.splice(2);
var devServer = require('./config/server.js');

argsFiles.forEach(function (file, index) {
    argsFiles[index] = path.join(__dirname, '../src', file);
});

devServer(argsFiles, 3000);