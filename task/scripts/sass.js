var fs = require('fs');
var path = require('path');
var Q = require('q');
var buildConfig = require('./config.js');
var recurseTask = require('./recursion');
var mkdir = require('./mkdir');
var sass = require('node-sass');


var sassTask = function (srcPath, options) {
    var srcDir = srcPath.substr(0, srcPath.lastIndexOf('/'));
    var srcFile = srcPath.substr(srcPath.lastIndexOf('/') + 1);
    var destDir = path.join(buildConfig.destDir, srcDir.replace(buildConfig.srcDir, ''));
    var destFile = options.name ? options.name + '.css' : srcFile.replace(/\.(sass|scss)$/, '.css');
    var destPath = path.join(destDir, destFile);

    var deferred = Q.defer();
    sass.render({
        file: srcPath,
        includePaths: [srcDir],
        outFile: destPath,
        outputStyle: 'compressed'
    }, function (err, result) {
        if (err || !result.css) {
            deferred.reject(err);
        } else {
            mkdir(destDir);
            fs.writeFile(destPath, result.css, function (_err) {
                if (!_err) {
                    deferred.resolve(result.css);
                } else {
                    deferred.reject(_err);
                }
            });
        }
    });

    return deferred.promise;
};

module.exports = function (srcNames) {

    var build = recurseTask(function (filePath, options) {
        sassTask(filePath, options).then(function () {
            console.log("==> Sass build finished:\n\t" + filePath);
        }, function (rejected) {
            console.error(rejected);
        });
    });

    var cwd = buildConfig.srcDir;
    if (srcNames == '*') {
        var rawList = buildConfig.sass;
        for (var index in rawList) {
            if (rawList.hasOwnProperty(index)) {
                build(path.join(cwd, rawList[index][0]), rawList[index][1]);
            }
        }
    } else if (srcNames.length) {
        srcNames.forEach(function (srcName) {
            build(path.join(cwd, srcName));
        });
    }
};