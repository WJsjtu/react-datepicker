var fs = require('fs');
var path = require('path');
var log = require('./log');
var mkdir = require('./mkdir');
var webpack = require('./webpack');

var nodeDir = './../node_modules/';

var dependencies = [
    'babel-standalone/babel.min.js',
    'codemirror/mode/javascript/javascript.js',
    'codemirror/mode/jsx/jsx.js',
    'codemirror/mode/xml/xml.js',
    'codemirror/lib/codemirror.css',
    'codemirror/lib/codemirror.js'
];

var checkPassed = true;

var logger = log('tool-editor', 'tool/editor.js');

logger.start();

(function checkDependencies() {
    dependencies.forEach(function (dependency) {
        var dependencyPath = path.join(__dirname, nodeDir, dependency);
        if (!fs.existsSync(dependencyPath)) {
            checkPassed = false;
            logger.error('Dependency not found: ' + dependency);
        }
    });
})();

if (checkPassed) {
    var distPath = path.join(__dirname, './../dist/tool/editor');
    mkdir(distPath);
    dependencies.forEach(function (dependency) {
        var dependencyPath = path.join(__dirname, nodeDir, dependency);
        fs.createReadStream(dependencyPath).pipe(fs.createWriteStream(path.join(distPath, dependency.split('/').pop())));
    });
    webpack(
        path.join(__dirname, './../src/tool/editor/index.js'),
        path.join(__dirname, './../dist/tool/editor/editor.js')
    ).then(function () {
        logger.finish();
    }, function (e) {
        logger.error(e);
    });


}