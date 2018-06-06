const gulp = require('gulp');
const ejs = require('gulp-ejs');
const cfg = require('../config');

gulp.task('setup', ['preparePages', 'copy']);

gulp.task('copy', ['copyJS', 'copyCSS', 'copyServer']);

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

// gulp.task('copyVendor', function (done) {
//   return gulp.src(['./vendor/**/*'])
//     .pipe(gulp.dest('./bin/vendor'));
// });

gulp.task('copyJS', function() {
  gulp.src([
    './node_modules/coveo-search-ui/bin/js/CoveoJsSearch*',
    './node_modules/coveo-search-ui/bin/js/templates/templates*',
    './vendor/coveo/resources/js/components.js',
    './vendor/coveo/Box/js/templates/box.new.templates.js',
    './vendor/coveo/Box/js/*.js'
  ]).pipe(gulp.dest('./bin/coveo/js'));
});

gulp.task('copyCSS', function() {
  gulp.src([
    './node_modules/coveo-search-ui/bin/css/*.css',
    './vendor/coveo/Box/css/*.css'
  ]).pipe(gulp.dest('./bin/coveo/css'));
});

gulp.task('copyServer', function (done) {
  return gulp.src(['./server.js'])
    .pipe(gulp.dest('./bin/server.js'));
});
