var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

var files = 'src/**/*.js';
var outfile = 'starengine.min.js'

// Check sintaxe
gulp.task('lint', function() {
    gulp.src(files)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Build
gulp.task('dist', function() {
    gulp.src(files)
        .pipe(concat('./build'))
        .pipe(rename(outfile))
        .pipe(uglify())
        .pipe(gulp.dest('./build'));
});

gulp.task('default', function() {
    gulp.run('lint', 'dist');
    gulp.watch(files, function(evt) {
        gulp.run('lint', 'dist');
    });
});
