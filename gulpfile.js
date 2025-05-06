const gulp = require('gulp');
const babel = require('gulp-babel');
const htmlhint = require('gulp-htmlhint');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const csslint = require('gulp-csslint');
const cleanCSS = require('gulp-clean-css')
const eslint = require('gulp-eslint');

const paths = {
    html: 'src/**/*.html',
    css: 'src/**/*.css',
    js: 'src/**/*.js',
    dest: 'prod/'
};

gulp.task('validateHTML', () =>
    gulp.src(paths.html)
        .pipe(htmlhint())
        .pipe(htmlhint.reporter())
);

gulp.task('compressHTML', () =>
    gulp.src(paths.html)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.dest))
);

gulp.task('validateCSS', () =>
    gulp.src(paths.css)
        .pipe(csslint())
        .pipe(csslint.formatter())
);

gulp.task('compress-css', () =>
    gulp.src(paths.css)
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.dest))
);


gulp.task('validateJS', function() {
    return gulp.src('src/js/**/*.js')
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
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

gulp.task('prod', gulp.series(
    gulp.parallel('validateHTML', 'validateCSS', 'validateJS'),
    gulp.parallel('compressHTML', 'compressCSS', 'compressJS', 'transpileJSForDev')
));
