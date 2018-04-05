const gulp = require('gulp');
const shell = require('gulp-shell');
const os = require('os');
const isWindows = os.platform() === 'win32';

gulp.task('compile', ['setup'], shell.task([
  // NODE_ENV=production sets an environement variable that will allow other tasks to know when we are building for production.
  (isWindows ? 'set ' : '') + 'NODE_ENV=production', 'node node_modules/webpack/bin/webpack.js'
]));
