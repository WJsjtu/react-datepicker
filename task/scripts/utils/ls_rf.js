var path = require('path'),
    fs = require('fs');

module.exports = function (dirPath, filter) {

    var result = [];

    var recursion = function (filePath, filter) {
        if (!fs.existsSync(filePath)) {
            return;
        }
        var info = fs.statSync(filePath);
        if (info.isDirectory()) {
            var files = fs.readdirSync(filePath);
            files.forEach(function (file) {
                recursion(path.join(filePath, file), filter);
            });
        } else if (info.isFile()) {
            if (filter) {
                if(filter.match && filter.match(filePath)) {
                    result.push(filePath);
                }
            } else {
                result.push(filePath);
            }
        }
    };

    recursion(dirPath, filter);
    return result;
};