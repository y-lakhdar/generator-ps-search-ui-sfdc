const gulp = require('gulp');
const ejs = require('gulp-ejs');
const cfg = require('../config');
const cloudPlatformAPI = require('./middlewares/cloudPlatformAPI');

gulp.task('setup', ['preparePages', 'copy']);

gulp.task('copy', ['copyVendor']);

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
        .pipe(livereload());
});

gulp.task('copyVendor', function (done) {
  return gulp.src(['./vendor/**/*'])
    .pipe(gulp.dest('./bin/vendor'));
});

// gulp.task('copyJS', function () {
//   gulp.src([
//     './node_modules/coveo-search-ui/bin/js/**/*',
//       './vendor/coveo/resources/js/components.js',
//       './vendor/coveo/Box/js/templates/box.new.templates.js',
//       './vendor/coveo/Box/js/*.js'
//     ]).pipe(gulp.dest('./bin/js'))
// });

// gulp.task('copyCSS', function () {
//   gulp.src([
//     './node_modules/coveo-search-ui/bin/css/*.css',
//     './vendor/coveo/Box/css/*.css'
//   ]).pipe(gulp.dest('./bin/css'))
// });

// gulp.task('copyFonts', function () {
//   /*gulp.src([
//     './vendor/project/fonts/*.*',
//   ]).pipe(gulp.dest('./bin/fonts'))*/
// });

// gulp.task('copyImage', function () {
//   gulp.src('./node_modules/coveo-search-ui/bin/image/*')
//       .pipe(gulp.dest('./public/image'))
// });