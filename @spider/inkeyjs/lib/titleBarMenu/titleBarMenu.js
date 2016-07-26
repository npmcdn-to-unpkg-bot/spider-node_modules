'use strict';

// 初始化项, 默认配置
var initItem, defOpt, opts, menuEle, iconEles, menuUlEle;
var menuDivId = 'inkeyjs-title-bar-menu';

var util = require('../core');

// 菜单是否显示标记

var showFlag = false;

defOpt = {
  className: '',
  style: {
    width: 130,
    iconWidth: 25,
    fontSize: 15,
    posTop: 8
  },
  item: []
};

/**
 * titleBar菜单
 * @namespace Inkey.titleBarMenu
 */

var titleBarMenu = module.exports = {};

_init();

/**
 * 内部初始化
 */

function _init() {
  var template = __inline('./app.html');
  var style = __inline('./app.styl');
  var styleEle = document.createElement('style');

  titleBarMenu.item = [];

  // 设置样式属性

  styleEle.type = 'text/css';
  styleEle.innerHTML = style;

  // 初始化菜单样式

  document.getElementsByTagName('head')[0].appendChild(styleEle);

  // 将菜单模版添加到body中

  document.body.innerHTML = document.body.innerHTML + template;

  menuEle = document.getElementById(menuDivId);
  menuUlEle = document.querySelector('#' + menuDivId + ' ul');

  // 防止冒泡关闭

  menuEle.addEventListener('touchend', function (e) {
    e.stopPropagation();
  }, false);

}

/**
 * 设置样式
 */

function _setStyle() {
  var sty = opts.style;

  // 获取所有图标

  iconEles = document.querySelectorAll('#' + menuDivId + ' .icon');

  // 设置容器样式

  menuEle.style.fontSize = ( sty.fontSize ? sty.fontSize : defOpt.style.fontSize ) + 'px';
  menuEle.style.width = ( sty.width ? sty.width : defOpt.style.width ) + 'px';
  menuEle.style.top = ( sty.posTop ? sty.posTop : defOpt.style.posTop ) + 'px';

  // 设置icon样式

  for (var i = 0; i < iconEles.length; i++) {
    iconEles[i].style.width = ( sty.iconWidth ? sty.iconWidth : defOpt.style.iconWidth ) + 'px';
  }
}

/**
 * 绑定事件
 */

function _bindEvent(ele, item) {
  var temp = item.callback || util.noop;

  item.callback = function (e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    temp(item);
    hide();
  };

  // 绑定移除事件

  _bindEventRemove(item);

  // 绑定显示事件

  _bindEventShow(item);

  // 绑定隐藏事件

  _bindEventHide(item);

  // 绑定回调方法

  ele.addEventListener('touchend', item.callback, false);
}

/**
 * 创建li元素
 */

function _createLiEle(item) {
  var imgEle;
  var liEle = document.createElement('li');
  var spanEle = document.createElement('span');

  liEle.className = item.uid = 'A_' + util.uid(7);

  if (item.icon) {
    imgEle = document.createElement('img');
    imgEle.src = item.icon;
    imgEle.className = 'icon';
    liEle.appendChild(imgEle);
  }

  spanEle.innerText = item.title;
  liEle.appendChild(spanEle);

  // 为item设置ele属性 便于直接拿到元素对象

  item.element = liEle;

  titleBarMenu.item.push(item);

  // 绑定事件

  _bindEvent(liEle, item);

  return liEle;
}


/**
 * 根据uid查找元素下标
 */

function _findIndex(value) {
  var item = titleBarMenu.item;
  var index = 0;
  for (var i = 0; i < item.length; i++, index++) {
    if (item[i].uid === value) {
      break;
    }
  }
  return index;
}

/**
 * 移除元素
 */

function _removeEle(item) {
  var ele = item.element;
  var _parentElement = ele.parentNode;

  ele.removeEventListener('touchend', item.callback);

  if (_parentElement) {
    _parentElement.removeChild(ele);
  }
}

/**
 * 移除item
 */

function _removeItem(items) {
  if (util.isArray(items)) {
    for (var i = 0; i < items.length; i++) {
      _removeEle(items[i]);
    }

    titleBarMenu.item = [];

  } else {
    _removeEle(items);

    // 从集合中移除选项

    titleBarMenu.item.splice(_findIndex(items.uid), 1);
  }
}

/**
 * 针对item绑定移除事件
 */

function _bindEventRemove(item) {
  item.remove = function () {
    _removeItem(item);
  };
}

/**
 * 针对item绑定显示事件
 */

function _bindEventShow(item) {
  item.show = function () {
    item.element.style.display = 'block';
  };
}

/**
 * 针对item绑定隐藏事件
 */

function _bindEventHide(item) {
  item.hide = function () {
    item.element.style.display = 'none';
  };
}

/**
 * 点击body之后触发
 */

function _bodyEvent(e) {
  e.preventDefault();
  hide();
}

/**
 * @description 菜单初始化
 * @example
 * Inkey.titleBarMenu.init({
   * // 在最外层添加class
   * className: '',
   *  style: {
  width: 130,
  iconWidth: 25,
  fontSize: 15,
  // 距离窗口顶部高度
  posTop: 8
 },
 item: [
   {
     title: '刷新',
     icon: 'http://www.iconpng.com/png/flatastic1/briefcase.png',
     callback: function (item) {
       window.location.reload();
     }
   }
 ]
   * })
 * @param opt {Object}
 * @memberof Inkey.titleBarMenu
 * @function
 */

function init(opt) {
  opt = opt || {};

  // 合并配置

  opts = util.extend(true, defOpt, opt);

  initItem = util.extend(true, opts.item);

  // 添加项

  addItem(opts.item);

  // 如果初始化有class则加入到标签上

  if (opts.className) {
    menuEle.className = opts.className;
  }
}

/**
 * @description 显示菜单
 * @memberof Inkey.titleBarMenu
 * @param indexs {Array} 可空, 该参数传入项的下标, 实现批量显示
 * @function
 */

function show(indexs) {
  if (util.isArray(indexs)) {
    for (var i = 0; i < indexs.length; i++) {
      titleBarMenu.item[indexs[i]].show();
    }
  } else {
    if (showFlag) {
      hide();
      return false;
    }

    showFlag = true;
    menuEle.style.display = 'block';
    document.body.addEventListener('touchend', _bodyEvent, false);
  }
}

/**
 * @description 隐藏菜单
 * @memberof Inkey.titleBarMenu
 * @param indexs {Array} 可空, 该参数传入项的下标, 实现批量隐藏
 * @function
 */

function hide(indexs) {
  if (util.isArray(indexs)) {
    for (var i = 0; i < indexs.length; i++) {
      titleBarMenu.item[indexs[i]].hide();
    }
  } else {
    showFlag = false;
    menuEle.style.display = 'none';
    document.body.removeEventListener('touchend', _bodyEvent);
  }
}

/**
 * @description 添加菜单项
 * @example
 * Inkey.titleBarMenu.addItem(
 [
 {
   title: '刷新',
   icon: 'http://www.iconpng.com/png/flatastic1/briefcase.png',
   callback: function (item) {
     window.location.reload();
   }
 }
 ]
 * )
 * @param items {Object|Array}
 * @memberof Inkey.titleBarMenu
 * @function
 */

function addItem(items) {

  var oFragment = document.createDocumentFragment();

  if (util.isArray(items)) {
    for (var i = 0; i < items.length; i++) {
      oFragment.appendChild(_createLiEle(items[i]));
    }
  } else {
    oFragment.appendChild(_createLiEle(items));
  }

  menuUlEle.appendChild(oFragment);

  // 设置样式

  _setStyle();
}

/**
 * @description 重置菜单到初始化状态
 * @memberof Inkey.titleBarMenu
 * @function
 */

function revert() {

  _removeItem(titleBarMenu.item);

  // 添加项

  addItem(initItem);
}


/**
 * @description 入口方法(控制三个点是否显示)
 * @param isShow {Boolean} 是否显示
 * @default false
 * @memberof Inkey.titleBarMenu
 * @function
 */

function entry(isShow) {
  isShow = isShow ? isShow : false;

  util.callByEnv(function () {
    return {
      iosMiaoZhuan: iosMiaoZhuan,
      androidMiaoZhuan: androidMiaoZhuan,
      other: other
    };

    function other() {
      Inkey.titleBarMenuEntry(isShow);
    }

    function iosMiaoZhuan() {
      window.location.href = 'inkey://titleBarMenu?show=' + (isShow ? 1 : 0);
    }

    function androidMiaoZhuan() {
      H5CALLAPP.showMenu(isShow ? 1 : 0);
    }
  });

}

titleBarMenu.entry = entry;
titleBarMenu.init = init;
titleBarMenu.show = show;
titleBarMenu.hide = hide;
titleBarMenu.revert = revert;
titleBarMenu.addItem = addItem;
