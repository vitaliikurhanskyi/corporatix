var gulp = require('gulp'),
	useref = require('gulp-useref'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifyCss = require('gulp-minify-css'),
	clean = require('gulp-clean'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	autoprefixer = require('gulp-autoprefixer'),
	uncss = require('gulp-uncss'),
	concatCss = require('gulp-concat-css'),
	compass = require('gulp-compass'),
	browserSync = require("browser-sync").create();

//sass = require('gulp-ruby-sass'),
/* build */

gulp.task('clean', function () {
	return gulp.src('dis', {read: false})
		.pipe(clean());
});

gulp.task('build', ['clean'], function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', autoprefixer({
			browsers: ['last 30 versions'],
			cascade: false
		})))
        .pipe(gulpif('', uncss({
        	csspath: ['app/css/*.css'],
        })))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dis'));
});

/* end build */

/* image-min */

gulp.task('images', () => {
	return gulp.src('app/images/*')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('dis/images'));
});

/* end image-min */

/* browserSync */

gulp.task('serve', ['compass'], function() {

	browserSync.init({
		proxy: "corporatix.loc/www/app"
	});

	gulp.watch("app/sass/*.scss", ['compass']);
	gulp.watch("app/*.html").on('change', browserSync.reload);
});

/* end browserSync */

/* end gulp-ruby-sass */

gulp.task('compass', function() {
  gulp.src('app/sass/*.scss')
    .pipe(compass({
      config_file: './config.rb',
      css: './app/css',
      sass: './app/sass'
    }))
    .pipe(gulp.dest('./app/css'))
    .pipe(browserSync.stream());
});



/* Fonts */

gulp.task('fonts', function() {
	return gulp.src('./app/fonts/*')
	.pipe(gulp.dest('dis/fonts'));
});

/* end Fonts */



gulp.task('default', ['serve']);
gulp.task('dis', ['images', 'fonts', 'build']);

