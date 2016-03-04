var fs = require('fs'),
    path = require('path');

module.exports = function (dirPath) {
    dirPath = dirPath.replace(/\/$/, '');
    return new Promise(function (resolve, reject) {
        if (fs.existsSync(dirPath)) {
            resolve(dirPath);
        } else {
            var pathArray = [];
            var parentDir = dirPath.substr(0, dirPath.lastIndexOf('/'));
            var dirName = dirPath.substr(dirPath.lastIndexOf('/') + 1);
            while (!fs.existsSync(parentDir)) {
                pathArray.push(dirName);
                dirName = parentDir.substr(parentDir.lastIndexOf('/') + 1);
                parentDir = parentDir.substr(0, parentDir.lastIndexOf('/'));
            }
            pathArray.push(dirname);
            var currentDir = parentDir;
            pathArray.reverse().forEach(function (dir) {
                currentDir = path.join(currentDir, dir);
                fs.mkdirSync(currentDir);
            });
            resolve(dirPath);
        }
    });
};