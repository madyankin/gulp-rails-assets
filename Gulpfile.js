var gulp   = require('gulp');
var mocha  = require('gulp-mocha');
var jscs   = require('gulp-jscs');
var clean  = require('gulp-clean');
var assets = require('./');

gulp.task('lint', function() {
  return gulp.src('*.js')
    .pipe(jscs());
});

gulp.task('test', ['assets'], function() {
  return gulp.src('test.js', {read: false})
    .pipe(mocha());
});

gulp.task('assets', ['clean'], function() {
  return gulp.src('test/assets/**/*.{js,css}')
    .pipe(assets({manifest: 'tmp/manifest.json'}))
    .pipe(gulp.dest('tmp'));
});

gulp.task('clean', function() {
  return gulp.src('tmp/*', {read: false})
    .pipe(clean());
});

gulp.task('default', ['lint', 'test']);
