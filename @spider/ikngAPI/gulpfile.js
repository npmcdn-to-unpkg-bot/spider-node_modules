var gulp = require('gulp');
var webserver = require('gulp-webserver');
var karmaServer = require('karma').Server;

var config = {
  host: 'localhost'
};

gulp.task('live', function(){
  gulp.src('live')
    .pipe(webserver({
      host: config.host,
      port: 6030,
      path: '/',
      open: false,
      fallback: 'index.html'
    }));
});

gulp.task('test', function(done){
  new karmaServer({
    configFile: __dirname + '/karma.config.js',

    // 是否只跑一次单元测试

    singleRun: false
  }, done).start();
});

gulp.task('dev', ['live', 'test']);