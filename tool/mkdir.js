var fs = require('fs');
var path = require('path');

module.exports = function (dirPath) {

    if (!dirPath || typeof dirPath !== 'string' || fs.existsSync(dirPath)) return;

    dirPath = dirPath.replace(/\/$/, '');

    var pathArray = dirPath.split('/');

    var currentPath = pathArray[0] + '/';

    for (var i = 1; i < pathArray.length; i++) {
        if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
        }
        currentPath = path.join(currentPath, pathArray[i]) + '/';
    }
    if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath);
    }
};