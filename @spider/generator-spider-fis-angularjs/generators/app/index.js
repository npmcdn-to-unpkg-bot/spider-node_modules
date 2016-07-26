'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var util = require('util');
var mkdirp = require('mkdirp');
var path = require('path');

var Generator = module.exports = function Generator(args, options){
  yeoman.generators.Base.apply(this, arguments);

  // Have Yeoman greet the user.
  this.log(yosay(
    '欢迎来到spider'
  ));

};

util.inherits(Generator, yeoman.generators.Base);

var _pt_ = Generator.prototype;

_pt_.askFor = function askFor(){
    var done = this.async();

    var prompts = [
      {
        type: 'input',
        name: 'appname',
        message: '请输入项目名(将创建目录)',
        default: this.appname
      },
      {
        type: 'input',
        name: 'appAlias',
        message: '请输入项目别名(显示在导航条与页面标题，可以中文)'
      },
      {
        type: 'input',
        name: 'appDesc',
        message: '请输入项目描述(别偷懒)'
      },
      {
        type: 'input',
        name: 'appHost',
        message: '请输入当前主机host(用于配置项目服务器)',
        default: 'localhost'
      },
      {
        type: 'input',
        name: 'appShareTitle',
        message: '请输入项目的分享标题'
      },
      {
        type: 'input',
        name: 'appShareDesc',
        message: '请输入项目的分享描述'
      }
    ];

    this.prompt(prompts, function (props) {
      this.appname = props.appname;
      this.appAlias = props.appAlias;
      this.appDesc = props.appDesc;
      this.appHost = props.appHost;
      this.appShareTitle = props.appShareTitle;
      this.appShareDesc = props.appShareDesc;

      done();
    }.bind(this));
};

_pt_.writing = function writing(){
  var appname = this.appname;
  var join = path.join;

  mkdirp(join(appname, 'trunk'));
  mkdirp(join(appname, 'branches'));
  mkdirp(join(appname, 'tags'));

  appname = join(appname, 'trunk');

  
  this.bulkDirectory('comm', join(appname, 'app'));

  this.fs.copy(
    this.templatePath('_README.md'),
    this.destinationPath(join(appname, 'README.md'))
  );

  this.fs.copyTpl(
    this.templatePath('_package.json'),
    this.destinationPath(join(appname, 'package.json')),
    { appname: this.appname, appDesc: this.appDesc }
  );

  this.fs.copyTpl(
    this.templatePath('_gulpfile.js'),
    this.destinationPath(join(appname, 'gulpfile.js')),
    { appHost: this.appHost, appAlias: this.appAlias }
  );

  this.fs.copyTpl(
    this.templatePath('_fis-conf.js'),
    this.destinationPath(join(appname, 'app/fis-conf.js')),
    { appname: this.appname }
  );

  this.fs.copyTpl(
    this.templatePath('_appConfig.js'),
    this.destinationPath(join(appname, 'app/modules/config.js')),
    { appAlias: this.appAlias, appShareTitle: this.appShareTitle, appShareDesc: this.appShareDesc }
  );

  // 创建默认路由

  // 创建路由文件夹

  var routeDir = join(appname, 'app/modules/pages/index');

  mkdirp(join(routeDir, 'imgs'));

  this.fs.copyTpl(
    this.templatePath('route/index.html'),
    this.destinationPath(join(routeDir, 'index.html')),
    { className: 'index' }
  );

  this.fs.copyTpl(
    this.templatePath('route/index.styl'),
    this.destinationPath(join(routeDir, 'index.styl')),
    { className: 'index' }
  );

  this.fs.copyTpl(
    this.templatePath('route/index.js'),
    this.destinationPath(join(routeDir, 'index.js')),
    { routeUrl: '/index', routePageName: '首页' }
  );
};

_pt_.install = function writing(){
  var appname = path.join(this.appname, 'trunk');

  // 进入APP目录安装相关依赖
  process.chdir(appname);

  this.npmInstall('', function() {
    // 进入APP目录编译项目
    process.chdir('app');
    this.spawnCommandSync('fis3',['release']);
    // 返回上一级 运行服务器
    process.chdir('../');
    this.spawnCommandSync('gulp',['dev']);
  }.bind(this));
};
