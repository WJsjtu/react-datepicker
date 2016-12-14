var fs = require('fs');
var path = require('path');
var log = require('./log');
var webpack = require('./webpack');

var logger = log('test:datepicker', 'test/index.js');
logger.start();
webpack(
    path.join(__dirname, './../test/index.js'),
    path.join(__dirname, './../test/datepicker.test.js')
).then(function () {
    logger.finish();
}, function (e) {
    logger.error(e);
});