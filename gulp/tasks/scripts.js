'use strict';

const gulp = require('gulp'),
      concat = require('gulp-concat'),
      babel = require('gulp-babel'),
      sq = require('streamqueue'),
      config = require('../config'),
      path = require('path'),
      wrap = require('gulp-wrap-umd'),
      beautify = require('gulp-beautify');


gulp.task('scripts', function () {
  let q = config.files.map(function (file) {
    return gulp.src(path.join('./src',file));
  });

  config.extensions.forEach(function (file) {
    q.push(gulp.src(path.join('./src/extensions',file)));
  });

  return sq.apply(sq, [{objectMode:true}].concat(q))
  .pipe(concat('bobo.js'))
  .pipe(babel())
  .pipe(wrap({
    namespace: 'Bobo',
    exports: 'Bobo'
  }))
  .pipe(beautify({indentSize: 2}))
  .pipe(gulp.dest(config.destPath));
});
