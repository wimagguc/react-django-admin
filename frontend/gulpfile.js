var gulp = require("gulp");
var watch = require('gulp-watch');

var sourcemaps = require("gulp-sourcemaps");
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');

var babel = require("gulp-babel");

gulp.task('watch', function () {
    gulp.watch(['js/config.js', 'js/app.js'], ['app']);
    gulp.watch('src/js/**/*.js', ['app']);
    gulp.watch('src/templates/**/*.jsx', ['templates']);
});

gulp.task("app", function () {
    return gulp.src(['js/config.js', 'src/js/**/*.js', 'js/app.js'])
      .pipe(sourcemaps.init())
      .pipe(concat("app.js"))
      .pipe(uglify())
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("build"));
});

gulp.task("templates", function () {
    // Compile Facebook React's jsx files and concatenate them into one, minified js
    return gulp.src("src/templates/**/*.jsx")
      .pipe(sourcemaps.init())
      .pipe(babel({
          presets: ['es2015', 'react']
      }))
      .pipe(concat("views.js"))
      .pipe(uglify())
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("build"));
});
