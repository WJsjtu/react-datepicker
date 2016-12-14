var path = require('path'),
    webpack = require('webpack');

var definePlugin = new webpack.DefinePlugin({
    'process.env': {
        NODE_ENV: JSON.stringify('production')
    }
});

var compressPlugin = new webpack.optimize.UglifyJsPlugin({
    compress: {
        dead_code: true,
        drop_debugger: true,
        unused: true,
        if_return: true,
        warnings: false,
        join_vars: true
    },
    output: {
        comments: false
    }
});

var orderPlugin = new webpack.optimize.OccurrenceOrderPlugin();

var defaultOptions = {
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel'
        }, {
            test: /\.(less|css)$/, loader: 'style-loader!css-loader?modules&localIdentName=[local]_[hash:base64:5]&minimize=true!less-loader?minimize=true'
        }, {
            test: /\.(tmpl|txt)$/, loader: 'raw-loader'
        }]
    }
};

module.exports = function (srcFile, distFile, disableCompress) {
    var options = Object.assign({}, defaultOptions, {
        entry: srcFile,
        output: {
            path: path.dirname(distFile),
            filename: path.basename(distFile),
            libraryTarget: 'commonjs2'
        },
        externals: defaultOptions.externals,
        plugins: [definePlugin, orderPlugin].concat(!disableCompress ? compressPlugin : [])
    });

    return new Promise(function (resolve, reject) {
        webpack(options, function (err, stats) {
            if (err) {
                reject(err);
            } else if (stats.compilation.errors.length) {
                var messages = [];
                stats.compilation.errors.forEach(function (e) {
                    messages.push(e.message);
                });
                reject(messages.join('\n'));
            } else {
                resolve();
            }
        });
    });
};