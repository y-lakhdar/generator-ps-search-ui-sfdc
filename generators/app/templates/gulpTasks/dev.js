'use strict';
const _ = require('underscore');
const middlewares = require('./middlewares/cloudPlatformAPI');
const config = require('dotenv').config({ path: 'variables.env' }).parsed;
const argv = require('yargs').argv;
const port = argv.port || 8081;
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.js');

gulp.task('dev', (done) => {

  _.mapObject(webpackConfig.entry, (value, key) => {
      value.unshift(`webpack-dev-server/client?http://localhost:${port}/`);
    });

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

        app.use((req, res, next) => {
          req.filter = cfg.coveo.filter;
          next();
        });

        app.use(require('./routes/pages'));
      }
    });

    const webpackServer = new WebpackDevServer(compiler, devServerOptions);

    webpackServer.listen(port, (err, res) => {
      if (err) {
        console.log(err);
      }
      console.log(`Webpack Dev Server started: Listening on http://localhost:${port}`);
      done();
    });
});