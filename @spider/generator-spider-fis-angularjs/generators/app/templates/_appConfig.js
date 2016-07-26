'use strict';

/** 
* @namespace app
*/

var env = {
  develop: { // 开发环境

    /**
     * debug模式
     * @type {Boolean}
     * @memberof app.env
     */
    debug: true,

    /**
     * 活动API地址
     * @type {String}
     * @memberof app.env
     */
    activeAPI: 'http://172.16.0.201:7000/m/',

    /**
     * 秒赚API地址
     * @type {String}
     * @memberof app.env
     */
    mzAPI: 'http://192.168.0.201:8421/api/',

    /**
     * 微信API地址
     * @type {String}
     * @memberof app.env
     */
    WXCore: 'http://weixin.test.inkey.com/',

    /**
     * 前端项目地址
     * @type {String}
     * @memberof app.env
     */
    h5: 'http://h5.test.inkey.com/',

    /**
     * 微信支付地址
     * @type {String}
     * @memberof app.env
     */
    WXPayment: 'http://weixin.test.inkey.com/weixinPay/index.html',

    /**
     * token授权地址
     * @type {String}
     * @memberof app.env
     */
    LoginUrl: 'http://172.16.0.201:7010/user/getCode?port=8421&uname=13990004001&pwd=123456&state='
  },
  test: { // 测试环境
    debug: false,
    activeAPI: 'http://192.168.0.201:8403/api/',
    mzAPI: 'http://192.168.0.201:8421/api/',
    WXCore: 'http://weixin.test.inkey.com/',
    h5: 'http://h5.test.inkey.com/',
    WXPayment: 'http://weixin.test.inkey.com/weixinPay/index.html',
    LoginUrl: 'http://weixin.test.inkey.com/WXCore/Entry?redirect_uri='
  },
  prepare: { // 预发布环境
    debug: false,
    activeAPI: 'http://acti.ready.inkey.com/api/',
    mzAPI: 'https://mzapi-ready.inkey.com/api/',
    WXCore: 'http://mzmp.ready.inkey.com/',
    h5: 'http://h5.ready.inkey.com/',
    WXPayment: 'http://mzmp.ready.inkey.com/weixinPay/index.html',
    LoginUrl: 'http://mzmp.ready.inkey.com/WXCore/Entry?redirect_uri='
  },
  production: { // 生产环境
    debug: false,
    activeAPI: 'https://acti.inkey.com/api/',
    mzAPI: 'https://mzapi.inkey.com/api/',
    WXCore: 'https://mzmp.inkey.com/',
    h5: 'https://h5.inkey.com/',
    WXPayment: 'https://h5.inkey.com/platforms/weixinPay/index.html',
    LoginUrl: 'https://mzmp.inkey.com/WXCore/Entry?redirect_uri='
  }
};

angular
  // 定义ink模块, 声明依赖关系
  .module('ink', ['ui.router', 'ngAnimate', 'angularLazyImg', 'ngStorage'])
  // 全局变量
  .constant('app', {

    /**
     * appName
     * @type {String}
     * @memberof app
     */
    name: '<%= appAlias %>',

    /**
     * 环境标识
     * @type {Object}
     * @namespace app.env
     * @default develop
     */
    env: env.develop,

    /**
     * 项目HOST
     * @type {String}
     * @memberof app
     */
    host: '',

    /**
     * 微信标识
     * @type {Boolean}
     * @memberof app
     */
    isWeixin: false,

    /**
     * 请求过期时间 单位:毫秒
     * @type {Number}
     * @memberof app
     * @default
     */
    httpTimeout: 25000,

    // 首页banner自动播放时间

    /**
     * banner自动播放时间
     * @type {Number}
     * @memberof app
     * @default
     */
    autoPlay: 3000,

    /**
     * 数据缓存时间 单位 分钟
     * @type {Number}
     * @memberof app
     * @default
     */
    cacheExpire: 30,

    /**
     * 分享配置
     * @function
     * @memberof app
     */
    shareConfig: angular.noop,

    /**
     * 全局正则表达式
     * @type {Object}
     * @namespace app.regEx
     */
    regEx: {

      /**
       * 验证手机
       * @type {Boolean}
       * @memberof app.regEx
       * @default
       */
      phone: /^(0|86|17951)?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/,
    
      /**
       * 验证邮箱
       * @type {Boolean}
       * @memberof app.regEx
       * @default
       */
      email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
    },

    /**
     * 分享地址prefix
     * @type {String}
     * @memberof app
     */
    shareURL: 'CommonCore/ShareEntry',

    /**
     * 微信配置
     * @type {Object}
     * @namespace app.wxConfig
     */
    wxConfig: {

      /**
       * 微信debug模式
       * @type {Boolean}
       * @memberof app.wxConfig
       * @default
       */
      debug: false,

      /**
       * 微信接口列表
       * @type {Array}
       * @memberof app.wxConfig
       */
      apiList: [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone'
      ]
    },

    /**
     * 分享
     * @type {Object}
     * @namespace app.share
     */
    share: {

      /**
       * 分享描述
       * @type {String}
       * @memberof app.share
       * @default
       */
      desc: '<%= appShareDesc %>',

      /**
       * 分享标题
       * @type {String}
       * @memberof app.share
       * @default
       */
      title: '<%= appShareTitle %>',

      /**
       * imgUrl
       * @type {String}
       * @memberof app.share
       * @default
       */
      imgUrl: 'http://img.inkey.com/oper/business/2015/1021/15/90d5520a-def5-c180-7b64-08d2d9e82c6d?_t=20151021152101453'
    }
  });
