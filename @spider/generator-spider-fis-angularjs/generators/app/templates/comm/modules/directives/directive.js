'use strict';

/**
 * @namespace directive
 */

angular
  .module('ink')
  .directive('ikImgErr', ikImgErr)
  .directive('ikBanner', ikBanner)
  .directive('iosStatement', iosStatement)
  .directive('ikTipsCenter', ikTipsCenter)
  .directive('ikInputFocus', ikInputFocus)
  .directive('ikBannerWatch', ikBannerWatch);

function ikInputFocus() {

  /**
   * 扩大输入框聚焦
   * @name ikInputFocus
   * @memberof directive#
   */

  return {
    link: function (scope, ele, attr) {
      var $ele;

      $ele = $(ele[0]);

      $ele.on('click', function () {
        $(this).find(attr.inputclass || 'input').focus();
      });

      scope.$on('$destroy', function () {
        $ele.off('click');
      });
    }
  }
}

function ikTipsCenter($rootScope, $timeout) {

  /**
   * 弹出提示消息
   * @name ikTipsCenter
   * @memberof directive#
   * @example
   * <a ng-click="showTipsCenter('收藏成功')"></a>
   * <a ng-click="showTipsCenter('收藏成功', {timeout: 3000})"></a>
   * <a ng-click="showTipsCenter('收藏成功', {timeout: 3000}, cb)"></a>
   */
  
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="ik-tips-center ik-hide animated small" style="text-align: center"></div>',
    compile: function (ele) {
      var timerOut, $win;

      $win = $(window);

      function showTipsCenter(content, opts, cb) {

        if (_.isFunction(opts)) {
          cb = opts;
          opts = {};
        }

        var defOpts = {
          timeout: 1500
        };

        opts = _.extendOwn(defOpts, opts);

        ele.html(content);
        $timeout.cancel(timerOut);

        ele.removeClass('ik-hide').addClass('zoomIn').css({
          top: $win.height() / 2 - ele[0].offsetHeight / 2 + 'px',
          left: $win.width() / 2 - ele[0].offsetWidth / 2 + 'px'
        });

        timerOut = $timeout(function () {
          ele.addClass('ik-hide');
          cb && cb();
        }, opts.timeout);
      }

      $rootScope.showTips = showTipsCenter;
    }
  }
}


function iosStatement($rootScope, app) {

  /**
   * IOS活动声明
   * @name iosStatement
   * @memberof directive#
   */
  return {
    restrict: 'A',
    replace : true,
    link    : function (scope, ele) {
      if(!$rootScope.isIOS || app.isWeixin){
        $(ele[0]).remove();
      }
    }
  };
}

function ikImgErr() {

  /**
   * 图片404异常指令。当图片未能成功加载，则把图片地址赋值为默认图片
   * @name ikImgErr
   * @memberof directive#
   * @example <img lazy-img='图片地址' ik-img-err='默认图片地址' />
   */
  return {
    link: function (scope, ele, attr) {
      var src = attr.src;
      ele.on('error', function () {
        ele.attr('src', src);
        ele.off('error');
      });
    }
  }
}

function ikBanner(app, $timeout) {

  /**
   * 全局banner
   * @name ikBanner
   * @memberof directive#
   */
  return {
    link      : link,
    controller: Controller
  };

  function link(scope, ele) {
    var timer, isOne;

    scope.init = function (size) {

      // 当只有一张图片时, 不滚动
      isOne = size <= 0;

      timer = $timeout(function () {
        new Swiper(ele[0], {
          loop       : !isOne,
          autoplay   : app.autoPlay,
          pagination : '.swiper-pagination',
          lazyLoading: true,
          observer   : true,
          onClick    : scope.swiperClick
        });
      }, 0);
    };

    scope.$on('$destroy', function () {
      $timeout.cancel(timer);
    });
  }

  // @ngInject
  function Controller($scope) {
    this.init = function (size) {
      $scope.init(size);
    }
  }
}

function ikBannerWatch() {

  /**
   * 监听banner变化 以加载swiper
   * @name ikBannerWatch
   * @memberof directive#
   */
  return {
    link   : link,
    require: '^ikBanner'
  };

  function link(scope, ele, attr, ctr) {
    if (scope.$last) {
      ctr.init(scope.$index);
    }
  }
}