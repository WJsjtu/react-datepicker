var fs = require('fs');
var path = require('path');

module.exports = function (pathName) {
    pathName = pathName.replace(/\/$/, '');
    if (!fs.existsSync(pathName)) {
        var pathArr = [];
        var parent = pathName.substr(0, pathName.lastIndexOf('/'));
        var dirname = pathName.substr(pathName.lastIndexOf('/') + 1);
        while (!fs.existsSync(parent)) {
            pathArr.push(dirname);
            dirname = parent.substr(parent.lastIndexOf('/') + 1);
            parent = parent.substr(0, parent.lastIndexOf('/'));
        }
        pathArr.push(dirname);
        var current = parent;
        pathArr.reverse().forEach(function (dir) {
            current = path.join(current, dir);
            fs.mkdirSync(current);
        });
    }
};