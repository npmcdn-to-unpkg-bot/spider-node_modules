'use strict';

 /**
   * 请求拦截器，为请求添加日志
   */
  
function logInterceptor($q){

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

// 依赖注入

logInterceptor.$inject = ['$q'];

exports.log = logInterceptor;