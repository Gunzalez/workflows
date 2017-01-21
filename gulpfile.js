var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat');

var coffeeScripts = ['components/coffee/tagline.coffee'];

var jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];

var sassSources = [
    'components/sass/styles.scss'
];

gulp.task('coffee', function () {
    gulp.src(coffeeScripts)
        .pipe(coffee({ bare: true })
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function () {
    gulp.src(jsSources)
        .pipe(concat('scripts.js'))
        .pipe(browserify())
        .pipe(gulp.dest('builds/development/js'))

});

gulp.task('compass', function () {
    gulp.src(sassSources)
        .pipe(compass({
            css: 'builds/development/css',
            sass:'components/sass',
            image:'builds/development/images',
            style:'expanded'
        }))
    .on('error', gutil.log)
    .pipe(gulp.dest('builds/development/css'))
});

