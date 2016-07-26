'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

/**
 * 父类
 * @namespace Inkey
 */

var ik = {};

/**
 * 工具类
 * @namespace Inkey.util
 */

var util = {};
var ua = window.navigator.userAgent;
var search = window.location.search;

/**
 * @description 当前版本号
 * @memberof Inkey
 * @type {string}
 */

ik.version = '2.0.4';

/**
 * @description 判断是否是IOS
 * @memberof Inkey.util
 * @type {boolean}
 */

util.isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

/**
 * @description 判断是否是Android
 * @memberof Inkey.util
 * @type {boolean}
 */

util.isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1;

/**
 * @description 判断是否是微信
 * @memberof Inkey.util
 * @type {boolean}
 */

util.isWeixin = !!ua.match(/MicroMessenger/i);

/**
 * @description 判断是否是IOS版秒赚
 * @memberof Inkey.util
 * @type {boolean}
 */

util.isIOSMiaoZhuan = !!ua.match(/MiaoZhuan/i) && util.isIOS;


/**
 * @description 判断是否是Android版秒赚
 * @memberof Inkey.util
 * @type {boolean}
 */

util.isAndroidMiaoZhuan = (function () {
  try {
    return !!H5CALLAPP.getPkgName().match(/zdit/i) && util.isAndroid;
  } catch (e) {
    return false;
  }
}());

/**
 * @description 判断是否是Hybrid模式(混合模式)
 * @memberof Inkey.util
 * @type {boolean}
 */

util.isHybrid = window.location.href.indexOf('file:///') >= 0;

/**
 * @description 判断是否是Android版Hybrid模式(混合模式)
 * @memberof Inkey.util
 * @type {boolean}
 */

util.isAndroidHybrid = util.isHybrid && util.isAndroid;

/**
 * @description 判断是否是IOS版Hybrid模式(混合模式)
 * @memberof Inkey.util
 * @type {boolean}
 */

util.isIOSHybrid = util.isHybrid && util.isIOS;

/**
 * @description 空方法
 * @memberof Inkey.util
 * @function
 */

util.noop = function () {
};

/**
 * @description 获取地址栏参数列表
 * @example
 * // url: http://www.example.com?key1=1&key2=2
 * var params = Inkey.util.search();
 * params => {key1: 1, key2: 2}
 * @memberof Inkey.util
 * @function
 * @return {Object}
 */

util.search = function () {
  var searchs = {};

  search = search.split('?');

  if (search.length > 1) {
    search = search[1].split('&');

    search.forEach(function (value) {
      value = value.split('=');

      if (value.length > 1) {
        searchs[value[0]] = value[1];
      } else {
        searchs[value[0]] = '';
      }
    });

    return searchs;
  } else {
    return {};
  }
};

/**
 * @description 获取APPToken
 * @memberof Inkey.util
 * @function
 * @return {String}
 */

util.getAPPToken = function () {
  var token = this.search().token,
    meta = document.getElementsByTagName('meta').token;
  if (!token && undefined !== meta) {
    return meta.content;
  } else {
    return token || '';
  }
};

/**
 * @description 根据环境选择回调
 * @param callbacks {function} 该回调方法返回一个对象用于对应环境回调
 * {weixin: func, android: func, ios: func: other: func, iosMiaoZhuan: func, androidMiaoZhuan: func,
   *  hybrid: func, androidHybrid: func, iosHybrid: func
   * }
 * @memberof Inkey.util
 * @function
 */

util.callByEnv = function (callbacks) {

  var results = callbacks();

  results.weixin = results.weixin || this.noop;
  results.android = results.android || this.noop;
  results.ios = results.ios || this.noop;
  results.other = results.other || this.noop;
  results.iosMiaoZhuan = results.iosMiaoZhuan || this.noop;
  results.androidMiaoZhuan = results.androidMiaoZhuan || this.noop;
  results.hybrid = results.hybrid || this.noop;
  results.androidHybrid = results.androidHybrid || this.noop;
  results.iosHybrid = results.iosHybrid || this.noop;

  // 先判断微信 防止先触发 IOS 或 Android 回掉

  if (this.isWeixin) {
    return results.weixin();
  }

  if (this.isIOSMiaoZhuan) {
    return results.iosMiaoZhuan();
  }

  if (this.isAndroidMiaoZhuan) {
    return results.androidMiaoZhuan();
  }

  if (this.isIOSHybrid) {
    return results.iosHybrid();
  }

  if (this.isAndroidHybrid) {
    return results.androidHybrid();
  }

  if (this.isHybrid) {
    return results.hybrid();
  }

  if (this.isIOS) {
    return results.ios();
  }

  if (this.isAndroid) {
    return results.android();
  }

  results.other();
};

/**
 * @description 判断是否是数组
 * @param arr {Object} 待判断的对象
 * @memberof Inkey.util
 * @function
 */

util.isArray = function isArray(arr) {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(arr);
  }

  return toStr.call(arr) === '[object Array]';
};

/**
 * @description 判断是否是纯粹的对象
 * @param arr {Object} 待判断的对象
 * @memberof Inkey.util
 * @function
 */

util.isPlainObject = function isPlainObject(obj) {
  if (!obj || toStr.call(obj) !== '[object Object]') {
    return false;
  }

  var hasOwnConstructor = hasOwn.call(obj, 'constructor');
  var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
  if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
    return false;
  }
  var key;
  for (key in obj) { /**/
  }

  return typeof key === 'undefined' || hasOwn.call(obj, key);
};

/**
 * @description 扩展对象, 返回扩展后的目标对象
 * @param deep {Boolean} 是否进行深度合并
 * @param target {Object} 目标对象
 * @param object1 {Object} 该对象将合并到目标对象
 * @param objectN {Object} 该对象将合并到目标对象
 * @memberof Inkey.util
 * @function
 */

util.extend = function extend() {
  var options, name, src, copy, copyIsArray, clone;
  var target = arguments[0];
  var i = 1;
  var length = arguments.length;
  var deep = false;

  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    i = 2;
  } else if ((typeof target !== 'object' && typeof target !== 'function') || target === null) {
    target = {};
  }

  for (; i < length; ++i) {
    options = arguments[i];
    if (options !== null) {
      for (name in options) {
        src = target[name];
        copy = options[name];

        if (target !== copy) {
          if (deep && copy && (util.isPlainObject(copy) || (copyIsArray = util.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && util.isArray(src) ? src : [];
            } else {
              clone = src && util.isPlainObject(src) ? src : {};
            }

            target[name] = util.extend(deep, clone, copy);

          } else if (typeof copy !== 'undefined') {
            target[name] = copy;
          }
        }
      }
    }
  }

  return target;
};

/**
 * @description 返回一个随机的uid
 * @param len {Number} 长度
 * @memberof Inkey.util
 * @function
 */

util.uid = function uid(len) {
  len = len || 7;
  return Math.random().toString(35).substr(2, len);
};

module.exports = util;
