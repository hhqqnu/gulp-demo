'use strict';
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    runSequence = require('run-sequence'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace');

var browserSync = require('browser-sync').create();

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
});


gulp.task('sass', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('useref', function () {
    return gulp.src('src/**/*.html')
        .pipe(useref()) 
        .pipe(gulpIf('*.js',rev()))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css',rev()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(revReplace())
        .pipe(gulp.dest('dist'))
});

gulp.task('clean', function () {
    return del.sync('dist');
});


gulp.task('watch', ['browserSync', 'sass'], function () {
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/**/*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
});


gulp.task('build', function (callback) {
    runSequence('clean', ['sass', 'useref'], callback);
});

gulp.task('default', function (callback) {
    runSequence(['sass', 'browserSync', 'watch'], callback);
});