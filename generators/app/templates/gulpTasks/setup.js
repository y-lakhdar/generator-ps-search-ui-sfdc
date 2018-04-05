const gulp = require('gulp');
const ejs = require('gulp-ejs');
const cfg = require('../config');
const cloudPlatformAPI = require('./middlewares/cloudPlatformAPI');

gulp.task('setup', ['preparePages', 'copy']);

gulp.task('copy', ['copyVendor', 'copyServer']);

gulp.task('sfdc', ['prepareSfdc']);

gulp.task('preparePages', function () {
    gulp.src(['views/pages/*.ejs'])
        .pipe(ejs({
          title : '<%= capitalizeCustomerSafeName %> Search Prototype',
          config: cfg,
          token: '',
          production: process.env.NODE_ENV == 'production'
        }, { ext:'.html' }))
        .pipe(gulp.dest('./bin'))
});

gulp.task('copyVendor', function (done) {
  return gulp.src(['./vendor/**/*'])
    .pipe(gulp.dest('./bin/vendor'));
});

gulp.task('copyServer', function (done) {
  return gulp.src(['./server.js'])
    .pipe(gulp.dest('./bin/server.js'));
});
