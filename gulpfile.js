var gulp = require('gulp');
var del = require('del');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jsdoc = require('gulp-jsdoc');
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

gulp.task('doc', ['bundle-min'], function() {
	return gulp.src(dest+bundlemin)
		.pipe(jsdoc('doc'));
});

gulp.task('watch', function() {
  gulp.watch(src, ['bundle-min']);
});


gulp.task('default', ['doc'], function() {
	return void 0;
});
