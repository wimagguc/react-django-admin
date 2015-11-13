var gulp = require("gulp");
var watch = require('gulp-watch');

var sourcemaps = require("gulp-sourcemaps");
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');

var babel = require("gulp-babel");

gulp.task('watch', function () {
  gulp.watch('src/**/*.jsx', ['default']);
});

gulp.task("default", function () {
  // Compile Facebook React's jsx files and concatenate them into one, minified js
  return gulp.src("src/**/*.jsx")
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['es2015', 'react']
    }))
    .pipe(concat("views.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("build"));
});
