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

// Build Dev
gulp.task('build-dev', function() {
    gulp.src(files)
        .pipe(concat('./'))
        .pipe(rename(outfile))
        .pipe(gulp.dest('./'));
});

gulp.task('dev', function() {
    gulp.run('lint', 'build-dev');
    gulp.watch(files, function(evt) {
        gulp.run('lint', 'build-dev');
    });
});

// Build
gulp.task('dist', function() {
    gulp.src(files)
        .pipe(concat('./'))
        .pipe(rename(outfile))
        .pipe(uglify())
        .pipe(gulp.dest('./'));
});

gulp.task('default', function() {
    gulp.run('lint', 'dist');
    gulp.watch(files, function(evt) {
        gulp.run('lint', 'dist');
    });
});
