'use strict';
const gulp = require('gulp');
const _ = require('underscore');
const cfg = require('../config');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./../webpack.config.js');

gulp.task('dev', (done) => {

    webpackConfig.entry.unshift(`webpack-dev-server/client?http://localhost:${cfg.server_port}/`);

    const compiler = webpack(webpackConfig);
    const devServerOptions = Object.assign({}, webpackConfig.devServer, {
      stats: {
        colors: true
      },
      contentBase: './bin/',
      publicPath: '/js/',
      compress: true,
      before(app) {
        app.set('view engine', 'ejs');
        app.use(require('../routes/pages'));
      }
    });

    const webpackServer = new WebpackDevServer(compiler, devServerOptions);

    webpackServer.listen(cfg.server_port, (err, res) => {
      if (err) {
        console.log(err);
      }
      console.log(`Webpack Dev Server started: Listening on http://localhost:${cfg.server_port}`);
      done();
    });
});