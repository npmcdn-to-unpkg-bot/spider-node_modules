'use strict';

angular
  .module('ink')
  .factory('param', param)
  .factory('dialog', dialog)
  .factory('loading', loading);

/**
 * 序列化对象
 * @memberof services#
 * @example
 * var obj = {a:1, b:2};
 * param(obj); // a=1&b=2
 */

function param() {
  return $.param;
}

/**
 * 弹窗加载
 * @memberof services#
 */

function loading() {
  return $.loading;
}

/**
 * 弹窗
 * @memberof services#
 */

function dialog() {
  return $.dialog;
}