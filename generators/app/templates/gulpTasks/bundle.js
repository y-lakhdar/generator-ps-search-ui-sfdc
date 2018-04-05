const gulp = require('gulp');
const zip = require('gulp-zip');

function getCurrentDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  today = mm + '-' + dd + '-' + yyyy;
  return today;
}

gulp.task('bundle', ['build'], () => {
  return gulp
    .src(['./bin/**'])
    .pipe(zip(`bundle.${getCurrentDate()}.zip`))
    .pipe(gulp.dest('./zip/'));
});
