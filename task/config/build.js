var path = require('path');
var options = require('./options');

module.exports = {
    srcDir: path.join(__dirname, '../../src'),
    destDir: path.join(__dirname, '../../build'),
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },
    js: [
        ['DatePicker.js', Object.assign({}, options.webpack, {name: 'react-datepicker'})]
    ],
    less: [
        ['DatePicker.less', {name: 'react-datepicker'}]
    ]
};