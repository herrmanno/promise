var gulp = require('gulp');
var del = require('delete');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var webpack = require('gulp-webpack');


var src = {
    ts: ['src/ts/**/*.ts'],
    js: ['src/js/**/*.js']
}

var name = 'ho-promise'

var dist = 'dist';

var entry = 'promise.js';


gulp.task('clean', function() {
    del.sync(dist);
})

gulp.task('package', ['clean'], function() {
    return gulp.src('src/js/' + entry)
    .pipe(webpack({
        output: {
            filename: entry
        }
    }))
    .pipe(gulp.dest(dist));
});


gulp.task('mini', ['package'], function() {
    return gulp.src(dist + '/' + entry)
    .pipe(uglify())
    .pipe(rename({
        extname: '.min.js'
    }))
    .pipe(gulp.dest(dist));
});

gulp.task('def', function() {
    return gulp.src('src/js/**/*.d.ts')
    .pipe(gulp.dest(dist + '/d.ts'));
});


gulp.task('default', ['mini', 'def'], null);
