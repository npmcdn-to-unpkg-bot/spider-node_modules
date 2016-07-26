'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var util = require('util');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var wiring = require("html-wiring");

var Generator = module.exports = function Generator(args, options){
  yeoman.generators.Base.apply(this, arguments);

  // Have Yeoman greet the user.
  this.log(yosay(
    '欢迎来到spider'
  ));

  this.sourceRoot(path.join(__dirname, '../app/templates/route'));
};

util.inherits(Generator, yeoman.generators.Base);

var _pt_ = Generator.prototype;

_pt_.askFor = function askFor(){
    var done = this.async();

    var prompts = [
      {
        type: 'input',
        name: 'routeState',
        message: '请输入路由状态名(例: user.set)'
      },
      {
        type: 'input',
        name: 'routeDir',
        message: '请输入创建路径(基于pages文件夹, 例: user/set)'
      },
      {
        type: 'input',
        name: 'routeUrl',
        message: '请输入路由url(例: /user/set)'
      },
      {
        type: 'input',
        name: 'routePageName',
        message: '请输入当前路由别名(用于配置pageName, 例: 用户设置)'
      }
    ];

    this.prompt(prompts, function (props) {
      this.routeState = props.routeState;
      this.routeDir = props.routeDir;
      this.routeUrl = props.routeUrl;
      this.routePageName = props.routePageName;

      done();
    }.bind(this));
};

_pt_.writing = function writing(){
  var join = path.join;

  exec('find . -type d -name "pages" | grep "trunk/app"', function(error, stdout){
    stdout = stdout.trim();
    var routeDir = join(stdout, this.routeDir);
    var dirs = this.routeDir.split('/');
    var className;

    dirs.forEach(function(value, i){
      dirs[i] = value.slice(0, 3);
    });

    className = dirs.join('-');

    if(! fs.existsSync(routeDir)){
      
      // 创建路由文件夹
      mkdirp(join(routeDir, 'imgs'));

      this.fs.copyTpl(
        this.templatePath('index.html'),
        this.destinationPath(join(routeDir, 'index.html')),
        { className: className }
      );

      this.fs.copyTpl(
        this.templatePath('index.styl'),
        this.destinationPath(join(routeDir, 'index.styl')),
        { className: className }
      );

      this.fs.copyTpl(
        this.templatePath('index.js'),
        this.destinationPath(join(routeDir, 'index.js')),
        { routeUrl: this.routeUrl, routePageName: this.routePageName }
      );

      exec('find . -name "router.js" | grep "trunk/app"', function(error, routerPath){
        routerPath = routerPath.trim();

        var content = wiring.readFileAsString(routerPath);

        var new_route = util.format(',\n\n  \'%s\': require(\'../pages/%s\')', this.routeState, this.routeDir);

        // <replaceState> 用于在router.js中添加路由所必须 并且保持规范统一
        // 并且在新增的路由后面再加一行标识方便下次添加
        fs.writeFileSync(routerPath, content.replace('//<replaceState>', new_route + '//<replaceState>'));
      }.bind(this));
    }

  }.bind(this));
};
