var path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

var srcDir = path.join(__dirname, '../../src');
var destDir = path.join(__dirname, '../../build');

module.exports = function (entries, port) {
    port = port || 3000;
    entries = entries.length || [path.join(srcDir, 'index')];

    var config = {
        entry: {
            vendor: [
                'react',
                'react-dom',
                'react-hot-api',
                'react-hot-loader',
                'webpack-dev-server/client?http://localhost:' + port,
                'webpack/hot/only-dev-server'
            ],
            app: entries
        },
        output: {
            path: destDir,
            filename: 'bundle.js',
            publicPath: '/build/'
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: Infinity,
                filename: 'common.js'
            }),
            new webpack.optimize.OccurenceOrderPlugin()
        ],
        module: {
            loaders: [{
                test: /\.less$/, loader: 'style!css!less',
                exclude: ['node_modules']
            }, {
                test: /\.js$/,
                loader: 'react-hot',
                include: srcDir,
                exclude: ['node_modules']
            }, {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react']
                },
                include: srcDir,
                exclude: ['node_modules']
            }]
        }
    };

    new WebpackDevServer(webpack(config), {
        publicPath: config.output.publicPath,
        hot: true,
        noInfo: false,
        stats: {colors: true},
        open: true,
        historyApiFallback: true
    }).listen(port, 'localhost', function (error) {
        if (error) {
            console.error(error);
        }
        console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
    });
};


