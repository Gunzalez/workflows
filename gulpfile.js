var gulp = require('gulp'),
    gutil = require('gulp-util'),               // Writing comments to screen such as errors
    coffee = require('gulp-coffee'),            // compiling coffee
    browserify = require('gulp-browserify'),    // Pull in library as dependencies, eg jquery
    compass = require('gulp-compass'),          // Pulling in SCSS library, like magic, TODO
    connect = require('gulp-connect'),          // Creates server, does auto reload
    gulpif = require('gulp-if'),                // To fork program flow depending on variables
    uglify = require('gulp-uglify'),            // To shrink js files to smallest possible size
    minifyHTML = require('gulp-minify-html'),   // For squeezing out all the white spaces in HTML files
    concat = require('gulp-concat');            // Joins many small js files into one long one

var env,
    coffeeSources,
    htmlSources,
    sassSources,
    jsonSources,
    jsSources,
    outPutDir,
    sassStyle;


// setting environment variables
env = process.env.NODE_ENV || 'development';
if (env === 'development'){
    outPutDir = 'builds/development';
    sassStyle = 'expanded';
} else {
    outPutDir = 'builds/production';
    sassStyle = 'compressed';
}



// Assigning variables names, easier to manipulate
coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];
sassSources = ['components/sass/style.scss'];
htmlSources = [outPutDir + '/*.html'];
jsonSources = [outPutDir + '/js/*.json'];




// coffee compilation
gulp.task('coffee', function () {
    gulp.src(coffeeSources)
        .pipe(coffee({ bare: true })
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
});



// join them up,
// pull in libraries if needed,
// if production then make it ugly,
// put into appropriate folder
// do a page reload, push from server
gulp.task('js', function () {
    gulp.src(jsSources)
        .pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(gulpif( env === 'production', uglify()))
        .pipe(gulp.dest(outPutDir + '/js'))
        .pipe(connect.reload())
});



// uses compass to create Expanded or Compressed css
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



// a bunch onf tasks being watched, gulp feature
gulp.task('watch', function () {
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch('builds/development/*.html', ['html']);
    gulp.watch(jsonSources, ['json']);
});



// minifying HTML,
// putting into correct folder
// server forces page reload
gulp.task('html', function () {
    gulp.src('builds/development/*.html')
        .pipe(gulpif( env === 'production', minifyHTML()))
        .pipe(gulpif( env === 'production', gulp.dest(outPutDir)))
        .pipe(connect.reload())
});



// watch json file, do a reload
gulp.task('json', function () {
    gulp.src(jsonSources)
        .pipe(connect.reload())
});



// actual server page reload plugin
gulp.task('connect', function () {
   connect.server({
       root: outPutDir + '/',
       livereload: true
   })
});


// just a sequence of tasks, set to the default task
gulp.task('default', ['coffee', 'html', 'json', 'js', 'compass', 'connect', 'watch']);

