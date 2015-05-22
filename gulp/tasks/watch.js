'use strict';

const gulp = require('gulp');


gulp.task('watch', function () {
  return gulp.watch('./src/**/*.js', ['scripts']);
})