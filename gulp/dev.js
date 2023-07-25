const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const sourceMaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

const fileIncludeSettings = {
  prefix: '@@',
  basepath: '@file',
};

const serverOptions = {
  livereload: true,
  open: false,
};

const notificationOptions = {
  errorHandler: notify.onError({
    title: 'Error gulp',
    message: 'Error <%= error.message %>',
    sound: false,
  }),
};

gulp.task('html:dev', function () {
  return gulp
    .src('./src/*.html')
    .pipe(changed('./build/'))
    .pipe(fileInclude(fileIncludeSettings))
    .pipe(gulp.dest('./build/'));
});

gulp.task('sass:dev', function () {
  return (
    gulp
      .src('./src/scss/*.scss')
      .pipe(changed('./build/css/'))
      .pipe(plumber(notificationOptions))
      .pipe(sourceMaps.init())
      .pipe(sass())
      .pipe(sourceMaps.write('.'))
      .pipe(gulp.dest('./build/css/'))
  );
});

gulp.task('images:dev', function () {
  return gulp
    .src('./src/images/**/*')
    .pipe(changed('./build/img/'))
    // .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest('./build/img/'));
});

gulp.task('js:dev', function () {
  return gulp
    .src('./src/js/*.js')
    .pipe(changed('./build/js/'))
    .pipe(plumber(notificationOptions))
    .pipe(webpack(require('./../webpack.config.js')))
    .pipe(gulp.dest('./build/js'));
});

gulp.task('server:dev', function () {
  return gulp.src('./build/').pipe(server(serverOptions));
});

gulp.task('clean:dev', function () {
  return gulp
    .src('./build', { allowEmpty: true, read: false })
    .pipe(clean());
});

gulp.task('watch:dev', function () {
  gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'));
  gulp.watch('./src/**/*.html', gulp.parallel('html:dev'));
  gulp.watch('./src/images/**/*', gulp.parallel('images:dev'));
  gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev'));
});
