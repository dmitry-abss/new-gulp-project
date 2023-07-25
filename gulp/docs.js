const gulp = require('gulp');

//  HTML
const fileInclude = require('gulp-file-include');
const htmlclean = require('gulp-htmlclean');
const webpHtml = require('gulp-webp-html');

// SASS
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');

// IMAGES
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');

const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const sourceMaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
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

gulp.task('html:docs', function () {
  return gulp
    .src('./src/*.html')
    .pipe(changed('./docs/'))
    .pipe(fileInclude(fileIncludeSettings))
    .pipe(webpHtml())
    .pipe(htmlclean())
    .pipe(gulp.dest('./docs/'));
});

gulp.task('sass:docs', function () {
  return gulp
    .src('./src/scss/*.scss')
    .pipe(changed('./docs/css/'))
    .pipe(plumber(notificationOptions))
    .pipe(sourceMaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(sourceMaps.write('.'))
    .pipe(gulp.dest('./docs/css/'));
});

gulp.task('images:docs', function () {
  return gulp
    .src('./src/images/**/*')
    .pipe(changed('./docs/img/'))
    .pipe(webp())
    .pipe(gulp.dest('./docs/img/'))
    .pipe(gulp.src('./src/images/**/*'))
    .pipe(changed('./docs/img/'))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest('./docs/img/'));
});

gulp.task('js:docs', function () {
  return gulp
    .src('./src/js/*.js')
    .pipe(changed('./docs/js/'))
    .pipe(webpack(require('../webpack.config.js')))
    .pipe(babel())
    .pipe(gulp.dest('./docs/js'))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(plumber(notificationOptions))
    .pipe(gulp.dest('./docs/js'));
});

gulp.task('server:docs', function () {
  return gulp.src('./docs/').pipe(server(serverOptions));
});

gulp.task('clean:docs', function () {
  return gulp
    .src('./docs', { allowEmpty: true, read: false })
    .pipe(clean());
});

gulp.task('watch:docs', function () {
  gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:docs'));
  gulp.watch('./src/**/*.html', gulp.parallel('html:docs'));
  gulp.watch('./src/images/**/*', gulp.parallel('images:docs'));
  gulp.watch('./src/js/**/*.js', gulp.parallel('js:docs'));
});
