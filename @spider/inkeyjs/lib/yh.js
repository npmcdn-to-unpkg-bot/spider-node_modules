'use strict';

var util = require('./core');

/**
 * 易货APP
 * @namespace Inkey.yh
 */

var yh = module.exports = {};
var IOSCALL = 'H5CALLAPP::';

/**
 * @description 关闭当前 WebView
 * @memberof Inkey.yh
 * @function
 */

yh.closeWebView = function () {
  util.callByEnv(function () {
    return {
      ios: ios,
      android: android
    };

    function ios() {
      location.href = IOSCALL + 'closeWebView';
    }

    function android() {
      H5CALLAPP.callClient(10, '');
    }
  });
};

/**
 * @description 显示商品详情
 * @param type {number} 1:易货
 * @param id {number}
 * @param readonly {number}
 * @memberof Inkey.yh
 * @function
 */

yh.showProduct = function (type, id, readonly) {
  util.callByEnv(function () {
    return {
      ios: ios,
      android: android
    };

    function ios() {
      location.href = IOSCALL + 'showProduct:type=' + type + '&id=' + id + '&readonly=' + readonly;
    }

    function android() {
      var params = {path: '', params: []};
      switch (type) {
        case 1:
          params.path = 'com.mz.mall.enterprise.productdetail.ProductDetailActivity';
          params.params.push({product_code: id});
          break;
      }

      H5CALLAPP.callClient(11, JSON.stringify(params));
    }
  });
};

/**
 * @description 显示商家详情
 * @param type {number} 0:商家、1、运营商
 * @param id {number}
 * @param readonly {number}
 * @memberof Inkey.yh
 * @function
 */

yh.showEnterprise = function (type, id, readonly) {
  util.callByEnv(function () {
    return {
      ios: ios,
      android: android
    };

    function ios() {
      location.href = IOSCALL + 'showEnterprise:type=' + type + '&id=' + id + '&readonly=' + readonly;
    }

    function android() {
      var params = {path: '', params: []};
      switch (type) {
        case 0:
          params.path = 'com.mz.mall.enterprise.business.BusinessMerchantShopActivity';
          params.params.push({org_code: id});
          params.params.push({is_org_detail: true});
          break;
      }

      H5CALLAPP.callClient(11, JSON.stringify(params));
    }
  });
};

/**
 * @description 显示运维内容详情
 * @param code {number}
 * @memberof Inkey.yh
 * @function
 */

yh.showContent = function (code) {
  util.callByEnv(function () {
    return {
      ios: ios,
      android: android
    };

    function ios() {
      location.href = IOSCALL + 'showContent:code=' + code;
    }

    function android() {
      H5CALLAPP.callClient(3, JSON.stringify({
        code: code
      }));
    }
  });
};

/**
 * @description 显示我的账户
 * @param type {number} 3:易货码、4:易货额度
 * @memberof Inkey.yh
 * @function
 */

yh.showMyAccount = function (type) {
  util.callByEnv(function () {
    return {
      ios: ios,
      android: android
    };

    function ios() {
      location.href = IOSCALL + 'showMyAccount:type=' + type;
    }

    function android() {
      var params = {path: '', params: []};
      switch (type) {
        case 3:
          params.path = 'com.mz.mall.mine.trading.MyTradingCurrencyActivity';
          break;
      }

      H5CALLAPP.callClient(11, JSON.stringify(params));
    }
  });
};

/**
 * @summary 自定义内容分享
 * @description
 * 1:新浪微博、2:腾讯微博、3:搜狐微博、4:网易 微博、5:豆瓣社区、6:QQ 空间、7:人人网、8: 开心网、9:朋友网、10:Facebook、
 * 11:Twitter、 12:印象笔记、13:Foursquare、14:Google+、15: Instagram、16:LinkedIn、17:Tumbir、18:邮件分 享、
 * 19:短信分享、20:打印、21:拷贝、22:微信 好友、23:微信朋友圈、24:QQ、25:Instapaper、 26:Pocket、27:有道云笔记、28:搜狐随身看、
 * 30:Pinterest、34:Flickr、35:Dropbox、36: VKontakte、37:微信收藏、38:易信好友、39:易信 朋友圈、40:易信收藏、41:明道、
 * 42:Line、43: Whats App、44:KaKao Talk、45:KaKao Story、99: 任意平台
 * 安卓支持：[1, 6, 18, 19, 22, 23, 24]
 * @param title {String}
 * @param content {String}
 * @param pictureUrl {String}
 * @param clickUrl {String}
 * @param targets {Array} 分享目标数组
 * @memberof Inkey.yh
 * @function
 */

yh.shareByAttr = function (title, content, pictureUrl, clickUrl, targets) {

  targets = targets || [];

  util.callByEnv(function () {
    return {
      ios: ios,
      android: android
    };

    function ios() {
      location.href = IOSCALL + 'shareByAttr:title=' + title + '&content=' + content + '&pictureUrl=' + pictureUrl + '&clickUrl=' + clickUrl + '&targets=' + targets.join(',');
    }

    function android() {
      H5CALLAPP.callClient(4, JSON.stringify({
        title: title,
        content: content,
        pictureUrl: pictureUrl,
        clickUrl: clickUrl,
        targets: targets
      }));
    }
  });
};

/**
 * @summary 标准分享
 * @description
 * 1:新浪微博、2:腾讯微博、3:搜狐微博、4:网易 微博、5:豆瓣社区、6:QQ 空间、7:人人网、8: 开心网、9:朋友网、10:Facebook、
 * 11:Twitter、 12:印象笔记、13:Foursquare、14:Google+、15: Instagram、16:LinkedIn、17:Tumbir、18:邮件分 享、
 * 19:短信分享、20:打印、21:拷贝、22:微信 好友、23:微信朋友圈、24:QQ、25:Instapaper、 26:Pocket、27:有道云笔记、28:搜狐随身看、
 * 30:Pinterest、34:Flickr、35:Dropbox、36: VKontakte、37:微信收藏、38:易信好友、39:易信 朋友圈、40:易信收藏、41:明道、
 * 42:Line、43: Whats App、44:KaKao Talk、45:KaKao Story、99: 任意平台
 * 安卓支持：[1, 6, 18, 19, 22, 23, 24]
 * @param key {String}
 * @param targets {Array} 分享目标数组
 * @memberof Inkey.yh
 * @function
 */

yh.shareByKey = function (key, targets) {
  targets = targets || [];

  util.callByEnv(function () {
    return {
      ios: ios,
      android: android
    };

    function ios() {
      location.href = IOSCALL + 'shareByKey:key=' + key + '&targets=' + targets.join(',');
    }

    function android() {
      H5CALLAPP.callClient(5, JSON.stringify({
        title: title,
        targets: targets
      }));
    }
  });
};

/**
 * @description 进入“消息中心”
 * @memberof Inkey.yh
 * @function
 */

yh.gotoMessageCenter = function () {
  util.callByEnv(function () {
    return {
      ios: ios,
      android: android
    };

    function ios() {
      location.href = IOSCALL + 'gotoMessageCenter';
    }

    function android() {
      H5CALLAPP.callClient(11, JSON.stringify({
        path: 'com.mz.mall.mine.messagecenter.MessageCenterActivity',
        params: []
      }));
    }
  });
};

/**
 * @description 进入第一级功能模块
 * @param index {number} 0:首页、1:分类、2:我
 * @memberof Inkey.yh
 * @function
 */

yh.gotoPrimaryModel = function (index) {
  util.callByEnv(function () {
    return {
      ios: ios,
      android: android
    };

    function ios() {
      location.href = IOSCALL + 'gotoPrimaryModel:index=' + index;
    }

    function android() {
      H5CALLAPP.callClient(11, JSON.stringify({
        path: 'com.mz.mall.main.MainActivity',
        params: [{tabPosition: index}]
      }));
    }
  });
};

/**
 * @summary 进入第二级功能模块
 * @description
 * 首页 - 0:我的订单、1:收藏夹
 * 我 - 0:我的邮寄订单、1:我的兑换订单、2:收货 地址管理、4:关于我们、5:通用设置
 * @param parentIndex {number} 0:首页、1:分类、2:我
 * @param index {number}
 * @memberof Inkey.yh
 * @function
 */

yh.gotoSecondaryModel = function (parentIndex, index) {
  var paths = [
    [
      'com.mz.mall.mine.mailorder.MailOrderHomeActivity', //我的订单
      'com.mz.mall.mine.collectads.AdvertCollectActivity' //收藏夹
    ], [
      //分类无
    ], [
      'com.mz.mall.mine.mailorder.MailOrderHomeActivity', //我的邮寄订单首页
      'com.mz.mall.mine.exchangeorder.MyExchangeOrderActivity',//我的兑换订单
      'com.mz.mall.mine.deliveryaddress.DeliveryAddressManagerActivity',//收获地址管理
      '',
      'com.mz.mall.mine.about.AboutAcitivity',//关于我们
      'com.mz.mall.mine.setting.CommonSettingActivity'//通用设置
    ]
  ];

  util.callByEnv(function () {
    return {
      ios: ios,
      android: android
    };

    function ios() {
      location.href = IOSCALL + 'gotoSecondaryModel:parentIndex=' + parentIndex + '&index=' + index;
    }

    function android() {
      H5CALLAPP.callClient(11, JSON.stringify({
        path: paths[parentIndex][index],
        params: []
      }));
    }
  });
};

/**
 * @description 显示“商品列表”
 * @param categoryId {number}
 * @memberof Inkey.yh
 * @function
 */

yh.showProducts = function (categoryId) {
  util.callByEnv(function () {
    return {
      ios: ios,
      android: android
    };

    function ios() {
      location.href = IOSCALL + 'showProducts:categoryId=' + categoryId;
    }

    function android() {
      H5CALLAPP.callClient(11, JSON.stringify({
        path: 'com.mz.mall.enterprise.business.BusinessClassifyServerActivity',
        params: [{product_code: categoryId}]
      }));
    }
  });
};

/**
 * @description 显示“我所在的商家”
 * @memberof Inkey.yh
 * @function
 */

yh.showMyEnterprise = function () {
  util.callByEnv(function () {
    return {
      ios: ios,
      android: android
    };

    function ios() {
      location.href = IOSCALL + 'showMyEnterprise';
    }

    function android() {
      H5CALLAPP.callClient(11, JSON.stringify({
        path: 'com.mz.mall.enterprise.productmgr.BusinessmanActivity',
        params: []
      }));
    }
  });
};