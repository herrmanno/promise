var gulp = require('gulp');
var del = require('delete');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var typescript = require('gulp-typescript');
var sourcemap = require('gulp-sourcemaps');
var concat = require('gulp-concat');


var src = {
    ts: ['src/**/*.ts'],
};

var name = 'ho-promise';

var dist = 'dist';

var entry = 'promise.js';


gulp.task('clean', function() {
    del.sync(dist);
});

/*
gulp.task('package', ['clean'], function() {
    return gulp.src('src/ts/promise.ts')
    .pipe(sourcemap.init())
    .pipe(typescript({
        out: entry
    }))
    .pipe(sourcemap.write())
    .pipe(gulp.dest(dist));
});
*/

var tsProject = typescript.createProject('gulp-tsconfig.json');
gulp.task('package', ['clean'], function() {
    var tsResult = tsProject.src()
        .pipe(sourcemap.init())
        .pipe(typescript(tsProject));

  return tsResult.js
        .pipe(concat(entry)) // You can use other plugins that also support gulp-sourcemaps
        .pipe(sourcemap.write()) // Now the sourcemaps are added to the .js file
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


gulp.task('def', ['mini'], function() {
    var ts = gulp.src(src.ts)
    .pipe(typescript({
        out: entry,
        declarationFiles: true
    }));
    return ts.dts.pipe(gulp.dest(dist));
});



gulp.task('default', ['mini', 'def'], null);
