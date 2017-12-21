const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const script = process.env.npm_lifecycle_event;
const isProd = script === 'build';
const isDev = !isProd;

module.exports = function() {
  let config = {};

  config.entry = path.resolve(__dirname, 'src', 'index.js');
  config.output = {
    path: path.resolve(__dirname, isProd ? 'dist' : 'src'),
    filename: '[name].[chunkhash].js',
    publicPath: '/'
  };

  config.resolve = {
    extensions: ['.js', '.scss', '.html'],
    alias: {
      vue: isProd ? 'vue/dist/vue.min.js' : 'vue/dist/vue.js'
    }
  };

  config.module = {
    rules: [
      {
        test: /.scss$/,
        loader: 'style-loader!css-loader!sass-loader',
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /.html$/,
        loader: 'raw-loader?html-minify-loader',
        include: path.resolve(__dirname, 'src')
      }
    ]
  };

  config.plugins = [
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      isDev,
      isProd
    })
  ];

  if (isProd) {
    config.plugins.push(
        new UglifyJsPlugin()
    );

    config.plugins.push(
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: '"production"'
          }
        })
    );
  }

  config.devServer = {
    contentBase: './src',
    historyApiFallback: {
      index: 'src/index.html'
    },
    port: 8080
  };

  return config;
}();