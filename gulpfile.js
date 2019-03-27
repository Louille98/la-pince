var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var cssnano = require('gulp-cssnano');
var del = require('del');
var useref = require('gulp-useref');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');


gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

gulp.task('sass', function () {
  return gulp.src('app/sass/**/*.sass')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('watch', ['browserSync'], function () {
  gulp.watch('app/sass/**/*.sass', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(imagemin({
      // Setting interlaced to true
      interlaced: true
    }))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('useref', function () {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('minify', function () {
  return gulp.src('app/css/*.css')
    .pipe(cssnano())
    .pipe(gulp.dest('app/css'))

})

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('build', [`clean:dist`, `sass`, `images`, `useref`], function () {
  console.log('Building files');
})