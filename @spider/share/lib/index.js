'use strict';

require('@spider/zepto');
require('@spider/zepto/src/event');
require('@spider/zepto/src/ajax');
require('@spider/zepto/src/deferred');
require('@spider/zepto/src/callbacks');

var cookieModel = require('@spider/cookieModel');
var guid = require('guid');
var inkeyMZ = require('@spider/inkeyjs/lib/mz');

var userAgent = navigator.userAgent.toLowerCase();
var isIOS = !!userAgent.match(/\(i[^;]+;( u;)? cpu.+mac os x/);
var isWeixin = userAgent.indexOf('micromessenger') > -1;
var iosSignature = false; // IOS已完成签名标记
var httpCache = {}; // 请求缓存对象
var tempLog = null; // 临时的日志参数
var oldSignatureUrl; // 历史签名URL
var _instanceof_; // 实例对象

// 默认分享模式常量值

var SHARE_MODEL = {
  KEY: 'key',
  ATTR: 'attr'
};

// 默认配置

var config = {
  mzAPI: 'https://mzapi.inkey.com/api/',
  wxAPI: 'https://mzmp.inkey.com/',
  wxDebug: false,
  reverseShareCopy: true,
  cleanCacheOnSuccess: true, // 分享成功之后, 是否清空请求缓存
  sessionTokenName: 'ngStorage-token',
  defaultShare: {},
  jsApiList: [
    'onMenuShareTimeline',
    'onMenuShareAppMessage',
    'onMenuShareQQ',
    'onMenuShareWeibo',
    'onMenuShareQZone'
  ],
  shareCallback: function(){}
};

/**
 * 路径拼接
 * @param p1
 * @param p2
 * @example
 * // p2 前缀不能添加 /
 * pathJoin('http://www.inkey.com/', 'api') // http://www.inkey.com/api
 * pathJoin('http://www.inkey.com', 'api') // http://www.inkey.com/api
 */

function pathJoin(p1, p2) {

  var path = p1 + '/' + p2;

  var count = path.match(/\/\/+/g) || [];

  if (count.length === 2) {
    path = p1 + p2;
  }

  return path;
}

/**
 *  配置分享回调方法
 * @param platform 平台
 */

function configShareCallBack(platform) {
  var that = this;
  var cb = that.opt.shareCallback;

  return {
    success: function () {
      that.postShareLog(platform, 2);
      callback('success', platform);
      // 当分享成功之后, 并且属性打开
      // 清空缓存, 下次获取新文案
      if(that.opt.cleanCacheOnSuccess){
        that.cleanCache();
      }
    },
    cancel: function () {
      that.postShareLog(platform, 1);
      callback('cancel', platform);
    },
    fail: function () {
      that.postShareLog(platform, 3);
      callback('fail', platform);
    }
  };

  // 执行自定义回调
  function callback(status, platform){
    switch (platform){
      case 1:
        cb(status, '朋友圈');
        break;
      case 2:
        cb(status, '朋友');
        break;
      case 3:
        cb(status, '腾讯微博');
        break;
      case 4:
        cb(status, 'qq');
        break;
      case 5:
        cb(status, 'qq空间');
        break;
    }
  }
}

/**
 * 分享结束
 */

function shareEnd(){

  // 重新生成guid

  this.shareId = guid.raw();

  // 当guid修改时, 更新分享地址

  this.updateShareLink();
}

///////////////////////
///////////////////////


function Share(opt) {

  var defaultShare;

  // 合并参数到opt

  opt.jsApiList = config.jsApiList.concat(opt.jsApiList || []);

  this.opt = _.extendOwn({}, config, opt);

  // 合并参数到config, 用于还原配置

  _.extendOwn(config, opt);

  // 初始化shareId, 分享成功之后需要重新生成

  this.shareId = guid.raw();

  // 感恩号码

  this.presenterPhone = '';

  // 是否允许更新分享link
  // 该值取决于通过什么方法更新分享内容
  // getShare下该值为: false
  // updateByAttr下该值为: true

  this.enableReConfigShare = false;

  defaultShare = this.opt.defaultShare;

  cookieModel({
    sessionTokenName: config.sessionTokenName
  });

  // 获取感恩链接

  this.getThankfulPhone();

  if (!_.isEmpty(defaultShare.byKey)) {

    this.defaultShareModel = SHARE_MODEL.KEY;

    this.getShare(defaultShare.byKey);

  } else if (!_.isEmpty(defaultShare.byContent)) {

    this.defaultShareModel = SHARE_MODEL.ATTR;

    var byContent = defaultShare.byContent;

    this.updateByAttr(byContent.content);

  } else {
    throw new Error('[分享模块]请设置默认分享');
  }

  this.initWeixinShare();
}

/**
 * 地址参数转换
 * @param link
 */

function convertLink(link){

  _.forEach({
    shareid: this.shareId,
    _thanks_: this.presenterPhone
  }, function(value, key){

    var regExp = new RegExp('(' + key + '=[^&]+)').exec(link);

    if(regExp){
      link = link.replace(regExp[0], key + '=' + value);
    }else{
      if(!_.isEmpty(value)){
        if(link.indexOf('?') !== -1){
          link += '&' + key + '=' + value;
        }else{
          link += '?' + key + '=' + value;
        }
      }
    }
  });

  return link;
}

/**
 * 该底层请求接口支持cookie模式
 * @param method
 * @param url
 * @param params
 * @param options 请求设置
 */

function ajax(method, url, params, options) {

  params = params || {};

  var defer = $.Deferred();
  var cacheId = url + '?' + $.param(params);
  var cache = httpCache[cacheId];

  // 操作缓存

  if(method.toLowerCase() === 'get' && !_.isEmpty(cache)){
    // 直接返回缓存对象
    defer.resolve(cache);
  }else{
    $.ajax($.extend(true, {}, {
      type: method,
      url: url,
      dataType: 'json',
      data: params || {},
      success: function(data){
        defer.resolve(data);
        httpCache[cacheId] = data;
      },
      error: defer.reject
    }, options || {}));
  }

  return defer.promise();
}

/**
 * 微信签名, 该请求无需授权
 * @param url 指定签名URL
 * @returns {*}
 */

function getSignature(url) {
 return this.ajax('GET', pathJoin(this.opt.wxAPI, 'WXCore/JSSignature'), {Url: url || location.href.split('#')[0]});
}

/**
 * 获取感恩电话
 */

function getThankfulPhone() {

  var that = this;
  var count = 0;

  // 异常接口请求, 最多尝试3次
  // 适用于token可能暂时不存在的情况

  _req();

  function _req(){

    count++;

    if(count > 3){
      return false;
    }

    that
      .ajax('GET', pathJoin(that.opt.mzAPI, 'Customer/CheckMemberCampaignLink'))
      .then(function(data){
        count = 0;
        try{
          that.presenterPhone = parseInt(data.Data.PresenterPhone).toString(16);
        }catch(e){
          that.presenterPhone = '';
        }
       
        that.updateShareLink();
      }, function(){
        _req();
      });
  }
}


function getShare(params){

  var that = this;

  params = params || {};

  try{

    // 清除byKey.log
    // 防止请求接口时, 发送多余参数导致缓存失效

    delete that.opt.defaultShare.byKey.log;
  }catch(e){}

  that
    .ajax('GET', pathJoin(that.opt.mzAPI, 'Share/GetShare'), params, {
      headers: {
        'Compatible-LongType': true // long 转 string
      }
    })
    .then(function(data){
      data = data.Data;

      that.updateByAttr({
        desc: data.Content,
        title: data.Title,
        link: data.ClickUrl,
        imgUrl: data.PictureUrl
      });

      try{
        // 一定要放到updateByAttr后面
        // updateByAttr会清除byKey.log对象
        that.opt.defaultShare.byKey.log = data;
      }catch(e){
        that.opt.defaultShare.byKey = {
          log: data
        }
      }

      that.enableReConfigShare = false;
    });
}

/**
 * 发送分享日志到后端
 * @param platform 分享平台
 * @param shareStatus 分享状态
 * @returns {*}
 */

function postShareLog(platform, shareStatus) {

  var that = this;
  var params = {};
  var byContent = that.opt.defaultShare.byContent || {};
  var byKey = that.opt.defaultShare.byKey || {};
  var log = tempLog || byKey.log || byContent.log;

  if(_.isEmpty(log)){
    return false;
  }

  params.Key = log.Key;
  params.RefType = log.RefType;
  params.Platform = platform;
  params.UsePlatform = 3;
  params.ShareStatus = shareStatus;
  params.RefCode = log.RefCode;
  params.RefId = log.RefId;
  params.RefName = log.RefName;
  params.ShareId = log.ShareId || that.shareId;
  params.RefUrl = location.href;

  that
    .ajax('POST', pathJoin(that.opt.mzAPI, 'Share/SendShareData'), params, {
      headers: {
        'Compatible-LongType': true // long 转 string
      }
    })
    .then(shareEnd.bind(that), shareEnd.bind(that));
}


/**
 * 微信签名方法
 * IOS只在APP初始化时执行一次签名
 * Android初始化时用当前路由签名, 之后用成功签名的缓存URL签名 如果监听失败, 则用当前地址再次签名一次
 * 如果当前页面2次签名异常 便不会再次签名
 * (安卓需要兼容不同的微信版本, 所以要这么做)
 */

function signature(url) {
  var that = this;
  var count = 0;

  if(!isWeixin){
    return false;
  }

  // 缓存URL, 最新版本安卓需要使用该URL签名

  if (!oldSignatureUrl) {
    oldSignatureUrl = url;
  }

  _req(oldSignatureUrl);

  function _req(url) {

    count++;

    // 当该页面记次达到3次 或者 (iosSignature === true 并且是 IOS)
    // 则不允许再次调用签名

    if (count > 3 || (iosSignature && isIOS)) {
      return false;
    }

    that
      .getSignature(url)
      .then(function (data) {

        //  // 标记IOS 防止IOS切换页面 再次签名
        if (isIOS) {
          iosSignature = true;
        }

        data = data.Data;

        wx.config({
          appId: data.AppId,
          debug: that.opt.wxDebug,
          nonceStr: data.NonceStr,
          timestamp: data.TimeStamp,
          signature: data.Signature,
          jsApiList: that.opt.jsApiList
        });

        // 监听到异常 用当前URL重新发起签名
        // 这种情况会出现在Android低版本中
        wx.error(function (res) {
          if (res.errMsg === 'config:invalid signature') {
            _req();
          }
        });
      });
  }
}


/**
 * 更新分享链接
 * @param share
 */

function updateShareLink(){

  var that = this;
  var weixin = that.weixin;

  if(!that.enableReConfigShare){
    return false;
  }

  _.forEach(weixin, function(share){
    share.link = that.convertLink(share.link);
  });
}

/**
 * 初始化微信分享
 */

function initWeixinShare() {
  var that = this;

  // 微信签名
  that.signature(location.href.split('#')[0]);

  wx.ready(that.reConfigShare.bind(that));
}


/**
 * 重置分享配置
 */

function reConfigShare() {

  var weixin = this.weixin;

  // 防止配置为空导致异常处理
  
  if(_.isEmpty(weixin)){
    return false;
  }

  // 绑定回调

  _.extend(weixin.tlShare, configShareCallBack.call(this, 1));
  _.extend(weixin.amShare, configShareCallBack.call(this, 2));
  _.extend(weixin.wbShare, configShareCallBack.call(this, 3));
  _.extend(weixin.qqShare, configShareCallBack.call(this, 4));
  _.extend(weixin.qzShare, configShareCallBack.call(this, 5));

  wx.onMenuShareQQ(weixin.qqShare);
  wx.onMenuShareWeibo(weixin.wbShare);
  wx.onMenuShareQZone(weixin.qzShare);
  wx.onMenuShareTimeline(weixin.tlShare);
  wx.onMenuShareAppMessage(weixin.amShare);

  // 当前模式是自定义参数时, 更新分享link 添加额外参数

  this.updateShareLink();
}

/**
 * 通过Key更新
 * @param params
 */

function updateByKey(params) {

  params = params || {};

  if(_.isEmpty(params.key)){
    try{
      params.key = this.opt.defaultShare.byKey.key;
    }catch(e){
      throw new Error('[分享模块]如果不指定key, 请设置默认key');
    }
  }

  this.getShare(params);
}

/**
 * app按钮分享
 * @param params
 * @param log 日志对象, 可空
 * @example
 * share.btnShare({
 *   title: '',
 *   desc: '',
 *   imgUrl: '',
 *   link: '',
 *   target: [1, 6]
 * });
 */

function btnShare(params, log) {

  params = params || {};

  var content;
  var that = this;
  var byKey = that.opt.defaultShare.byKey || {};
  var target = [1, 6, 18, 19, 22, 23, 24];

  try{
    content = byKey.log || this.weixin.amShare;
  }catch(e){
    content = {};
  }

  // 如有是自定义链接 需要添加额外参数

  if(!_.isEmpty(params.link)){
    params.link = that.convertLink(params.link);
  }

  inkeyMZ.shareByAttr(
    params.title || content.Title || content.title,
    params.desc || content.Content || content.desc,
    params.imgUrl || content.PictureUrl || content.imgUrl,
    params.link || content.ClickUrl || content.link,
    params.target || target,
    log.Key || content.Key || '',
    log.RefType || content.RefType || '',
    log.RefCode || content.RefCode || '',
    log.RefId || content.RefId || '',
    log.RefName || content.RefName || '',
    log.ShareId || content.ShareId || that.shareId
  );

  // 当分享成功之后, 并且属性打开
  // 清空缓存, 下次获取新文案
  if(that.opt.cleanCacheOnSuccess){
    that.cleanCache();
  }
}


/**
 *  通过自定义参数更新
 */

function updateByAttr(share, log) {

  share = share || {};

  var oldShare = (this.weixin && this.weixin.qqShare) || {};
  var newShare = {
    desc: share.desc || oldShare.desc,
    title: share.title || oldShare.title,
    link: share.link || oldShare.link,
    imgUrl: share.imgUrl || oldShare.imgUrl
  };
  var tlShare = _.clone(newShare);

  if(this.opt.reverseShareCopy){
    var title = tlShare.title;
    var desc = tlShare.desc;

    // 将朋友圈的分享文案反转
    // 标题 = 内容
    // 内容 = 标题

    tlShare.title = desc;
    tlShare.desc = title;
  }

  // 如果log存在

  if(_.isEmpty(log)){
    tempLog = null;
  }else{
    tempLog = log;
  }

  // try{

  //   // 清除byKey.log
  //   // 如果需要通过其他方法设置 比如 getShare

  //   this.opt.defaultShare.byKey.log = null;
  // }catch(e){}

  this.enableReConfigShare = true;

  this.weixin = {
    qqShare: _.clone(newShare),
    wbShare: _.clone(newShare),
    qzShare: _.clone(newShare),
    tlShare: tlShare,
    amShare: _.clone(newShare)
  };

  this.reConfigShare();
}

/**
 * 还原默认分享
 */

function revertDefault() {

  var that = this;
  var defaultShare = config.defaultShare;

  if(that.defaultShareModel === SHARE_MODEL.ATTR){
    that.updateByAttr(defaultShare.byContent.content);
  }else{
    that.updateByKey(defaultShare.byKey);
  }
}

/**
 * 清除请求缓存
 */

function cleanCache() {
  httpCache = {};
}

module.exports = function(opt){
  if(_instanceof_ === undefined){
    _instanceof_ = new Share(opt);
  }
  return _instanceof_;
};

// 底层方法
Share.prototype.reConfigShare = reConfigShare;
Share.prototype.initWeixinShare = initWeixinShare;
Share.prototype.updateShareLink = updateShareLink;
Share.prototype.convertLink = convertLink;
Share.prototype.postShareLog = postShareLog;
Share.prototype.ajax = ajax;
Share.prototype.getSignature = getSignature;
Share.prototype.getThankfulPhone = getThankfulPhone;
Share.prototype.getShare = getShare;

// 常用方法
Share.prototype.updateByAttr = updateByAttr;
Share.prototype.updateByKey = updateByKey;
Share.prototype.btnShare = btnShare;
Share.prototype.revertDefault = revertDefault;
Share.prototype.cleanCache = cleanCache;
Share.prototype.signature = signature;

