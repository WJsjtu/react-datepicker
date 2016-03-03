var fs = require('fs');
var path = require('path');
var buildConfig = require('./config.js');
var logger = require('./console');

var buildPath = buildConfig.destDir;

var deleteFolderRecursive = function (folderPath, callback) {
    var files = [];
    if (fs.existsSync(folderPath)) {
        files = fs.readdirSync(folderPath);
        files.forEach(function (file) {
            var curPath = path.join(folderPath, file);
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(folderPath);
        if (typeof callback == 'function') {
            callback();
        }
    } else {
        callback();
    }
};

module.exports = function () {
    return new Promise(function (resolve, reject) {
        var startObject = logger.start('clean', buildConfig.destDir.substr(buildConfig.destDir.lastIndexOf('/') + 1));
        deleteFolderRecursive(buildPath, function () {
            logger.end(startObject);
            resolve();
        });
    });
};