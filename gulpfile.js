var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var exec = require('child_process').exec;

gulp.task("build", function () {
   return tsProject.src()
      .pipe(tsProject())
      .js.pipe(gulp.dest("dist"));

});

gulp.task('move', function () {
   gulp.src('./src/icons/**')
      .pipe(gulp.dest('./dist/icons'));
});

gulp.task('watch', function () {
   gulp.watch("src/**/*.ts", ['build', 'move']);
});

gulp.task("start", function () {
   // exec('electron dist/')
});

gulp.task("restart", function () {
   gulp.watch(["src/**/*.ts"], function () {
      // exec('electron dist/')
   });
});

gulp.task('default', ['build', 'move', 'watch', 'start', "restart"]);