var gulp       = require('gulp');
var jsdoc = require('gulp-jsdoc');
var webserver  = require('gulp-webserver');

var config = {
  host: '10.10.7.105',
  docName: 'inkey.js交互文档'
};


gulp.task('docs', function () {
  return gulp.src(['./lib/**/*.js', './README.md']).pipe(jsdoc('./docs', {
    path: 'node_modules/jaguarjs-jsdoc',
    anyTemplateSpecificParameter: 'whatever',
    applicationName: config.docName,
    linenums: true,
    meta: {
      title: config.docName
    }
  }));
});

gulp.task('live', function(){
  gulp.src('live')
    .pipe(webserver({
      host: config.host,
      port: 6030,
      path: '/',
      open: false
    }));

  gulp.src('docs')
    .pipe(webserver({
      host: config.host,
      port: 6040,
      path: '/',
      open: false
    }));
});

gulp.task('watch', function(){
  gulp.watch(['lib/**', './README.md'], ['docs']);
});

gulp.task('dev', ['docs', 'live', 'watch']);

