var gulp = require('gulp');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

var files = 'src/**/*.js';
var outfile = 'starengine.js';
var outfile_min = 'starengine.min.js';

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

// Watch Dev
gulp.task('dev', function() {
    gulp.start('lint', 'build-dev');
    gulp.watch(files, ['lint', 'build-dev']);
});

// Build Dist
gulp.task('build-dist', function() {
    gulp.src(files)
        .pipe(concat('./'))
        .pipe(rename(outfile_min))
        .pipe(uglify())
        .pipe(gulp.dest('./'));
});

gulp.task('dist', ['lint', 'build-dist']);

gulp.task('watch-dist', function() {
    gulp.start('dist');
    gulp.watch(files, ['dist']);
});

gulp.task('default', ['lint', 'dist']);
