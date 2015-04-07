/* jslint es3:false, node:true */
'use strict';

/**
 * Usage:
 *
 * $ cd source/
 * $ npm install
 * $ npm run dev
 * $ npm run prod
 */

/*----------------------------------( PLUGINS )----------------------------------*/

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var args = require('yargs').argv;
var del = require('del');
var jshint = require('gulp-jshint');
var preprocess = require('gulp-preprocess');
var sass = require('gulp-sass');
var header = require('gulp-header');
var _ = require('lodash');
var fs = require('fs');
var pkg = require('./package.json');
var date = require('dateformat');

/*----------------------------------( BUILD? )----------------------------------*/

var build = (args.type === 'production');
var target = (build ? 'prod' : 'dev');

/*----------------------------------( CLEAN )----------------------------------*/

gulp.task('clean', function(cb) {
	
	del([ '../dev', ], { force: true, }, cb);
	
});

/*----------------------------------( STYLES )----------------------------------*/

gulp.task('styles', ['clean',], function() {
	
	return gulp.src('./files/styles/test.scss')
		.pipe(sass({
			precision : 14,
			style : (build ? 'expanded' : 'compressed'),
		}))
		.pipe(header(fs.readFileSync('./files/text/banner_long.txt', 'utf8'), {
			pkg : pkg,
			_: _,
			date: date,
		}))
		.pipe(gulp.dest('../' + target + '/styles/'));
	
});

/*----------------------------------( SCRIPTS )----------------------------------*/

gulp.task('scripts', ['clean',], function() {
	
	return gulp.src([
		'./gulpfile.js',
	])
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'));
	
});

/*----------------------------------( HTML )----------------------------------*/

gulp.task('html', ['clean',], function() {
	
	return gulp.src([
		'./files/html/index.html',
	])
		.pipe(preprocess({context: {
			NODE_ENV: target,
		},}))
		.pipe(gulp.dest('../' + target));
	
});

/*----------------------------------( WATCH )----------------------------------*/

gulp.task('watch', function() {
	
	gulp.watch(['./files/styles/**/*.scss',], ['styles',]);
	
	gulp.watch(['./gulpfile.js',], ['scripts', 'styles',]);
	
	gulp.watch('./files/html/**/*.html', ['html',]);
	
});

/*----------------------------------( DEFAULT )----------------------------------*/

gulp.task('default', ['watch', 'styles', 'scripts', 'html',]);
