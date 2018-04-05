const webpack = require('webpack');
const failPlugin = require('webpack-fail-plugin');
const path = require('path');
const ReloadPlugin = require('reload-html-webpack-plugin');
const production = process.env.NODE_ENV === 'production';

console.log('Building resources for production: ', production);

const configureSassForDev = require('./webpack.sass').configureSassForDev;
const configureSassForProduction = require('./webpack.sass').configureSassForProduction;

let plugins = [];
let additionalRules = [];

plugins.push(failPlugin);

if (!production) {
  plugins.push(new ReloadPlugin());
}

if (production) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

if (production) {
  configureSassForProduction(additionalRules, plugins, production);
}

if (!production) {
  configureSassForDev(additionalRules, plugins, production);
}

module.exports = {
  entry: [path.resolve('./src/Index')],
  output: {
    path: path.resolve(__dirname, 'bin/js'),
    filename: production ? `Coveo.<%= capitalizeCustomerSafeName %>.min.js` : `Coveo.<%= capitalizeCustomerSafeName %>.js`,
    libraryTarget: 'umd',
    library: 'CoveoExtension',
    publicPath: './'
  },
  resolve: {
    extensions: ['.ts', '.js', '.svg', '.scss'],
    alias: {
      svg: require('path').resolve('./image/svg'),
      sass: require('path').resolve('./sass')
    }
  },
  externals: [
    {
      'coveo-search-ui': 'Coveo'
    }
  ],
  devtool: 'inline-source-map',
  module: {
    rules: additionalRules.concat([
      {
        test: require.resolve('jquery'),
        use: [
          {
            loader: 'expose-loader',
            options: '$'
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'image/[name].[ext]',
              outputPath: '../'
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
          outputPath: '../'
        }
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {}
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-inline-loader'
          }
        ]
      }
    ])
  },
  plugins: plugins,
  bail: true
};
