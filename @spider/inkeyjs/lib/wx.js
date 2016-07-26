'use strict';

/**
 * 微信秒赚
 * @namespace Inkey.wx
 */

var wx = module.exports = {};

/**
 * @description 可在开发时设置该host 已完成跳转相应环境
 * @memberof Inkey.wx
 * @type {string}
 */

wx.host = 'https://h5.inkey.com/';

/**
 * @description 微信项目的目录名称
 * @memberof Inkey.wx
 * @type {string}
 */

wx.appName = 'weixin';

/**
 * @summary 路径跳转
 * @param path {string} 相对于host与appName之后的路径
 * @param back {boolean|string} 可为空。boolean: 将当前路径作为回调地址 string: 将传入的路径作为回调地址
 * @memberof Inkey.wx
 * @function
 */

wx.redirect = redirect;

/**
 * @description 首页
 * @param back {boolean|string} 可为空。boolean: 将当前路径作为回调地址 string: 将传入的路径作为回调地址
 * @memberof Inkey.wx
 * @function
 */

wx.index = redirect.bind(null, '/index');

/**
 * @description 购买用户VIP
 * @param back {boolean|string} 可为空。boolean: 将当前路径作为回调地址 string: 将传入的路径作为回调地址
 * @memberof Inkey.wx
 * @function
 */

wx.userVipBuy = redirect.bind(null, '/userVip/buy');

/**
 * @description 个人认证首页
 * @param back {boolean|string} 可为空。boolean: 将当前路径作为回调地址 string: 将传入的路径作为回调地址
 * @memberof Inkey.wx
 * @function
 */

wx.verifyIndex = redirect.bind(null, '/verify/index');

/**
 * @description 临时用户绑定
 * @param back {boolean|string} 可为空。boolean: 将当前路径作为回调地址 string: 将传入的路径作为回调地址
 * @memberof Inkey.wx
 * @function
 */

wx.verifyPhoneInput = redirect.bind(null, '/verify/phone/input');

/**
 * @description 感恩首页
 * @param back {boolean|string} 可为空。boolean: 将当前路径作为回调地址 string: 将传入的路径作为回调地址
 * @memberof Inkey.wx
 * @function
 */

wx.userThanksIndex = redirect.bind(null, '/userThanks/index');

// 获取完整host

function getHost() {

  if (wx.host.substr(-1) !== '/') {
    wx.host += '/';
  }

  return wx.host + wx.appName;
}

function redirect(path, back) {

  var url = getHost() + path;

  if (back) {
    if ('[object String]' === toString.call(back)) {
      url += '?custom_return_url=' + encodeURIComponent(back);
    } else {
      url += '?custom_return_url=' + encodeURIComponent(location.href);
    }
  }

  location.href = url;

}