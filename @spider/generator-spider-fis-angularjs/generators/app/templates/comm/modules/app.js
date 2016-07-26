'use strict';

// 通过下面这种方式引入全局CSS和全局JS

// 这种方式是为了防止模块化引入CSS导致位置顺序不正确
// @require /lib/frozen/css/frozen.css
// @require /lib/swiper/css/swiper.css
// @require /styls/base/reset.styl
// @require /styls/component/animate.styl
// @require /styls/component/icons.styl
// @require /styls/base/base.styl

// 这种方式是为了防止打包JS导致位置顺序不正确
// 并且这里这种方式的使用, 与引入全局CSS保持一致性
// 注意: 这里没有引入mod.js 因为该文件是模块加载文件,不能在这里引入
// @require /lib/zepto/zepto.js
// @require /lib/zepto/touch.js
// @require /lib/underscore/underscore.js
// @require /lib/swiper/js/swiper.js
// @require /lib/frozen/js/frozen.js
// @require /lib/fastclick/fastclick.js
// @require /lib/angularjs/angular.js
// @require /lib/angularjs/angular-animate.js
// @require /lib/angularjs/angular-ui-router.js
// @require /lib/angularjs/angular-lazy-img.js
// @require /lib/angularjs/ngStorage.js

// 上面引入JS的方式没有使用require方法
// 因为上面依赖并不是模块化的, 而在modules下面的资源都是模块化的
// 所以能使用require方法引入模块

// modules

require('config');

require('services/api');
require('services/interceptor');
require('services/pack');
require('services/router');
require('services/services');

require('components/header');
require('components/dialog');

require('directives/directive');

require('filters/filter');

angular
  .module('ink')
  .config(config)
  .run(run);

function config(inkRouterProvider, $httpProvider) {
  // 配置路由初始化
  inkRouterProvider.configuration();
  
  // post参数序列化拦截器
  $httpProvider.interceptors.push('asFormPostInterceptor');
  
  $httpProvider.interceptors.push('apiErrorInterceptor');
  // 异常信息拦截器
  $httpProvider.interceptors.push('errorMessageInterceptor');
  // 参数拦截器
  $httpProvider.interceptors.push('paramsInterceptor');
  // 权限验证拦截器
  $httpProvider.interceptors.push('checkLoginInterceptor');
  // 添加loading拦截器
  $httpProvider.interceptors.push('loadingInterceptor');
  // 添加请求锁拦截器
  $httpProvider.interceptors.push('lockQuestInterceptor');
  // 添加log拦截器
  $httpProvider.interceptors.push('logInterceptor');
}

function run(getHost, $rootScope, checkEnv, checkToken, $state, $stateParams, initWeixin, app, stateHistory, TAPP, getUserInfo, checkThankfulLink, checkUserBind, $urlRouter, $q, appShareBtn) {
  var userAgent;

  init();

  function init() {

    userAgent = navigator.userAgent;

    /** @namespace $rootScope */

    /**
     * 屏幕宽度
     * @type {Number}
     */
    $rootScope.winWidth  = $(window).width();

    /**
     * 屏幕高度
     * @type {Number}
     */
    $rootScope.winHeight = $(window).height();

    /**
     * 判断是否是IOS
     * @type {Number}
     */
    $rootScope.isIOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

    /**
     * 判断是否是Android 或者 UC浏览器
     * @type {Number}
     */
    $rootScope.isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1;

    /**
     * 项目名称
     * @type {String}
     * @memberof $rootScope
     */
    $rootScope.appName = app.name;

    /**
     * 历史记录管理
     * @function
     * @see services.stateHistory
     */
    $rootScope.stateHistory = stateHistory;

    /**
     * app分享按钮配置
     * @function
     * @see services.appShareBtn
     */
    $rootScope.appShareBtn  = appShareBtn;

    /**
     * 跳转首页
     * @function
     */
    $rootScope.goIndex = goIndex;

    // 运行环境检测

    $rootScope.isWeixin = checkEnv();

    // 获取项目HOST

    app.host = getHost();

    // 检查用户信息

    checkToken();

    // 获取用户信息

    getUserInfo();

    // 判断感恩用户信息

    checkThankfulLink();

    /**
     * 路由对象, 可在页面上直接引用
     */
    $rootScope.$state = $state;

    /**
     * 路由参数对象, 可在页面上直接引用
     */
    $rootScope.$stateParams = $stateParams;

    // 初始化微信配置 签名
  
    app.shareConfig = initWeixin();

    $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);
    $rootScope.$on('$locationChangeSuccess', locationChangeSuccess);

    $urlRouter.listen();
  }

  function goIndex() {
    $state.go('index');
    return $q.reject();
  }

  function stateChangeSuccess() {
    $rootScope.dialogEle.hide();
    $(window).off('touchmove');
    // 统计
    TAPP();
    app.shareConfig();
  }

  function locationChangeSuccess(e) {
    e.preventDefault();

    // 判断用户是否绑定正式账号
    checkUserBind().then(function () {
      // 判断完成 渲染页面
      $urlRouter.sync();
    });
  }
}

