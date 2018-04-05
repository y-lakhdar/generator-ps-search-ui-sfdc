'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const compression = require('compression');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const server = express();
const cfg = require('../config');
const passport = require('../passports');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config.js');
const gulp = require('gulp');
const path = require('path');

gulp.task('dev', ['css', 'setup', 'watch'], function (done){
    process.env.IS_DEV_SERVER = true;
    // set the view engine to ejs
    server.set('view engine', 'ejs');


    if(cfg.iow_path){
        server.use('/iow', express.static(path.resolve(cfg.iow_path)));
    }

    server.use(compression());
    server.use(methodOverride());
    server.use(cookieParser());
    server.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: false, cookie: { maxAge: 3600*1000 } }));
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));

    server.use(passport.initialize());
    server.use(passport.session());

    server.use(express.static(path.resolve('./public')));
    server.use(require(path.resolve('./routes/authentication')));
    server.use(require(path.resolve('./routes/errors')));

    // passport.protected middleware can be used to protect/secure your routes
    //server.use('/', passport.protected);
    server.use(require(path.resolve('./routes/pages')));
    
    server.listen(cfg.server_port, cfg.server_ip_address, function () {
        console.log( 'Listening on ' + cfg.server_ip_address + ', port ' + cfg.server_port )
    });

    webpackConfig.entry['Coveo.<%= capitalizeCustomerSafeName %>'].unshift('webpack-dev-server/client?http://localhost:3001/');
    const compiler = webpack(webpackConfig);

    new WebpackDevServer(compiler, {
        hot:true,
        historyApiFallback: true,
        contentBase: 'public/',
        publicPath: '/js/',
        compress: true,
        proxy: {
            '*': 'http://' + cfg.server_ip_address + ':' + cfg.server_port
        }
    }).listen(3001, cfg.server_ip_address, function (err, result){
        if(err){
            console.log(err);
        }
        console.log('Listening at ' + cfg.server_ip_address + ':3001' )
    });
    done();
});