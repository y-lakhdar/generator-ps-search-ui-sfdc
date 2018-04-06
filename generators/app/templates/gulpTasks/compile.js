const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task('compile', ['setup'], shell.task([
    'cross-env NODE_ENV=production node node_modules/webpack/bin/webpack.js'
  ])
);
