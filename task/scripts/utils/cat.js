var fs = require('fs');

var defaultOptions = {encoding: 'utf8'};

module.exports = function (filePath) {
    return new Promise(function (resolve, reject) {
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            fs.readFile(filePath, Object.assign({}, defaultOptions), function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data);
                }
            });
        } else {
            reject('file not found');
        }
    });
};