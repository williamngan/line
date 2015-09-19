var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var insert = require('gulp-insert');
var es = require('event-stream');
var babel = require('gulp-babel');

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



// To rebuild all in sequence:
// 1) "build",
// 2) "namespace" to add namespace versions,
// 3) "module" to add npm module.exports versions,
// 4) "min" to create minified version



// Define class sequence manually. To be modularize later.
// Parent classes needs to be defined before its extended children
var coreElems = [];
var coreFiles = coreElems.map(function(n) { return path.dist.js+n+".js"; } );


function handleError( error ) {
  gutil.log( error.stack );
  this.emit( 'end' );
}

gulp.task('default', ["watch"]);


// Watch
// This just rebuild the pt-core.js and pt-extend.js files without doing the full re-build.
gulp.task('watch', function() {
  gulp.watch( path.src.js+"*.js", ['es6']);
});

// ES6 Babel
gulp.task('es6', function () {
    return gulp.src( path.src.js+"*.js" )
        .pipe(babel()).on('error', handleError)
        .pipe(gulp.dest( path.dist.js ));
});
