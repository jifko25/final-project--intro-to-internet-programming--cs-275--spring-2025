const gulp = require('gulp');
const babel = require('gulp-babel');
const htmlhint = require('gulp-htmlhint');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const csslint = require('gulp-csslint');
const cleanCSS = require('gulp-clean-css')
const eslint = require('gulp-eslint');
const browserSync = require('browser-sync').create();

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

gulp.task('compressCSS', () =>
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

gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: paths.dest
        },
        port: 3000,
        open: true
    });

    // Watch and rebuild
    gulp.watch(paths.html, gulp.series('compressHTML')).on('change', browserSync.reload);
    gulp.watch(paths.css, gulp.series('compressCSS')).on('change', browserSync.reload);
    gulp.watch(paths.js, gulp.series('transpileJSForDev')).on('change', browserSync.reload);
});

gulp.task('transpileJSForDev', function() {
    return gulp.src('src/js/**/*.js')
      .pipe(babel({
        presets: ['@babel/preset-env']
      }))
      .pipe(gulp.dest('prod/js'));
  });

gulp.task('transpileJSForProd', gulp.series(
    'validateHTML',
    'compressHTML',
    'validateCSS',
    'compressCSS',
    'validateJS',
    'compressJS',
    'transpileJSForDev',
    'browser-sync',
    'default',
    'serve',
    'transpileJSForProd'

));

gulp.task('default', gulp.series('transpileJSForProd', 'serve'));
