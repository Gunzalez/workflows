var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee');

var coffeeScripts = ['components/coffee/tagline.coffee'];

gulp.task('coffee', function () {
    gulp.src(coffeeScripts)
        .pipe(coffee({ bare: true })
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
});