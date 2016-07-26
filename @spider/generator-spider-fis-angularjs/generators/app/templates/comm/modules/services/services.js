'use strict';

/**
 * @namespace services
 */

angular
  .module('ink')
  .factory('checkUserBind', checkUserBind)
  .factory('login', login)
  .factory('safeApply', safeApply)
  .factory('checkEnv', checkEnv)
  .factory('checkToken', checkToken)
  .factory('getUrl', getUrl)
  .factory('redirect', redirect)
  .factory('getHost', getHost)
  .factory('getIndexURL', getIndexURL)
  .factory('TAPP', TAPP)
  .factory('getUserInfo', getUserInfo)
  .factory('stateHistory', stateHistory)
  .factory('checkThankfulLink', checkThankfulLink)
  .factory('goParentIndex', goParentIndex)
  .factory('initWeixin', initWeixin)
  .factory('appShareBtn', appShareBtn);

function appShareBtn(app, TAPP, $sessionStorage) {

  /**
   * 默认APP分享, 非微信分享
   * @name appShareBtn
   * @memberof services#
   * @function
   */
  return function () {
    var link, share;

    TAPP('分享');

    share = app.share;

    link = app.env.WXCore + app.shareURL + '?Type=50';

    // 获取用户信息 判断感恩
    if ($sessionStorage.PresenterPhone) {
      link += '&_thanks_=' + parseInt($sessionStorage.PresenterPhone).toString(16);
    }

    window.Inkey.native.shareByAttr(share.title, share.desc, share.imgUrl, link, [1, 6, 18, 19, 22, 23, 24]);
  };
}


function goParentIndex(app, redirect) {

  /**
   * 返回父级首页。微信: 秒赚首页;APP: 关闭WebView
   * @name goParentIndex
   * @memberof services#
   * @function
   */
  return function () {

    if (app.env.debug) {
      return false;
    }

    if (app.isWeixin) {
      // 跳转微信首页

      redirect(app.env.WXCore + app.weixinRoute.index);

    } else {
      // 关闭WebView

      Inkey.native.closeWebView();
    }
  }
}

function TAPP(app, $state) {
  var tdapp = window._czc || {push: angular.noop};

  /**
   * 数据统计服务
   * @name TAPP
   * @param  {String} label 标签名
   * @memberof services#
   * @function
   * @example
   * TAPP('标签名')
   */
  return function (label) {
    var eventId = app.name + $state.current.data.pageName;

    if (label) {
      tdapp.push(['_trackEvent', eventId, label]);
    } else {
      tdapp.push(['_trackEvent', eventId]);
    }
  }
}

function stateHistory($sessionStorage, $state, $q) {

  /**
   * 历史状态管理
   * @name stateHistory
   * @param  {String} stateName 路由名(跳转前设置, 指定允许返回到该状态的路由)
   * @memberof services#
   * @function
   * @example
   * stateHistory(stateName) // 设置允许指定路由返回到当前页面
   * stateHistory() // 可以直接在页面上使用 已经绑定到rootScope下
   */
  return function (stateName) {
    var index              = -1;
    var currentStateName   = $state.current.name;
    var currentStateParams = $state.params;
    var historys           = $sessionStorage.stateHistory || [];

    // set

    if (stateName) {

      angular.forEach(historys, function (state, key) {
        if (state.name === currentStateName) {
          index = key;
        }
      });

      // 设置新值

      if (index !== -1) {
        historys[index].params     = $state.params;
        historys[index].allowState = stateName;
      } else {
        historys.push({
          name      : currentStateName,
          params    : currentStateParams,
          allowState: stateName
        });
      }

      $sessionStorage.stateHistory = historys;

      return false;
    }

    // get

    angular.forEach(historys, function (state, key) {
      if (state.allowState === currentStateName) {
        index = key;
      }
    });

    if (index !== -1) {
      $state.go(historys[index].name, historys[index].params);
      historys.splice(index, 1);
      $sessionStorage.stateHistory = historys;
      return $q.reject();
    }
  }
}

function getHost($location) {
  
  /**
   * 获取当前host
   * @name getHost
   * @memberof services#
   * @function
   */
  return function () {
    var url = $location.url();
    var absUrl = $location.absUrl();

    // 让项目路径以 / 开头 直接返回HOST(去掉末尾的 / )
    return url === '/' ? absUrl.substring(0, absUrl.length - 1) : absUrl.split(url)[0];
  };
}

function getIndexURL(getHost) {
  /**
   * 获取首页地址
   * @name getIndexURL
   * @memberof services#
   * @function
   */
  return function () {
    return getHost() + '/index';
  }
}

function checkEnv(app) {
  /**
   * 检测运行环境。是否是微信打开
   * @name checkEnv
   * @memberof services#
   * @function
   */
  return function () {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      app.isWeixin = true;
    }

    return app.isWeixin;
  }
}

function checkUserBind(redirect, app, getUserInfo, $q) {
  /**
   * 判断用户是否绑定正式账号
   * @name checkUserBind
   * @memberof services#
   * @function
   */
  return function () {
    var defer = $q.defer();
    // 如果是微信 才判断是否是临时账户
    if (app.isWeixin && !app.env.debug) {
      getUserInfo().then(function (data) {
        // 如果用户是临时账户, 跳转绑定 并且微信的回退按钮设置为返回首页
        if (data.Data.IsTemp) {
          redirect(app.env.WXCore + app.weixinRoute.userBind + '?custom_return_url=' + encodeURIComponent('/' + app.weixinRoute.index));
        } else {
          defer.resolve();
        }
      }, function () {
        defer.resolve();
      });
    } else {
      defer.resolve();
    }
    return defer.promise;
  }
}

function checkToken($sessionStorage, $location, login) {
  /**
   * 检测Token。将Token 写入缓存 方便读取
   * @name checkToken
   * @memberof services#
   * @function
   */
  return function () {
    var queryString = $location.search();
    var token       = queryString.token || $sessionStorage.token;

    if (token) {
      // token存在 就更新一次缓存
      $sessionStorage.token = token;
    } else {
      login();
    }
  }
}

function checkThankfulLink(CustomerAPI, $sessionStorage) {
  /**
   * 判断感恩链接信息
   * @name checkThankfulLink
   * @memberof services#
   * @function
   */
  return function () {
    return CustomerAPI.new('CheckMemberCampaignLink', {
      cache : true
    }).get().then(function (data) {
      // 缓存感恩信息
      $sessionStorage.PresenterPhone = data.Data.PresenterPhone;
      return data;
    });
  }
}

function getUserInfo(CustomerAPI, $sessionStorage) {
  /**
   * 获取用户信息
   * @name getUserInfo
   * @memberof services#
   * @function
   */
  return function () {
    return CustomerAPI.new('Info', {
      cache : true
    }).get().then(function (data) {
      // 缓存用户信息
      $sessionStorage.user = data.Data;
      return data;
    });
  }
}

function getUrl($location) {
  /**
   * 获取当前URL
   * @name getUrl
   * @memberof services#
   * @function
   */
  return function () {
    return $location.absUrl().split('#')[0];
  }
}

function redirect() {
  /**
   * 重定向
   * @name redirect
   * @memberof services#
   * @function
   */
  return function (url) {
    window.location.href = url;
  }
}

function login(app, getUrl, redirect, $location, param) {
  /**
   * 登录
   * @name login
   * @memberof services#
   * @function
   */
  return function () {
    var currentUrl, search;

    search = $location.search();

    if (!app.env.debug) {
      if (!app.isWeixin) {
        // 关闭WebView

        return Inkey.native.closeWebView();
      }
    }

    // 删除当前url上的token 防止授权回来存在多个token
    delete search.token;

    currentUrl = $location.absUrl().split('?')[0];
    
    // 当url存在其它参数时重新拼接url参数
    if(!_.isEmpty(search)){
      currentUrl = currentUrl + '?' + param(search);
    }

    currentUrl = encodeURIComponent(currentUrl);

    redirect(app.env.LoginUrl + currentUrl);
  };
}

function safeApply(app) {
  /**
   * 更新绑定
   * @name safeApply
   * @memberof services#
   * @function
   */
  return function (fn, scope) {
    scope = scope ? scope : app.rootScope;
    fn    = angular.isFunction(fn) ? fn : angular.noop;
    if (scope.$$phase === '$apply' || scope.$$phase === '$digest') {
      fn();
    } else {
      scope.$apply(fn);
    }
  };
}

function initWeixin(app, WXCoreAPI, getUrl, TAPP, $sessionStorage, $rootScope) {

  /**
   * 微信配置
   * @name initWeixin
   * @memberof services#
   * @function
   */
  return function () {
    var JSSignature, params;
    var share, shareDef;

    init();

    return updateShareConfig;

    function init() {

      params      = {Url: getUrl()};
      JSSignature = WXCoreAPI.new('JSSignature', {cache: true, params: params});

      shareDef = {
        desc   : app.share.desc,
        link   : app.env.WXCore + app.shareURL,
        title  : app.share.title,
        imgUrl : app.share.imgUrl,
        success: function () {
          TAPP('分享');
        }
      };
      share    = angular.extend({}, shareDef);

      // 更新分享参数

      updateShareConfig();

      wx.ready(function () {

        // 分享到QQ
        wx.onMenuShareQQ(share);
        // 分享到腾讯微博
        wx.onMenuShareWeibo(share);
        // 分享到QQ空间
        wx.onMenuShareQZone(share);
        // 分享到朋友圈
        wx.onMenuShareTimeline(share);
        // 分享给朋友
        wx.onMenuShareAppMessage(share);

      });

      request();
    }

    /**
     * 获取微信SDK签名
     */

    function request() {

      // 非微信禁止接口调用
      if (!$rootScope.isWeixin) {
        return false;
      }

      JSSignature.get().then(function (data) {
        data = data.Data;
        wx.config({
          appId: data.AppId,
          debug: app.wxConfig.debug,
          nonceStr: data.NonceStr,
          timestamp: data.TimeStamp,
          signature: data.Signature,
          jsApiList: app.wxConfig.apiList
        });
      });
    }

    /**
     * 更新配置
     * @param title 标题
     * @param desc 描述
     * @param imgUrl 图片地址
     * @param link 分享链接
     */

    function updateShareConfig(title, desc, imgUrl, link) {
      var args = _.toArray(arguments);

      if (!_.isEmpty(args)) {
        share.desc   = desc;
        share.title  = title;
        share.imgUrl = imgUrl;
        share.link   = shareDef.link + '?Type=51' + link;
      } else {
        share.desc   = shareDef.desc;
        share.title  = shareDef.title;
        share.imgUrl = shareDef.imgUrl;
        share.link   = shareDef.link + '?Type=50';
      }

      // 获取用户信息 判断感恩
      if ($sessionStorage.PresenterPhone) {
        share.link += '&_thanks_=' + parseInt($sessionStorage.PresenterPhone).toString(16);
      }
    }
  };
}