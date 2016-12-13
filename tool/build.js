var fs = require('fs');
var path = require('path');
var log = require('./log');
var mkdir = require('./mkdir');
var webpack = require('./webpack');

var distPath = path.join(__dirname, './../dist/');
mkdir(distPath);

var logger = log('datepicker', 'src/index.js');
logger.start();
webpack(
    path.join(__dirname, './../test/index.js'),
    path.join(__dirname, './../dist/datepicker.min.js')
).then(function () {
    logger.finish();
}, function (e) {
    logger.error(e);
});