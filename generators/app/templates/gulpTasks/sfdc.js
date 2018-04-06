const gulp = require('gulp');
const zip = require('gulp-zip');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const insert = require('gulp-insert');
const ejs = require('gulp-ejs');
const log = require('fancy-log');
const cfg = require('../config');

gulp.task('sfdc', ['prepareSfdc']);

gulp.task('prepareSfdc', ['prepareSfdcResourceBundles','prepareSfdcVfComponents', 'prepareSfdcVfPages', 'prepareSfdcLightningComponents', 'prepareSfdcClasses'])

gulp.task('bundleSfdc', ['zip-staticresources']);

gulp.task('deploySfdc', ['deploy-staticresources', 'deploy-staticresources-unpackaged', 'deploy-staticresources-bundles', 'deploy-vfcomponents', 'deploy-vfpages', 'deploy-lightningcomponents', 'deploy-classes']);

// PREPARE

gulp.task('prepareSfdcResourceBundles', function (done) {
  return gulp.src(['!./public/vendor/coveo/**/*', '!./public/image/**/*', './public/**/*.Custom.*', './public/**/*.<%= capitalizeCustomerSafeName %>.*'])
    .pipe(gulp.dest('./public/sfdc/staticresources'));
});

gulp.task('prepareSfdcVfComponents', function () {
  gulp.src(['./sfdc/components/*.ejs'])
    .pipe(ejs({
      prototypeTitle: '<%= capitalizeCustomerSafeName %> SFDC VF Components',
      config: cfg
    }, {
      ext: '.component'
    }).on('error', log))
    .pipe(gulp.dest('./public/sfdc/components'));
});

gulp.task('prepareSfdcVfPages', function () {
  gulp.src(['./sfdc/pages/*.ejs'])
    .pipe(ejs({
      prototypeTitle: '<%= capitalizeCustomerSafeName %> SFDC VF Pages',
      config: cfg
    }, {
      ext: '.page'
    }).on('error', log))
    .pipe(gulp.dest('./public/sfdc/pages'));
});

gulp.task('prepareSfdcLightningComponents', function () {
  gulp.src(['./sfdc/aura/**/*'])
    .pipe(ejs({
      prototypeTitle: '<%= capitalizeCustomerSafeName %> SFDC Lightning Components',
      config: cfg
    }).on('error', log))
    .pipe(gulp.dest('./public/sfdc/aura'));
});

gulp.task('prepareSfdcClasses', function () {
  gulp.src(['./sfdc/classes/**/*'])
    .pipe(ejs({
      prototypeTitle: '<%= capitalizeCustomerSafeName %> SFDC Classes',
      config: cfg
    }).on('error', log))
    .pipe(gulp.dest('./public/sfdc/classes'));
});

// BUNDLE

gulp.task('zip-staticresources', function (done) {
  return gulp.src(['./public/sfdc/staticresources/**/*'])
    .pipe(zip('sfdc-bundle.zip'))
    .pipe(rename('<%= capitalizeCustomerSafeName %>_Coveo_UI.resource'))
    .pipe(gulp.dest('./public/sfdc/bundle/zip/'));
});

// DEPLOY

gulp.task('deploy-staticresources', function (done) {
  return gulp.src('./public/sfdc/bundle/zip/<%= capitalizeCustomerSafeName %>_Coveo_UI.resource')
    .pipe(gulp.dest('../Salesforce/dev_org/src/staticresources/'));
});

gulp.task('deploy-staticresources-unpackaged', function (done) {
  return gulp.src('./public/sfdc/bundle/zip/<%= capitalizeCustomerSafeName %>_Coveo_UI.resource')
    .pipe(gulp.dest('../Salesforce/dev_org/src/unpackaged/staticresources/'));
});

gulp.task('deploy-staticresources-bundles', function (done) {
  return gulp.src(['./public/sfdc/staticresources/**/*'])
    .pipe(gulp.dest('../Salesforce/dev_org/resource-bundles/<%= capitalizeCustomerSafeName %>_Coveo_UI.resource/'));
});

gulp.task('deploy-vfcomponents', function (done) {
  return gulp.src('./public/sfdc/components/*')
    .pipe(gulp.dest('../Salesforce/dev_org/src/unpackaged/components/'));
});

gulp.task('deploy-vfpages', function (done) {
  return gulp.src('./public/sfdc/pages/*')
    .pipe(gulp.dest('../Salesforce/dev_org/src/unpackaged/pages/'));
});

gulp.task('deploy-lightningcomponents', function (done) {
  return gulp.src('./public/sfdc/aura/**/*')
    .pipe(gulp.dest('../Salesforce/dev_org/src/unpackaged/aura/'));
});

gulp.task('deploy-classes', function (done) {
  return gulp.src('./public/sfdc/classes/*')
    .pipe(gulp.dest('../Salesforce/dev_org/src/unpackaged/classes/'));
});
