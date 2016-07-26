'use strict';

/**
 * 项目路由管理服务
 * @name router
 * @memberof services#
 */

var state;

angular
  .module('ink')
  .provider('inkRouter', inkRouter);

state = {

  // 首页 => /index
  'index': require('../pages/index')//<replaceState>
};

function inkRouter($stateProvider, $urlRouterProvider, $locationProvider) {

  this.configuration = function () {

    _.mapObject(state, function (val, key) {
      $stateProvider.state(key, val);
    });

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('index');
    $urlRouterProvider.deferIntercept();
  };

  this.$get = angular.noop;

}