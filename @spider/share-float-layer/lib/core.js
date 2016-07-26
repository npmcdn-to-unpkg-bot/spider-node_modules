'use strict';

/**
 * 工具类
 * @namespace ShareFloatLayer
 */
var util = {};
var ua = window.navigator.userAgent;
var search = window.location.search;

/**
 * @description 当前版本号
 * @memberof ShareFloatLayer
 * @type {string}
 */

util.version = '2.0.4';

/**
 * @description 判断是否是IOS
 * @memberof ShareFloatLayer
 * @type {boolean}
 */

util.isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

/**
 * @description 判断是否是Android
 * @memberof ShareFloatLayer
 * @type {boolean}
 */

util.isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1;

/**
 * @description 判断是否是微信
 * @memberof ShareFloatLayer
 * @type {boolean}
 */
util.isWeixin = !!ua.match(/MicroMessenger/i);


/**
 * @description 获取地址栏参数列表
 * @example
 * // url: http://www.example.com?key1=1&key2=2
 * var params = ShareFloatLayer.util.search();
 * params => {key1: 1, key2: 2}
 * @memberof ShareFloatLayer
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
 * @description 返回设备编号
 * @memberof ShareFloatLayer
 * @return {Int} 返回一个设备类型 0 = IOS, 1 = Android, -1 = 未匹配
 */
util.getDevicesCode = function () {
    var bIsIpad = navigator.userAgent.match(/ipad/i),
        bIsIphoneOs = navigator.userAgent.match(/iphone os/i),
        bIsAndroid = navigator.userAgent.match(/android/i);
    if ((bIsIpad && bIsIpad.toString().toLowerCase() === 'ipad') || (bIsIphoneOs && bIsIphoneOs.toString().toLowerCase() === 'iphone os')) {
        return 0;
    } else if (bIsAndroid && bIsAndroid.toString().toLowerCase() === 'android') {
        return 1;
    }
    return -1;
}

/**
 * @description 判断是否是微信浏览器
 * @memberof ShareFloatLayer
 * @returns {boolean}
 */
util.isWeixn = function () {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    }
    return false;
}

/**
 * @description 获取URL参数
 * @param key
 * @memberof ShareFloatLayer
 * @returns {String} 如果没有则返回null
 */
util.getQueryString = function (key) {
    if (key) {
        var reg = new RegExp('(^|&|\\?)' + key + '=([^&]*)(&|$)'),array = location.search.match(reg);
        return array ? decodeURIComponent(array[2]) : '';
    }
    return '';
}

module.exports = {
    util:util
};
