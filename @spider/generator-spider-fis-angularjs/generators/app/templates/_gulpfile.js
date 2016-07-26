var gulp = require('gulp');
var jsdoc = require('gulp-jsdoc');
var webserver = require('gulp-webserver');

var config = {
  host: '<%= appHost %>',
  docName: '<%= appAlias %>开发文档'
};

gulp.task('docs', function () {
  return gulp.src(['./app/modules/**/*.js', './README.md']).pipe(jsdoc('./docs', {
    path: 'node_modules/jaguarjs-jsdoc',
    anyTemplateSpecificParameter: 'whatever',
    applicationName: config.docName,
    linenums: true,
    meta: {
        title: config.docName
    }
  }));
});

gulp.task('live', ['docs'], function(){
  gulp.src('live')
    .pipe(webserver({
      host: config.host,
      port: 6030,
      path: '/',
      open: true,
      fallback: 'index.html'
    }));

  gulp.src('docs')
    .pipe(webserver({
      host: config.host,
      port: 6040,
      path: '/',
      open: true,
      fallback: 'index.html'
    }));
});

gulp.task('watch', function(){
  gulp.watch(['app/**', './README.md'], ['docs']);
});

gulp.task('dev', ['live', 'watch']);