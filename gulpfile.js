var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var insert = require('gulp-insert');
var es = require('event-stream');
var babel = require('gulp-babel');

/*
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
*/

// Define Paths
var path = {
  src: {
    js: "./src/js/",
    css: "./src/css/"
  },
  dist: {
    js: "./dist/js/",
    css: "./dist/css/",
    path: "./dist/"
  }
};


// Define class sequence manually. To be modularize later.
// Parent classes needs to be defined before its extended children
var coreElems = [
  "SegmentList", "MovingLineForm", "BaseLine", "DottedLine",
  "SpeedLine", "SpeedBrush", "SmoothSpeedBrush",
  "WiggleLine", "NoiseLine", "SmoothNoiseLine",
    "ContinuousLine", "StepperLine", "ReflectLine", "WalkSteps"
];
var coreFiles = coreElems.map(function(n) { return path.src.js+"lines/"+n+".js"; } );


function handleError( error ) {
  gutil.log( error.stack );
  this.emit( 'end' );
}


gulp.task('default', ["watch"]);

// Watch
// This just rebuild the pt-core.js and pt-extend.js files without doing the full re-build.
gulp.task('watch', function() {
  gulp.watch( path.src.js+"/*.js", ['es6']);
  gulp.watch( path.src.js+"**/*.js", ['lines']);
});

// ES6 Babel
gulp.task('es6', function () {
    return gulp.src( path.src.js+"*.js" )
        .pipe(babel({ modules: "common"})).on('error', handleError)
        .pipe(gulp.dest( path.dist.js ));
});


gulp.task('lines', function() {
  return gulp.src( coreFiles )
    .pipe( concat('lines.js') )
    .pipe(babel({ modules: "common"})).on('error', handleError)
    .pipe( gulp.dest( path.dist.js+"lines" ) )
});