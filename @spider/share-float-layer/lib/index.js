'use strict';
require('@spider/zepto');
require('@spider/zepto/src/event');
require('@spider/zepto/src/ajax');
require('./index.styl');
var Guid=require('guid');
var core = require('./core');
var pub = {}, shareConfig = {},initLocalUrl = location.href,resetHostory = location.href,thankUser = '';

/**
 * @description 定义微信接口地址
 * @memberof ShareFloatLayer
 * @type {String}
 */
pub.wxAPI = '';

/**
 * 操作日志
 * @param type
 */
pub.saveUserShareResult=function (type) {
    $.ajax({
        url: pub.wxAPI + '/api/UserShare/SaveUserShareResult',
        data: {shareId: pub.guid, operateType: type}
    });
}


/**
 * 操作日志
 * @param type
 */
pub.saveUserShare=function (platform) {
    $.getJSON(pub.wxAPI + '/api/UserShare/SaveUserShare', {
        ShareId: pub.guid,
        status: 2,
        shareObjectType: 255,
        shareObjectId: '',
        shareObjectCode: '',
        shareObjectName:document.title,
        shareObjectUrl: shareConfig.link,
        sharePlatform: platform,
        shareKey: '',
        usePlatform: 0,
        platformVersion: ''
    });
}

/**
 * @description 初始化
 * @memberof ShareFloatLayer
 * @param json对象 {Object} {container:'zepto容器对象',wxAPI:'微信接口地址',shareConfig:'微信分享内容配置',resetHostory:'浏览器重置地址',thankUser:'感恩用户'}
 */
pub.init = function (json) {
    pub.wxAPI = json.wxAPI;
    pub.guid = Guid.raw();
    console.log(pub.guid)
    pub.saveUserShareResult(1);
    json.container.html(__inline('./index.html'));
    if (json.shareConfig) {
        pub.shareConfig(json.shareConfig);
    }
    var touchEvent = !!('ontouchend' in document) ? 'touchend' : 'click';
    resetHostory = json.resetHostory || '';
    thankUser = json.thankUser || '';
    if (core.util.isWeixn()) {
        if (core.util.getQueryString('WXUrl') !== '') {
            //已经关注
            $('.ui-share-block').addClass('follow');
            $('#fDown').on(touchEvent, pub.downToURL);
            $('#fLogin').on(touchEvent, function () {
                history.pushState('', '', resetHostory);
                window.location.href = decodeURIComponent(core.util.getQueryString('WXUrl') || '');
            });
        } else {
            //未关注
            $('.ui-share-block').addClass('unfollow');
            $('#ufDown').on(touchEvent, pub.downToURL);
        }
    } else {
        $('.ui-share-block').addClass('web');
        $('#wDown').on(touchEvent, pub.downToURL);
    }
}

/**
 * @description 下载处理事件
 * @memberof ShareFloatLayer
 */
pub.downToURL = function () {
    pub.saveUserShareResult(2);
    if (resetHostory !== '') {
        history.pushState('', '', resetHostory);
    }
    if (core.util.isWeixn()) {
        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.zdit.advert&g_f=991653';
    } else {
        window.location.href = 'http://down.inkey.com/sa/' + thankUser;
    }
}
/**
 * @description 配置分享信息
 * @memberof ShareFloatLayer
 * @param config {Object} 分享配置{title:'分享标题',desc:'分享描述',link:'分享地址',imgUrl:'图片地址'}
 */
pub.shareConfig = function (config) {
    if (core.util.isWeixn()) {
        shareConfig = {
            link: location.href,
            title: document.title,
            desc: '用秒赚微信版看“' + document.title + '”广告,狂赚银元换商品',
            imgUrl: 'http://img.inkey.com/oper/business/2015/1021/15/90d5520a-def5-c180-7b64-08d2d9e82c6d?_t=20151021152101453'
        }
        $.extend(shareConfig, config);
        $.getJSON(pub.wxAPI + '/WXCore/JSSignature', {
            Url: initLocalUrl
        }, function (data) {
            if (data.Code === 100) {
                wx.config({
                    appId: data.Data.AppId,
                    debug: false,
                    nonceStr: data.Data.NonceStr,
                    timestamp: data.Data.TimeStamp,
                    signature: data.Data.Signature,
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
                });
            } else {
                console.log(data.Desc);
            }
        });
        wx.ready(function () {
            wx.onMenuShareQQ({
                link: shareConfig.link,
                title: shareConfig.title,
                desc: shareConfig.desc,
                imgUrl: shareConfig.imgUrl,
                success:function () {
                    pub.saveUserShare(4);
                }
            });
            wx.onMenuShareWeibo({
                link: shareConfig.link,
                title: shareConfig.title,
                desc: shareConfig.desc,
                imgUrl: shareConfig.imgUrl,
                success:function () {
                    pub.saveUserShare(3);
                }
            });
            wx.onMenuShareQZone({
                link: shareConfig.link,
                title: shareConfig.title,
                desc: shareConfig.desc,
                imgUrl: shareConfig.imgUrl,
                success:function () {
                    pub.saveUserShare(5);
                }
            });
            wx.onMenuShareTimeline({
                link: shareConfig.link,
                title: shareConfig.title,
                desc: shareConfig.desc,
                imgUrl: shareConfig.imgUrl,
                success:function () {
                    pub.saveUserShare(1);
                }
            });
            wx.onMenuShareAppMessage({
                link: shareConfig.link,
                title: shareConfig.title,
                desc: shareConfig.desc,
                imgUrl: shareConfig.imgUrl,
                success:function () {
                    pub.saveUserShare(2);
                }
            });
        });
    }
}

module.exports = function (config) {
    pub.init(config);
    return pub;
}