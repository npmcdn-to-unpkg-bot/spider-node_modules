'use strict';

// @require ./index.styl

angular
  .module('ink')
  .directive('ikHeader', ikHeader);

// @ngInject
function ikHeader($q, app, $state) {

  /**
   * 全局header指令
   * @name ikHeader
   * @memberof components#
   * @example
   * <ik-header></ik-header>
   * <ik-header data-title="标题" right-name="右标题" left-action="动作" right-action="动作" hide-left="true" hide-right="true"></ik-header>
   */
  return {
    template: __inline('./index.html'),
    replace : true,
    restrict: 'E',
    link    : link,
    scope   : {
      'title'      : '@',
      'rightName'  : '@',
      'leftAction' : '&',
      'rightAction': '&',
      'hideLeft'   : '@',
      'hideRight'  : '@'
    }
  };

  function link(scope, ele, attr) {
    var tmp = scope.leftAction;

    // 不是微信打开 并且 非DEBUG
    // 移除顶部导航

    if (!app.isWeixin && !app.env.debug) {
      return $(ele[0]).remove();
    }

    scope.title      = attr.title || app.name;
    scope.leftAction = function () {
      $q.when(tmp()).then(function () {
        history.back();
      });
    };
  }
}