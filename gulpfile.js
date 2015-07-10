var gulp = require('gulp');
var del = require('del');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var git = require('gulp-git');
var argv = require('yargs').argv;

var src = ['promise'].map(function(f) {return './src/'+f+'.js';});

var bundle = 'promise.js';
var bundlemin = bundle.substr(0, bundle.length-2)+'min.js';

var dest = './';
var delFiles = [bundle, bundlemin].map(function(f) {return dest+f;});



gulp.task('clean', function (cb) {
  del(delFiles, cb);
});

gulp.task('bundle', ['clean'], function() {
	return gulp.src(src)
		.pipe(gulp.dest(dest));
});

gulp.task('bundle-min', ['bundle'], function() {
	return gulp.src(dest+bundle)
		.pipe(uglify())
		.pipe(rename(bundlemin))
		.pipe(gulp.dest(dest));
});

gulp.task('watch', function() {
  gulp.watch(src, ['bundle-min']);
});

//git tasks

gulp.task('addAll', function() {
    return gulp.src('.')
        .pipe(git.add());
});

gulp.task('commit', ['addAll'], function() {
    var msg = argv.m;
    if(!msg)
        throw "Commit message must be provided via --m";

    return gulp.src(src)
        .pipe(git.commit(msg));
});

gulp.task('publish', ['commit'], function() {
    git.push('origin', 'master', function (err) {
        if (err) throw err;
    });
});

gulp.task('default', ['watch', 'bundle', 'bundle-min'], function() {
	return void 0;
});
