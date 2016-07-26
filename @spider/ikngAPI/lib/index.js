'use strict';

require('angular');

var interceptor = require('./interceptor');
var provider = require('./provider');

angular
.module('ik.ngAPI', [])
.config(['$httpProvider', function($httpProvider){
  // 日志拦截器
  $httpProvider.interceptors.push('logInterceptor');
}])
.factory('logInterceptor', interceptor.log)
.provider('ikngAPI', provider.ikngAPI);