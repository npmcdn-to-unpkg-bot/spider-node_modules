'use strict';

/**
 * @namespace services.Interceptor
 */

angular
  .module('ink')
  .factory('asFormPostInterceptor', asFormPostInterceptor)
  .factory('loadingInterceptor', loadingInterceptor)
  .factory('logInterceptor', logInterceptor)
  .factory('apiErrorInterceptor', apiErrorInterceptor)
  .factory('paramsInterceptor', paramsInterceptor)
  .factory('errorMessageInterceptor', errorMessageInterceptor)
  .factory('checkLoginInterceptor', checkLoginInterceptor)
  .factory('lockQuestInterceptor', lockQuestInterceptor);

function apiErrorInterceptor($q, dialog){

  /**
   * API异常拦截器
   * @name apiErrorInterceptor
   * @memberof services.Interceptor#
   */
  return {
    responseError: responseError
  };

  function responseError(res){
    if (res.status !== 401 && res.status !== 800) {
      dialog({content: '网络异常, 请稍后再试! <br/> 状态码: ' + res.status, button: ['确定']});
    }
    return $q.reject(res);
  }
}

function checkLoginInterceptor($q, $injector){

  /**
   * 登录状态检查拦截器
   * @name checkLoginInterceptor
   * @memberof services.Interceptor#
   */

  return {
    responseError: responseError
  };

  function responseError(res){
    if (res.status === 401 && res.data.Code === 401) {
      $injector.get('login')();
    }
    return $q.reject(res);
  }
}

function errorMessageInterceptor($rootScope){

  /**
   * 异常信息拦截器
   * @name errorMessageInterceptor
   * @memberof services.Interceptor#
   */

  return {
    response: response
  };

  function response(res){
    if(res.data.Code >= 10000){
      $rootScope.showTips(res.data.Desc);
    }
    return res;
  }
}

function paramsInterceptor($sessionStorage){

  /**
   * 参数拦截器
   * @name paramsInterceptor
   * @memberof services.Interceptor#
   */

  return {
    request: request
  };

  function request(config){
    var __h, $winEl, _cookies, _capkey, params, urlArr, urlPars, newPars;

    $winEl        = $(window);
    params        = config.params || {};
    _capkey       = $sessionStorage._capkey || '';
    _cookies      = encodeURIComponent('_capkey=' + _capkey);

    urlArr  = decodeURIComponent(config.url).split('?');
    urlPars = urlArr[1] && urlArr[1].split('&');
    newPars = {};

    // 当请求参数中包含_longToString_参数时
    // 为该请求添加一个Compatible-LongType请求头, 让后端将long型转换为string类型

    if ((params && params._longToString_) || (config.data && config.data._longToString_)) {
      config.headers['Compatible-LongType'] = true;
    }

    // 如果get方式自己带了?test=1 那么将去掉本来URL上已有的?
    if (urlArr.length >= 2) {
      config.url = urlArr[0];
    }

    // 将?test=1 转换成对象并且合并到config.params中
    _.each(urlPars, function (param) {
      param = param.split('=');
      newPars[param[0]] = param[1];
    });

    __h         = 'token=' + $sessionStorage.token + '&m-cw=' + $winEl.width() + '&m-ch=' + $winEl.height() + '&_cookies=' + _cookies;
    newPars.__h = encodeURIComponent(__h); // 添加token
    config.params = _.extendOwn(params, newPars);

    return config;
  }
}

function loadingInterceptor($q, loading) {

  /**
   * 为请求添加loading状态
   * @name loadingInterceptor
   * @memberof services.Interceptor#
   */

  var status, loadingEl;

  status = {
    count  : 0,
    loading: false,
    cancel : function () {
      this.count = 0;
      checkLoading(this.loading = false);
    }
  };

  function checkLoading(isLoading) {
    if (!isLoading && loadingEl && loadingEl.length === 1) {
      return loadingEl.loading('hide');
    }

    loadingEl = isLoading && loading({content: '加载中...'});
  }

  function cancel(){
    status.count -= 1;
    if (status.count <= 0) {
      status.cancel();
    }
  }

  function request(config) {
    status.count += 1; // 请求 + 1
    if (!status.loading) {
      window.setTimeout(function () {
        if (!status.loading && status.count > 0) {
          checkLoading(status.loading = true);
        }
      }, 1000);
    }
    return config;
  }

  function response(res) {
    cancel();
    return res;
  }

  function responseError(res) {
    cancel();
    return $q.reject(res);
  }

  return {
    request      : request,
    response     : response,
    responseError: responseError
  }
}

function logInterceptor($q) {

  /**
   * 为请求添加日志。并且判断用户是否需要重新授权
   * @name logInterceptor
   * @memberof services.Interceptor#
   */

  function request(config) {
    console.groupCollapsed('%c[请求][%s]', 'color:blue;', config.url);
    console.dir(config);
    console.groupEnd();
    return config;
  }

  function response(res) {
    console.groupCollapsed('%c[返回][%s]', 'color:green;', res.config.url);
    console.dir(res);
    console.groupEnd();
    return res;
  }

  function responseError(res) {

    console.groupCollapsed('%c[返回异常][%s]', 'color:red;', res.config.url);
    console.dir(res);
    console.groupEnd();

    return $q.reject(res);
  }

  return {
    request      : request,
    response     : response,
    responseError: responseError
  };
}

function lockQuestInterceptor($q) {

  /**
   * 请求锁拦截器
   * @name lockQuestInterceptor
   * @memberof services.Interceptor#
   */
  
  var locks;

  locks = {};

  function request(config) {
    var url, isLock, __unlock;

    url    = config.url;
    isLock = locks[url];
    // 判断请求参数是否要求对该请求不使用锁
    __unlock = (config.params && config.params.__unlock) || (config.data && config.data.__unlock) || false;

    if (__unlock) {
      return config;
    }

    if (isLock) {
      // 拒绝请求
      return $q.reject({
        config    : config,
        status    : 800,
        statusText: '请求太快, 等会儿再来吧!!!'
      });
    }

    locks[url] = true; // 标识请求锁

    return config;
  }

  function response(res) {
    var url, isLock;

    url    = res.config.url;
    isLock = locks[url];

    if (isLock) {
      delete locks[url];
    }

    return res;
  }

  function responseError(res) {
    var url, isLock;

    url    = res.config.url;
    isLock = locks[url];

    if (isLock) {
      delete locks[url];
    }

    return $q.reject(res);
  }

  return {
    request      : request,
    response     : response,
    responseError: responseError
  }
}


function asFormPostInterceptor() {

  /**
   * post参数序列化拦截器
   * @name asFormPostInterceptor
   * @memberof services.Interceptor#
   */

  function request(config){

    // 为请求添加content-type 解决post请求发送options请求的问题

    config.transformRequest.push(transformRequest);

    return config;
  }

  function transformRequest(data, getHeaders) {

    var headers = getHeaders();

    headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';

    return ( serializeData(data) );
  }

  function serializeData(data) {

    // If this is not an object, defer to native stringification.
    if (!angular.isObject(data)) {

      return ( ( data == null ) ? '' : data.toString() );

    }

    var buffer = [];

    // Serialize each key in the object.
    for (var name in data) {

      if (!data.hasOwnProperty(name)) {

        continue;

      }

      var value = data[name];

      buffer.push(
        encodeURIComponent(name) +
        '=' +
        encodeURIComponent(( value == null ) ? '' : value)
      );

    }

    // Serialize the buffer and clean it up for transportation.
    return buffer.join('&').replace(/%20/g, '+');
  }

  return {
    request: request
  }
}
