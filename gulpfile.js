var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

var env,
    coffeeSources,
    htmlSources,
    sassSources,
    jsonSources,
    jsSources,
    outPutDir,
    sassStyle;


env = process.env.NODE_ENV || 'development';

if (env === 'development'){
    outPutDir = 'builds/development';
    sassStyle = 'expanded';
} else {
    outPutDir = 'builds/production';
    sassStyle = 'compressed';
}

coffeeSources = ['components/coffee/tagline.coffee'];
sassSources = ['components/sass/style.scss'];
htmlSources = [outPutDir + '/*.html'];
jsonSources = [outPutDir + '/js/*.json'];
jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];


gulp.task('coffee', function () {
    gulp.src(coffeeSources)
        .pipe(coffee({ bare: true })
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function () {
    gulp.src(jsSources)
        .pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(gulpif( env === 'production', uglify()))
        .pipe(gulp.dest(outPutDir + '/js'))
        .pipe(connect.reload())
});

gulp.task('compass', function () {
    gulp.src(sassSources)
        .pipe(compass({
            css: outPutDir + '/css',
            sass:'components/sass',
            image:outPutDir + '/images',
            style: sassStyle
        }))
    .on('error', gutil.log)
    .pipe(gulp.dest(outPutDir + '/css'))
        .pipe(connect.reload())
});

gulp.task('watch', function () {
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch(htmlSources, ['html']);
    gulp.watch(jsonSources, ['json']);
    gulp.watch('components/sass/*.scss', ['compass']);
});

gulp.task('html', function () {
    gulp.src(htmlSources)
        .pipe(connect.reload())
});

gulp.task('json', function () {
    gulp.src(jsonSources)
        .pipe(connect.reload())
});


gulp.task('connect', function () {
   connect.server({
       root: outPutDir + '/',
       livereload: true
   })
});

gulp.task('default', ['coffee', 'html', 'json', 'js', 'compass', 'connect', 'watch']);

