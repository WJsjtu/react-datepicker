var fs = require('fs');
var path = require('path');

module.exports = function (func) {
    var build = function (filePath, options) {
        if (!fs.existsSync(filePath)) {
            console.error('Cannot find file ' + filePath + '!');
        }
        var info = fs.statSync(filePath);
        if (info.isDirectory()) {
            var files = fs.readSync(filePath);
            files.forEach(function (file) {
                build(path.join(filePath, file), options);
            });
        } else if (info.isFile()) {
            func(filePath, options);
        }
    };
    return build;
};