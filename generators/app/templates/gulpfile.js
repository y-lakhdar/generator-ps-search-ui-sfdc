const gulp = require('gulp');
const argv = require('minimist')(process.argv.slice(2))

process.env.COVEO_ENV = argv.config || 'development';
process.env.CUSTOM_BUNDLE = argv.bundle || 'support';
process.env.IMPERSONATE_USER = argv.impersonateUser || '';
process.env.ADDITIONAL_USER = argv.additionalUser || '';
process.env.FILTER_EXPRESSION = argv.filterExpression || '';

const rename = require('gulp-rename');
const requireDir = require('require-dir');
const rmdir = require('gulp-rimraf');
const zip = require('gulp-zip');
const livereload = require('gulp-livereload');
const runsequence = require('run-sequence');
const colors = require('colors');
const minimize = process.argv.indexOf('--minimize') !== -1;
const cfg = require('./config');
const _ = require('underscore');

var bundles = _.map(cfg.<%=customerSafeName%>.webpack_config, (v, k) => k);
var bannerMsg = minimize ? 'Building minified version' : 'Building non minified version';

requireDir('./gulpTasks');

gulp.task('default', ['buildAll']);

gulp.task('prepublish', ['buildAll']);

gulp.task('buildAll', function (done) {
  console.log((bannerMsg + ' for all distribution [' + bundles.join(', ') + ']').bgGreen.red);
  runsequence('clean', ['css', 'setup'], 'compileAll', done);
});

gulp.task('build', function (done) {
  console.log((bannerMsg + ' of the library [' + process.env.CUSTOM_BUNDLE + ' bundle]').bgGreen.red);
  runsequence('clean', ['css', 'setup'], 'compile', done);
});

gulp.task('clean', function (done) {
  return gulp.src(['./bin'], {
      read: false
    })
    .pipe(rmdir());
});

gulp.task('watch', function () {
  livereload.listen();
  gulp.watch(['./sass/**/*'], ['css']);
  //gulp.watch(['./views/**/*'], ['prepareVFComponents', 'preparePages']);
});