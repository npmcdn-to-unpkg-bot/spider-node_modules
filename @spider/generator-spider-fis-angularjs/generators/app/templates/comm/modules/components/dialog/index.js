'use strict';

/**
 * @namespace components
 */

// @require ./index.styl

angular
  .module('ink')
  .directive('ikDialog', ikDialog);

// @ngInject
function ikDialog($q, $sce, $rootScope) {

  /**
   * 全局弹窗指令
   * @name ikDialog
   * @memberof components#
   * @example
   * $rootScope.dialog({
   *   desc: '我是内容',
   *   btnName: '我是按钮标题',
   *   noBtn: false, // 是否显示按钮
   *   btnFunc: function () {}, // 确定按钮方法
   *   closeFunc: function () {}, // 关闭按钮方法
   *   showCallback: function () {} // 隐藏之后 调用此方法
   * });
   */
  return {
    template: __inline('./index.html'),
    replace : true,
    restrict: 'E',
    link    : link
  };

  function link(scope, ele) {
    var $ele, defConf, $win, $btnEle;

    $ele = $rootScope.dialogEle = $(ele[0]);
    $btnEle = $ele.find('button');
    $win    = $(window);
    defConf = {
      desc        : '',
      btnName     : '确定',
      noBtn       : false,
      btnFunc     : angular.noop,
      closeFunc   : angular.noop,
      showCallback: angular.noop
    };

    $ele.hide();

    $rootScope.dialog = function (opts) {
      var btnFunc, closeFunc;
      scope.opts = angular.extend(defConf, opts);
      btnFunc    = scope.opts.btnFunc;
      closeFunc  = scope.opts.closeFunc;

      scope.opts.btnFunc = function () {
        $q.when(btnFunc()).then(close);
      };

      scope.opts.closeFunc = function () {
        $q.when(closeFunc()).then(close);
      };

      // 这里用传入的参数判断是否显示按钮
      // 目的是防止scope失效, 导致按钮无法显示

      if(opts.noBtn){
        $btnEle.hide();
      }

      // 转义

      scope.opts.desc = $sce.trustAsHtml(scope.opts.desc);

      // 禁止滚动
      $win.on('touchmove', function (e) {
        e.preventDefault && e.preventDefault();
        e.returnValue = false;
        e.stopPropagation && e.stopPropagation();
        return false;
      });

      $ele.show();

      scope.opts.showCallback($ele);
    };

    function close() {
      $ele.hide();
      $btnEle.show();
      $win.off('touchmove');
    }
  }
}