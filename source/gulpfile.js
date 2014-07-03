/* jslint es3:false, node:true */
'use strict';

/**
 * Usage:
 *
 * $ cd source/
 * $ npm install
 * $ npm run default
 *
 * @see https://github.com/gulpjs/gulp/blob/master/docs/recipes/pass-params-from-cli.md
 */

// Hoisted declarations:
var gulp = require('gulp'),
    args = require('yargs').argv,
    gulpif = require('gulp-if'),
//    pkg = require('./package.json'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    preprocess = require('gulp-preprocess'),
//    rename = require('gulp-rename'),
//    template = require('gulp-template'),
    rimraf = require('gulp-rimraf'),
    notify = require('gulp-notify'),
//    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    isProduction = (args.type === 'production'),
    folder = (isProduction ? 'prod' : 'dev');
//    header = require('gulp-header'),
//    fs = require('fs'),
//    year = function() { return new Date().toISOString(); }, // yyyy/mm/dd
//    today = function() { return new Date().toISOString(); }; // yyyy

// Clean
gulp.task('clean', function() {
	
	return gulp.src([
		'../' + folder,
	], { read: false, })
		.pipe(rimraf({
			force: true,
		}));
	
});

// Styles
gulp.task('styles', ['clean',], function() {
	
	return gulp.src('./files/styles/evelyn.scss')
		.pipe(sass({
			precision : 14,
			style : 'expanded',
		}))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulpif(isProduction, minifycss()))
		.pipe(gulp.dest('../' + folder + '/styles'))
		.pipe(notify({ message: 'Styles task complete', }));
	
});

// Scripts
gulp.task('scripts', ['clean',], function() {
	
	return gulp.src([
		'./gulpfile.js',
	])
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(notify({ message: 'Scripts task complete', }));
	
});

// html
gulp.task('html', ['clean',], function() {
	
	return gulp.src([
		'./files/html/index.html',
	])
		.pipe(preprocess({context: {
			NODE_ENV: folder,
		},})) //To set environment variables in-line
		.pipe(gulp.dest('../' + folder + '/'))
		.pipe(notify({ message: 'HTML task complete', }));
	
});

// default gulp task
gulp.task('default', ['clean', 'styles', 'scripts', 'html',], function() {
	
	// Create LiveReload server
	var server = livereload();
	
	// watch for HTML changes
	gulp.watch('./files/html/**/*.html', [
		'html',
	]);
	
	// watch for CSS changes
	gulp.watch([
		'./files/styles/**/*.scss',
	], [
		'styles',
	]);
	
	// Watch any files in `folder/`, reload on change
	gulp.watch([
		'../dev/**',
		'../prod/**',
	]).on('change', function(file) {
		server.changed(file.path);
	});
	
});
