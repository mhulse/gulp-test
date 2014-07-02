/* jslint es3:false, node:true */
'use strict';

/**
 * Usage:
 *
 * $ cd source/
 * $ npm install
 * $ npm run default
 */

// Load plugins
var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	rename = require('gulp-rename'),
	rimraf = require('gulp-rimraf'),
	notify = require('gulp-notify'),
	livereload = require('gulp-livereload'); 

// Styles
gulp.task('styles', function() {
	
	return gulp.src('./files/styles/evelyn.scss')
		.pipe(sass({
			precision : 14,
			style : 'expanded',
		}))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('../dev/styles'))
		.pipe(rename({ suffix: '.min', }))
		.pipe(minifycss())
		.pipe(gulp.dest('../dev/styles'))
		.pipe(notify({ message: 'Styles task complete', }));
	
});

// Scripts
gulp.task('scripts', function() {
	
	return gulp.src([
		'gulpfile.js',
		'scripts/**/*.js',
	])
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(notify({ message: 'Scripts task complete', }));
	
});

// Clean
gulp.task('rimraf', function() {
	
	return gulp.src([
		'../dev/styles',
	], { read: false, })
		.pipe(rimraf({
			force: true,
		}));
	
});

// default gulp task
gulp.task('default', ['rimraf', 'styles', 'scripts'], function() {
	// Create LiveReload server
	var server = livereload();
	// watch for JS changes
	gulp.watch('./gulpfile.js', ['scripts']);
	// watch for CSS changes
	gulp.watch('./files/styles/evelyn.scss', [
		'styles',
	]);
	// Watch any files in dev/, reload on change
	gulp.watch([
		'../dev/**',
	]).on('change', function(file) {
		server.changed(file.path);
	});
});
