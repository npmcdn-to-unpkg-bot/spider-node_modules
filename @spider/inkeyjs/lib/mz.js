'use strict';

var util = require('./core');

/**
 * 秒赚APP
 * @namespace Inkey.mz
 */

var mz = module.exports = {};
var IOSCALL = 'H5CALLAPP::';


/**
 * @description 银元竞猜
 * @param ens {Boolean} 是否直接进入“投注号码选择Fragment”
 * @memberof Inkey.mz
 * @function
 */

mz.silverLottery = function (ens) {
  util.callByEnv(function () {
    return {
      androidMiaoZhuan: android
    };

    function android() {
      H5CALLAPP.callClient(11, JSON.stringify({
        path: 'com.zdit.advert.watch.lottery.LotteryMainActivity',
        params: [{
          enter_num_selection: ens
        }]
      }));
    }
  });
};

/**
 * @description 购买用户VIP
 * @memberof Inkey.mz
 * @function
 */

mz.buyCustomerVIP = function () {
  util.callByEnv(function () {
    return {
      iosMiaoZhuan: ios,
      ios: ios,
      androidMiaoZhuan: android
    };

    function ios() {
      location.href = IOSCALL + 'buyCustomerVIP';
    }

    function android() {
      H5CALLAPP.callClient(11, JSON.stringify({
        path: 'com.zdit.advert.watch.uservip.UserVipActivity',
        params: []
      }));
    }
  });
};

/**
 * @description 购买商家VIP
 * @memberof Inkey.mz
 * @function
 */

mz.buyEnterpriseVIP = function () {
  util.callByEnv(function () {
    return {
      iosMiaoZhuan: ios,
      ios: ios,
      androidMiaoZhuan: android
    };

    function ios() {
      location.href = IOSCALL + 'buyEnterpriseVIP';
    }

    function android() {
      H5CALLAPP.callClient(7, '');
    }
  });
};

/**
 * @description 购买金币
 * @memberof Inkey.mz
 * @function
 */

mz.buyGold = function () {
  util.callByEnv(function () {
    return {
      iosMiaoZhuan: ios,
      ios: ios,
      androidMiaoZhuan: android
    };

    function ios() {
      location.href = IOSCALL + 'buyGold';
    }

    function android() {
      H5CALLAPP.callClient(8, '');
    }
  });
};

/**
 * @description 关闭当前 WebView
 * @memberof Inkey.mz
 * @function
 */

mz.closeWebView = function () {
  util.callByEnv(function () {
    return {
      iosMiaoZhuan: ios,
      ios: ios,
      androidMiaoZhuan: android
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
 * @description 购买感恩果
 * @memberof Inkey.mz
 * @function
 */

mz.buyThanksgivingFruit = function () {
  util.callByEnv(function () {
    return {
      iosMiaoZhuan: ios,
      ios: ios,
      androidMiaoZhuan: android
    };

    function ios() {
      location.href = IOSCALL + 'buyThanksgivingFruit';
    }

    function android() {
      H5CALLAPP.callClient(11, JSON.stringify({
        path: 'com.zdit.advert.watch.uservip.TankfulFruitActivity',
        params: []
      }));
    }
  });
};

/**
 * @description 显示商品详情
 * @param type {number} 0:兑换、1:易货、2:直购、3:秒兑
 * @param id {number}
 * @param advertId {number}
 * @param readonly {number}
 * @memberof Inkey.mz
 * @function
 */

mz.showProduct = function (type, id, advertId, readonly) {
  util.callByEnv(function () {
    return {
      iosMiaoZhuan: ios,
      ios: ios,
      androidMiaoZhuan: android
    };

    function ios() {
      location.href = IOSCALL + 'showProduct:type=' + type + '&id=' + id + '&advertId=' + advertId + '&readonly=' + readonly;
    }

    function android() {
      var params = {path: '', params: []};
      switch (type) {
        case 0:
          params.path = 'com.zdit.advert.watch.store.productdetails.SilverProductDetailActivity';
          params.params.push({product_id_key: id});
          params.params.push({advert_id_key: advertId});
          params.params.push({silver_type_key: true});
          break;
        case 1:
          params.path = 'com.mz.mall.enterprise.productdetail.ProductDetailActivity';
          params.params.push({product_code: id});
          break;
        case 3:
          params.path = 'com.zdit.advert.watch.store.productdetails.SilverProductDetailActivity';
          params.params.push({product_id_key: id});
          params.params.push({advert_id_key: advertId});
          params.params.push({silver_type_key: false});
          break;
      }

      H5CALLAPP.callClient(11, JSON.stringify(params));
    }
  });
};

/**
 * @description 显示商家详情
 * @param type {number}
 * @param id {number}
 * @param readonly {number}
 * @memberof Inkey.mz
 * @function
 */

mz.showEnterprise = function (type, id, readonly) {
  util.callByEnv(function () {
    return {
      iosMiaoZhuan: ios,
      ios: ios,
      androidMiaoZhuan: android
    };

    function ios() {
      location.href = IOSCALL + 'showEnterprise:type=' + type + '&id=' + id + '&readonly=' + readonly;
    }

    function android() {
      H5CALLAPP.callClient(11, JSON.stringify({
        path: 'com.zdit.advert.watch.businessdetail.BusinessDetailActivity',
        params: [{enterprise_id: id}]
      }));
    }
  });
};

/**
 * @description 显示广告详情
 * @param type {number} 0:银元、1:红包、2:公益、3:首页竞价
 * @param id {number}
 * @param readonly {number}
 * @memberof Inkey.mz
 * @function
 */

mz.showAdvert = function (type, id, readonly) {
  util.callByEnv(function () {
    return {
      iosMiaoZhuan: ios,
      ios: ios,
      androidMiaoZhuan: android
    };

    function ios() {
      location.href = IOSCALL + 'showEnterprise:type=' + type + '&id=' + id + '&readonly=' + readonly;
    }

    function android() {
      var params = {path: '', params: []};
      switch (type) {
        case 0:
          params.path = 'com.zdit.advert.watch.WatchNormalAdvertDetailActivity';
          params.params.push({advert_id: id});
          break;
        case 1:
          params.path = 'com.zdit.advert.watch.redpacket.RedPacketAdvertDetailActivity';
          params.params.push({red_packet_id: id});
          break;
        case 2:
          params.path = 'com.zdit.advert.watch.WatchPublicAdvertDetailActivity';
          params.params.push({advert_id: id});
          break;
        case 3:
          params.path = 'com.zdit.advert.main.BindBannerActivity';
          params.params.push({bind_banner_id: id});
          break;
      }

      H5CALLAPP.callClient(11, JSON.stringify(params));
    }
  });
};

/**
 * @description 显示运维内容详情
 * @param code {number}
 * @memberof Inkey.mz
 * @function
 */

mz.showContent = function (code) {
  util.callByEnv(function () {
    return {
      iosMiaoZhuan: ios,
      ios: ios,
      androidMiaoZhuan: android
    };

    function ios() {
      location.href = IOSCALL + 'showContent:code=' + code;
    }

    function android() {
      H5CALLAPP.callClient(11, JSON.stringify({
        path: 'com.mz.platform.common.WebViewActivity',
        params: [{urlKey: code}]
      }));
    }
  });
};

/**
 * @description 显示我的账户
 * @param type {number} 0:银元、1:现金、2:金币
 * @memberof Inkey.mz
 * @function
 */

mz.showMyAccount = function (type) {
  util.callByEnv(function () {
    return {
      iosMiaoZhuan: ios,
      ios: ios,
      androidMiaoZhuan: android
    };

    function ios() {
      location.href = IOSCALL + 'showMyAccount:type=' + type;
    }

    function android() {
      var params = {path: '', params: []};
      switch (type) {
        case 0:
          params.path = 'com.zdit.advert.mine.silver.MySilverActivity';
          break;
        case 1:
          params.path = 'com.zdit.advert.mine.money.MyMoneyHomeActivity';
          break;
        case 2:
          params.path = 'com.zdit.advert.mine.gold.GoldActivity';
          break;
      }

      H5CALLAPP.callClient(11, JSON.stringify(params));
    }
  });
};

/**
 * @description 发布广告
 * @param type {number} 0:银元、1:红包、2:公益(暂未开发)
 * @memberof Inkey.mz
 * @function
 */

mz.publishAdvert = function (type) {
  util.callByEnv(function () {
    return {
      iosMiaoZhuan: ios,
      ios: ios,
      androidMiaoZhuan: android
    };

    function ios() {
      location.href = IOSCALL + 'publishAdvert:type=' + type;
    }

    function android() {
      var params = {path: '', params: []};
      switch (type) {
        case 0:
          params.path = 'com.zdit.advert.publish.advertmanagepublish.SilverAdvertPublishAndManageHomeActivity';
          break;
        case 1:
          params.path = 'com.zdit.advert.publish.redpacketadvert.RedPacketAdvertMainActivity';
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
 * @param Key {String} 分享的Key
 * @param RefType {Int} 分享类型
 * @param RefCode {Long} 关联编号，没有则为0
 * @param RefId {String} 关联ID
 * @param RefName {String} 关联名称
 * @param ShareId {String} 分享编号（Guid型）
 * @memberof Inkey.mz
 * @function
 */

mz.shareByAttr = function (title, content, pictureUrl, clickUrl, targets, Key, RefType, RefCode, RefId, RefName, ShareId) {

  targets = targets || [];

  util.callByEnv(function () {
    return {
      iosMiaoZhuan: ios,
      ios: ios,
      androidMiaoZhuan: android
    };

    function ios() {
      location.href = IOSCALL +
        'shareByAttr:title=' + title +
        '&content=' + content +
        '&pictureUrl=' + pictureUrl +
        '&clickUrl=' + clickUrl +
        '&targets=' + targets.join(',') +
        '&Key=' + Key +
        '&RefType=' + RefType +
        '&RefCode=' + RefCode +
        '&RefId=' + RefId +
        '&RefName=' + RefName +
        '&ShareId=' + ShareId;
    }

    function android() {
      H5CALLAPP.callClient(4, JSON.stringify({
        title: title,
        content: content,
        pictureUrl: pictureUrl,
        clickUrl: clickUrl,
        targets: targets,
        Key: Key,
        RefType: RefType,
        RefCode: RefCode,
        RefId: RefId,
        RefName: RefName,
        ShareId: ShareId
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
 * @memberof Inkey.mz
 * @function
 */

mz.shareByKey = function (key, targets) {
  targets = targets || [];

  util.callByEnv(function () {
    return {
      iosMiaoZhuan: ios,
      ios: ios,
      androidMiaoZhuan: android
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
 * @memberof Inkey.mz
 * @function
 */

mz.gotoMessageCenter = function () {
  util.callByEnv(function () {
    return {
      iosMiaoZhuan: ios,
      ios: ios,
      androidMiaoZhuan: android
    };

    function ios() {
      location.href = IOSCALL + 'gotoMessageCenter';
    }

    function android() {
      H5CALLAPP.callClient(11, JSON.stringify({
        path: 'com.mz.mall.mine.messagecenter.MessageCenterMainActivity',
        params: []
      }));
    }
  });
};

/**
 * @description 进入“推荐商家”
 * @memberof Inkey.mz
 * @function
 */

mz.gotoTopEnterprise = function () {
  util.callByEnv(function () {
    return {
      iosMiaoZhuan: ios,
      ios: ios,
      androidMiaoZhuan: android
    };

    function ios() {
      location.href = IOSCALL + 'gotoTopEnterprise';
    }

    function android() {
      H5CALLAPP.callClient(11, JSON.stringify({
        path: 'com.zdit.advert.watch.searchmerchant.SearchResultActivity',
        params: []
      }));
    }
  });
};

/**
 * @description 进入“商城”
 * @param type {number} 0:兑换、1:易货、2:直购
 * @memberof Inkey.mz
 * @function
 */

mz.gotoMall = function (type) {
  util.callByEnv(function () {
    return {
      iosMiaoZhuan: ios,
      ios: ios,
      androidMiaoZhuan: android
    };

    function ios() {
      location.href = IOSCALL + 'gotoMall:type=' + type;
    }

    function android() {
      H5CALLAPP.callClient(11, JSON.stringify({
        path: 'com.zdit.advert.watch.store.StoreMainActivity',
        params: [{tabShopPosition: type}]
      }));
    }
  });
};

/**
 * @description 进入“感恩分享”
 * @memberof Inkey.mz
 * @function
 */

mz.gotoThanksgivingShare = function () {
  util.callByEnv(function () {
    return {
      iosMiaoZhuan: ios,
      ios: ios,
      androidMiaoZhuan: android
    };

    function ios() {
      location.href = IOSCALL + 'gotoThanksgivingShare';
    }

    function android() {
      H5CALLAPP.callClient(11, JSON.stringify({
        path: 'com.zdit.advert.mine.thx.ThxShareActivity',
        params: []
      }));
    }
  });
};

/**
 * @description 进入第一级功能模块
 * @param index {number} 0:看广告、1:发广告、2:我
 * @memberof Inkey.mz
 * @function
 */

mz.gotoPrimaryModel = function (index) {
  util.callByEnv(function () {
    return {
      iosMiaoZhuan: ios,
      ios: ios,
      androidMiaoZhuan: android
    };

    function ios() {
      location.href = IOSCALL + 'gotoPrimaryModel:index=' + index;
    }

    function android() {
      H5CALLAPP.callClient(11, JSON.stringify({
        path: 'com.zdit.advert.main.MainActivity',
        params: [{tabPosition: index}]
      }));
    }
  });
};

/**
 * @summary 进入第二级功能模块
 * @description
 * 看广告 - 0:捡银元、1:收红包、2:广告收藏、3: 排行榜、4:商城、5:用户特权、6:寻找商家;
 * 发广告 - 0:发布银元广告、1:发布精准直投、2: 发布竞价广告、3:商城管理、4:商家特权、5:客户 咨询、6:数据分析、;
 * 我 - 0:个人认证、1:感恩机制、2:我的银元、3: 我的现金、4:我的金币、5:通用设置、6:关于秒赚
 * @param parentIndex {number} 0:看广告、1:发广告、2:我
 * @param index {number}
 * @memberof Inkey.mz
 * @function
 */

mz.gotoSecondaryModel = function (parentIndex, index) {
  var paths = [
    [
      'com.zdit.advert.watch.picksilver.WatchAdvertMainActivity',//(0,0)
      'com.zdit.advert.watch.redpacket.RedPacketHomeActivity',//(0,1)
      'com.zdit.advert.watch.collectads.AdvertCollectActivity',//(0,2)
      'com.zdit.advert.watch.ranklist.HomeOfRankingListActivity',//(0,3)
      'com.zdit.advert.watch.store.StoreMainActivity',//(0,4)
      'com.zdit.advert.watch.uservip.UserPrivilegeActivity',//(0,5)
      'com.zdit.advert.watch.searchmerchant.SearchMerchantHomeActivity'//(0,6)
    ], [
      'com.zdit.advert.publish.advertmanagepublish.SilverAdvertPublishAndManageHomeActivity',//(1,0) 银元广告发布与管理
      'com.zdit.advert.publish.redpacketadvert.RedPacketAdvertMainActivity',//(1,1) 红包广告发布与管理
      'com.zdit.advert.publish.bidding.MyBiddingActivity',//(1,2) 我的竞价广告
      'com.zdit.advert.publish.shopmgr.ShopMgrActivity',//(1,3) 商城管理
      'com.zdit.advert.publish.merchantvip.MerchantVipMainActivity',//(1,4) 商家VIP特权
      'com.zdit.advert.publish.consult.MerchantConsultMainActiviy',//(1,5) 客户咨询
      'com.zdit.advert.publish.dataanalysis.DataAnalysisHomeActivity'//(1,6) 数据分析
    ], [
      'com.zdit.advert.mine.PersonalAuthActivity',//(2,0) 个人认证
      'com.zdit.advert.mine.thx.ThxActivity',//(2,1) 感恩机制
      'com.zdit.advert.mine.silver.MySilverActivity',//(2,2) 我的银元
      'com.zdit.advert.mine.money.MyMoneyHomeActivity',//(2,3) 我的现金
      'com.zdit.advert.mine.gold.GoldActivity',//(2,4) 我的广告金币
      'com.zdit.advert.mine.CommonSettingActivity',//(2,5) 通用设置
      'com.zdit.advert.mine.AboutAcitivity',//(2,6) 关于秒赚
      'com.mz.mall.mine.trading.MyTradingCurrencyActivity' //(2,7)我的易货码
    ]
  ];

  util.callByEnv(function () {
    return {
      iosMiaoZhuan: ios,
      ios: ios,
      androidMiaoZhuan: android
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