const gulp = require('gulp');
const argv = require('minimist')(process.argv.slice(2))

process.env.COVEO_ENV = argv.config || 'development';
process.env.ADDITIONAL_USER = argv.additionalUser? argv.additionalUser.split(';') : '';
process.env.FILTER_EXPRESSION = argv.filterExpression || '';
process.env.SEARCH_HUB = argv.searchHub || '';

const requireDir = require('require-dir');
const rmdir = require('gulp-rimraf');
const runsequence = require('run-sequence');
const colors = require('colors');
const cfg = require('./config');
const _ = require('underscore');

var bundles = _.map(cfg.<%=customerSafeName%>.webpack_config, (v, k) => k);

requireDir('./gulpTasks');

gulp.task('default', ['build']);

gulp.task('build', (done) => {
  runsequence('clean', ['setup'], 'compile', done);
});

gulp.task('clean', (done) => {
  return gulp.src(['./bin', './bundle', 'zip'], {
      read: false
    })
    .pipe(rmdir());
});
