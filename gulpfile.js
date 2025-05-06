const gulp = require('gulp');
const babel = require('gulp-babel');
const validateHTML = require('gulp-validateHTML');
const validateCSS = require('gulp-validateCSS');
const validateJS = require('gulp-validateJS');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const compressHTML = require('gulp-compressHTML');
const compressCSS = require('gulp-compressCSS');
const compressJS = require('gulp-compressJS');
const stylelintrc = require('gulp-stylelintrc');
const eslintrc = require('gulp-eslintrc');

gulp.task('validateHTML', function() {
    return gulp.src('src/**/*.html')
      .pipe(validateHTML())
      .pipe(validateHTML.reporter());
});

gulp.task('compressHTML', function() {
    return gulp.src('src/**/*.html')
      .pipe(compressHTML({ collapseWhitespace: true }))
      .pipe(gulp.dest('prod'));
});

gulp.task('validateCSS', function() {
    return gulp.src('src/scss/**/*.scss')
      .pipe(stylelintrc({
        reporters: [
          { formatter: 'string', console: true }
        ]
    }));
});

gulp.task('compressCSS', function() {
    return gulp.src('src/scss/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(compressCSS())
      .pipe(gulp.dest('prod/css'));
});

gulp.task('validateJS', function() {
    return gulp.src('src/js/**/*.js')
      .pipe(eslint())
      .pipe(eslintrc.format())
      .pipe(eslintrc.failAfterError());
});

gulp.task('compressJS', function() {
    return gulp.src('src/js/**/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('prod/js'));
});

gulp.task('transpileJSForDev', function() {
    return gulp.src('src/js/**/*.js')
      .pipe(babel({
        presets: ['@babel/preset-env']
      }))
      .pipe(gulp.dest('prod/js'));
  });

gulp.task('build', gulp.series(
    'validateHTML',
    'compressHTML',
    'validateCSS',
    'compressCSS',
    'validateJS',
    'compressJS',
    'transpileJSForDev',
    'transpileJSForProd',
));

