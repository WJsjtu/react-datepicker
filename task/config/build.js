var path = require('path');

module.exports = {
    srcDir: path.join(__dirname, '../../src'),
    buildDir: path.join(__dirname, '../../build'),
    nodeDir: path.join(__dirname, '../../node_modules'),
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'immutable': 'Immutable',
        'jquery': 'jQuery'
    }
};