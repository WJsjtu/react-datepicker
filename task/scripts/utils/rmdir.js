var fs = require('fs'),
    path = require('path');

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

module.exports = function (dirPath) {
    return new Promise(function (resolve, reject) {
        deleteFolderRecursive(dirPath, resolve.bind(this));
    });
};
