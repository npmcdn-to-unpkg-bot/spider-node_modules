// JS代码验证
var jshintConfig = {
  i18n: 'zh-CN',

  quotmark: 'single', // 单引号
  immed   : true, // (function(){})(); => (function(){}());
  undef   : true, // 禁止使用不在全局变量列表中的未定义的变量
  unused  : false, // 禁止定义变量却不使用

  bitwise  : true, // 禁用位运算符(如^，|，&)
  camelcase: 'camelCase', // 使用驼峰命名(camelCase)或全大写下划线命名(UPPER_CASE)
  curly    : true, // if和while等语句中使用{}来明确代码块
  noempty  : true, // 禁止出现空的代码块
  trailing : true, // 禁止行尾空格
  latedef  : false, // 变量定义前禁止使用
  evil     : true, // 允许使用eval

  validthis: true, // 允许严格模式下在非构造函数中使用this, 当为false, 添加注释以绕过验证 /* jshint validthis: true */
  loopfunc : false, // 允许循环中定义函数
  expr     : true, // 允许应该出现赋值或函数调用的地方使用表达式
  asi      : true, // 省略分号
  eqnull   : true, // 允许==null
  eqeqeq   : false, // 使用===和!==替代==和!=

  // 下面是全局对象定义
  browser   : true,
  devel     : true,
  browserify: true,
  jquery    : true,
  globals   : {
    Inkey   : true,
    Swiper   : true,
    angular  : true,
    _        : true,
    xScroll  : true,
    wx       : true,
    TDAPP    : true,
    FastClick: true,
    __uri    : true,
    __inline : true,
    deny     : true // 首页闪屏广告定义的方法, 该方法用于在闪屏结束后移除监听
  }
};

/*************************配置*****************************/
// 项目名

var app = '<%= appname %>';

fis
  // 通过set project.files对象指定需要编译的文件夹和引用的资源  顺序很重要, 决定依赖顺序
  .set('project.files', ['modules/**', '**'])
  .set('assets', '/assets') // 静态目录
  .set('live', '../live')  // 调试目录
  .set('dist', '../../../../../../../release/acti/' + app) // 发布目录
  .set('baseURL', '/spider/' + app) // 发布目录
  .set('jshint', jshintConfig)
  .hook('module', { // FIS 模块化方案
    mode   : 'mod',
    extList: ['.js', '.css', '/index.js']
  });

/*************************目录规范*****************************/

fis
  .match("**/*", {
    release: '${assets}/$&'
  })
  // modules下面都是模块化资源
  .match(/^\/modules\/(.*)\.(js)$/i, {
    isMod  : true,
    id     : '$1', //id支持简写，去掉modules和.js后缀中间的部分
    release: '${assets}/$&',
    // 开启代码验证
    lint   : fis.plugin('jshint', fis.get('jshint'))
  })
  // page下面的页面发布时去掉page文件夹
  .match(/^\/page\/(.*)$/i, {
    useCache: false,
    release : '$1'
  })
  // 一级同名组件，可以引用短路径，比如modules/jquery/juqery.js
  // 直接引用为var $ = require('jquery');
  .match(/^\/modules\/([^\/]+)\/\1\.(js)$/i, {
    id: '$1'
  })
  // styl的import文件无需发布
  .match(/^\/styls\/import\/(.*)\.styl/i, {
    release: false
  })
  // 页面模板不用编译缓存
  .match(/.*\.html$/, {
    useCache: false
  })
  .match('**/*.styl', {
    // 编译之后后缀
    rExt  : '.css',
    // 开启编译
    parser: fis.plugin('stylus')
  })
  .match('*.png', {
    // 压缩图片
    optimizer: fis.plugin('png-compressor', {
      type: 'pngquant'
    })
  })
  .match('::package', {
    spriter     : fis.plugin('csssprites', {
      margin: 10, //图之间的边距
      layout: 'matrix' //使用矩阵排列方式，默认为线性`linear`
    }),
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
      resourceType: 'mod',
      useInlineMap: true // 资源映射表内嵌
    }),
    packager    : fis.plugin('map')
  })
  .match('**', {
    deploy: fis.plugin('local-deliver', {
      to: fis.get('live')
    })
  });

/**********************测试环境*****************/

fis
  .media('test')
  .match('**', {
    domain: fis.get('baseURL'),
    deploy: [
      fis.plugin('replace', {
        from: '<base href="/"',
        to  : '<base href="' + fis.get('baseURL') + '/"'
      }),

      fis.plugin('local-deliver', {
        to: fis.get('live')
      })
    ]
  });

/**********************生产环境*****************/

fis
  .media('pro')
  // 合并 lib.css
  // 这里不需要关心依赖关系(比如: rest.css 应该在其最前面导入)
  // 依赖关系已经在程序入口定义好了, 这里只要合并就好了
  .match('/{lib,styls}/**.{styl,css}', {
    packTo: 'css/lib.css'
  })
  // 合并 app.css
  .match('/modules/**.{styl,css}', {
    packTo: 'css/app.css'
  })
  .match('*.css', {
    // 压缩CSS
    optimizer: fis.plugin('clean-css'),
    // 开启图片合并
    useSprite: true
  })
  // 合并 lib.js
  .match('/lib/**.js', {
    packTo: 'js/lib.js'
  })
  // 控制打包顺序 值越小越靠前
  .match('/lib/zepto/zepto.min.js', {
    packOrder: -100
  })
  .match('/lib/angularjs/angular.js', {
    packOrder: -99
  })
  // 合并 app.js
  .match('/modules/**.js', {
    packTo: 'js/app.js'
  })
  .match('**.js', {
    preprocessor: fis.plugin('annotate'),
    // 压缩JS
    optimizer   : fis.plugin('uglify-js', {
      compress: {
        drop_console: true // 自动去除console.log等调试信息
      }
    })
  })
  // 添加hash {...,css} 逗号之间不能有空格
  .match('**.{css,js,png,jpg,gif,eot,svg,ttf,woff}', {
    useHash: true
  })
  .match('**', {
    domain: fis.get('baseURL'),
    deploy: [
      fis.plugin('replace', {
        from: '<base href="/"',
        to  : '<base href="' + fis.get('baseURL') + '/"'
      }),

      // 将打包好的zip, 输出到dist目录
      fis.plugin('local-deliver', {
        to: fis.get('dist')
      })
    ]
  });