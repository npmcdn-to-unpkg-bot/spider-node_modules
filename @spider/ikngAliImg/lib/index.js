'use strict';

require('@spider/angular-lazy-img');
var userAgent = navigator.userAgent.toLowerCase();
var isAndroid = userAgent.indexOf('android') > -1 || userAgent.indexOf('linux') > -1;

angular
  .module('ik.ngAliImg', ['angularLazyImg'])
  .constant('ikngAliImgConfig', {
    isWebp: true,
    defaultImg: {
      text: 'http://res.inkey.com/acti/content/2016/0406/13/3992995c-b21c-cd21-c00d-08d35ddb4d68/default_logo_b.png?_t=20160406132126750',
      noText: 'http://res.inkey.com/acti/content/2016/0406/13/2ca501a1-80ba-c429-5f85-08d35ddb59a9/default_logo_s.png?_t=20160406132147307'
    }
  })
  .provider('ikngAliImg', ikngAliImg)
  .directive('ikImg', ikImg)
  .factory('imageClipping', imageClipping);

function ikngAliImg(ikngAliImgConfig) {

  this.$get = function () {
  };

  this.configuration = function (opt) {
    _.extendOwn(ikngAliImgConfig, opt);
  }
}


/**
 * 图片剪裁
 */

function imageClipping(ikngAliImgConfig) {
  return function (imgSrc, imgHeight, imgWidth, suffix, noCut, extend) {
    var aSrc, imgSize, dpr, suffixName;

    imgSrc = imgSrc.split('?');
    aSrc = imgSrc[0];
    imgSize = '';
    dpr = window.devicePixelRatio > 1 ? 2 : 1;
    noCut = !noCut ? '1e_1c_' : ''; // 判断是否需要剪裁图片
    extend = extend ? '_' + extend : '';

    // 判断是否需要剪裁图片
    if (/.*(.jpg|.png|.gif|.bmp|.JPG|.PNG|.GIF|.BMP)$/.test(imgSrc)) {
      return imgSrc;
    }

    // 通过配置判断是否要加webp
    if (ikngAliImgConfig.isWebp) {
      suffixName = isAndroid ? 'webp' : suffix || 'jpg';
    } else {
      suffixName = suffix || 'jpg';
    }

    imgHeight = parseInt(imgHeight, 10);
    imgWidth = parseInt(imgWidth, 10);

    // 获取长边
    if (imgWidth) {
      imgSize += imgWidth + 'w_';
    }

    if (imgHeight) {
      imgSize += imgHeight + 'h_';
    }

    if (imgSize) {
      imgSize += dpr + 'x_';
    }

    aSrc += '@' + imgSize + noCut + '70Q' + extend + '.' + suffixName + '?' + (imgSrc[1] || '');

    return aSrc;
  };
}

/**
 * 加载图片
 * 当图片未能成功加载，则把图片地址赋值为默认图片
 * example: <ik-img src="data.img || 'no'"></ik-img>
 * @params         box-height            盒子高度（若高度是动态获取时需要传此值）默认值：box高度
 * @params         box-height            盒子宽度（若宽度是动态获取时需要传此值）默认值：box宽度
 * @params         size                  默认图片大小 如：50%或50px  默认值：50%
 * @params         suffix                显示图片后缀（若图为png时需要传此值）  默认值：jpg
 * @params         width                 显示图片宽度 如：100%、100px、auto  默认值：100%
 * @params         height                显示图片高度 如：100%、100px、auto  默认值：100%
 * @params         no-ali                不使用阿里OSS参数 如：y  默认值：n
 * @params         no-cut                不剪裁图片 如：y  默认值：n
 * @params         no-lazy               不使用懒加载 如：y  默认值：n
 * @params         init-src              默认图片 如：b、s  默认值：b
 * @params         extend                阿里OSS参数扩展 例如：1e_1c
 * @params         box-class             图片父容器样式
 * @params         back-color            背景颜色 例如：y、#ffffff  默认：n
 * @params         auto                  图片大小自动不设置  如：y   默认：n
 */

function ikImg(LazyImgMagic, imageClipping, ikngAliImgConfig, $rootScope) {
  return {
    // 指令优先级 值越低越优先
    // 该指令要晚于 angular-lazy-img 指令
    // 这里使用了 angular-lazy-img 指令提供的 lazyImg 方法
    priority: 1000,
    restrict: 'E',
    replace: true,
    template: '<img class="{{imgClass}}">',
    scope: {
      src: '=',
      size: '@',
      suffix: '@',
      width: '@',
      height: '@',
      noCut: '@',
      noAli: '@',
      noLazy: '@',
      initSrc: '@',
      boxHeight: '@',
      boxWidth: '@',
      extend: '@',
      boxClass: '@',
      imgClass: '@',
      auto: '@',
      backColor: '@'
    },
    link: function (scope, ele) {
      var $imgBox, img, $img, defaultSize, imgH, imgW, imgUrl, boxH, initSrc, lazyImage, oldUrl;

      $img = $(ele[0]);

      // 生成包裹容器
      $img.wrap('<div class="ik-ali-img ui-flex ui-flex-align-center ui-flex-pack-center ' + (scope.boxClass || '') + '"></div>');

      // 获取父容器元素
      $imgBox = $(ele[0]).parent('.ik-ali-img');

      // 获取父容器高度
      boxH = parseInt(scope.boxHeight || scope.height || $imgBox.height());

      imgH = scope.height || '100%';
      imgW = scope.width || '100%';
      defaultSize = scope.size || '50%';
      initSrc = {
        b: ikngAliImgConfig.defaultImg.text,
        s: ikngAliImgConfig.defaultImg.noText
      }[scope.initSrc || 'b'];

      // 设置box大小
      (scope.boxHeight || scope.height) && $imgBox.height(scope.boxHeight || scope.height);
      (scope.boxWidth || scope.width) && $imgBox.width(scope.boxWidth || scope.width);

      // 计算图片宽度转换成px
      if (imgW !== 'auto' && imgW.indexOf('%') > -1) {
        imgW = parseInt(imgW) * $rootScope.winWidth / 100 + 'px';
      }

      // 设置图片背景颜色
      if (scope.backColor && scope.backColor !== 'n') {
        $imgBox.css({'background-color': scope.backColor === 'y' ? '#efefef' : scope.backColor});
      }

      // 按box的高度计算默认图百分比高度
      if (defaultSize.indexOf('%') > -1) {
        defaultSize = boxH * parseInt(defaultSize.replace('%', '')) / 100;
      }

      defaultSize = parseInt(defaultSize);

      // 设置默认图片大小
      $img.css({
        height: defaultSize,
        width: 'auto',
        'margin-top': (boxH - defaultSize) / 2,
        'margin-bottom': (boxH - defaultSize) / 2
      });

      $img.attr({'data-imgH': imgH, 'data-imgW': imgW});

      lazyImage = new LazyImgMagic(ele);

      // 监听loadImg是否存在值
      scope.$watch('src', function (val) {
        if (val) {
          oldUrl = val;
          imgUrl = imgClipping(scope.src, imgH, imgW);

          if (scope.noLazy === undefined) {
            $img.attr('src', initSrc);
            lazyImage.setSource(imgUrl, showImg);
            lazyImage.checkImages();
          } else {
            newImg(imgUrl);
          }
        }
      });

      scope.$on('$destroy', function () {
        lazyImage.removeImage();
        img = null;
      });

      /**
       * 剪裁图片
       * @param imgSrc
       * @param imgHeight
       * @param imgWidth
       */
      function imgClipping(imgSrc, imgHeight, imgWidth) {
        // 判断是否使用阿里OSS参数
        if (scope.noAli === 'y') {
          return imgSrc;
        } else {
          // 计算图片高度
          if (imgHeight.indexOf('%') > -1) {
            imgHeight = boxH * parseInt(imgHeight.replace('%', '')) / 100;
          }

          // 计算图片宽度
          if (imgWidth.indexOf('%') > -1) {
            imgWidth = $imgBox.width() * parseInt(imgWidth.replace('%', '')) / 100;
          }

          return imageClipping(imgSrc, imgHeight, imgWidth, scope.suffix, scope.noCut, scope.extend);
        }
      }

      /**
       * 加载图片
       * @param src
       */
      function newImg(src) {
        // 加载图片
        img = new Image();

        img.src = src;

        if (img.complete) {
          showImg($img, src);
        } else {
          $img.attr('src', initSrc);
          // 图片加载完成
          img.onload = function () {
            showImg($img, src);
          };
        }
      }

      /**
       * 显示图片
       */
      function showImg(img, src) {
        img.parent().removeClass('ui-flex ui-flex-align-center ui-flex-pack-center');
        img.css({
          height: img.attr('data-imgH'),
          width: img.attr('data-imgW'),
          'margin-top': 'auto',
          'margin-bottom': 'auto'
        }).attr('src', src);
      }
    }
  }
}