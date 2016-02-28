var fs = require('fs');
var exec = require('child_process').exec;
var buildConfig = require('./config.js');
var Q = require('q');

var buildPath = buildConfig.destDir;

module.exports = function () {
    var deferred = Q.defer();

    if (fs.existsSync(buildPath)) {
        exec('rm -rf ' + buildPath, function (err) {
            if (err) {
                deferred.reject(err);
            } else {
                console.log('==> Clean finished!');
                fs.mkdirSync(buildPath);
                deferred.resolve();
            }
        });
    } else {
        deferred.resolve();
    }
    return deferred.promise;
};