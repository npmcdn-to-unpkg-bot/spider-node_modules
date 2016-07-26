share
---
简便高效的分享模块, 有了它便能完成微信内的分享和app分享。支持多种模式, 省力更省心！

如何安装
===
```
$ cnpm i --save @spider/share
```

快速开始
===
```
var share = require('@spider/share')({
  mzAPI: 'http://192.168.0.201:8421/api/',
  wxAPI: 'http://weixin.test.inkey.com/',
  wxDebug: false,
  sessionTokenName: 'test-token',
  reverseShareCopy: true,
  jsApiList: [],
  shareCallback: function(status, platform){
    // status 状态: success cancel fail 
    // platform 平台: 朋友圈 朋友 腾讯微博 qq qq空间
    // todo
  },
  defaultShare: {
    byKey: {
      key: '984a6ad4f3592993b0e944746b97b3fe',
      param1: '11',
      param2: '22'
    },
    byContent: {
      content: {
        desc: '我是描述',
        title: '我是标题',
        link: 'http://baidu.com?a=1',
        imgUrl: 'https://www.baidu.com/img/bd_logo1.png'
      },
      log: {
        RefType: 16, // 活动分享
        Key: '12345678-1234-1234-1234-123456789123', // 活动ID
        RefId: '1234-1234-1234-1234-123456789123', // 活动ID
        RefCode: 0, // 活动编号, 没有为0
        RefName: '22' // 活动名称
      }
    }
  }
});

// 通过自定义参数更新文案
share.updateByAttr({
 desc: '修改描述',
 title: '修改标题',
 link: 'http://baidu.com?a=1',
 imgUrl: 'https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/home/img/qrcode/zbios_62c636fe.png'
});

// 自定义日志参数
share.updateByAttr({
 desc: '修改描述',
 title: '修改标题',
 link: 'http://baidu.com?a=1',
 imgUrl: 'https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/home/img/qrcode/zbios_62c636fe.png'
}, {
  RefType: 16, // 活动分享
  Key: '12345678-1234-1234-1234-123456789123', // 活动ID
  RefId: '1234-1234-1234-1234-123456789123', // 活动ID
  RefCode: 0, // 活动编号, 没有为0
  RefName: '22' // 活动名称
});

// 通过key更新文案
share.updateByKey({key: '36a47575fca0b23b42e2f27c8e5f6ead'});

// 还原文案
share.revertDefault();

// app按钮分享
share.btnShare({
   title: '更新',
   desc: '更新',
   imgUrl: '',
   link: '',
   target: [1, 6] // 平台
});
```

Config
===
- `mzAPI` 秒赚API地址
- `wxAPI` 微信签名API地址
- `sessionTokenName` 通过该属性在sessionStorage取token值。默认为ngStorage-token
- `reverseShareCopy` 反转分享到朋友圈的文案。默认true
- `wxDebug` 微信调试模式。模式false
- `cleanCacheOnSuccess` 分享成功之后, 是否清空请求缓存 默认: true
- `jsApiList` 微信授权接口列表, 默认已添加所有分享接口, 根据需要可传递其它接口
- `shareCallback` 自定义回调函数, 接收2个参数, status: success/cancel/fail 。platform: 朋友圈/朋友/腾讯微博/qq/qq空间
- `defaultShare` 默认分享模式
  - `byKey` 通过key分享
    - `key`
    - `params1` 参数1
    - `params2` 参数2
    - `...`更多参数
  - `byContent` 通过自定义参数分享
    - `content` 内容配置
      - `desc` 描述
      - `title` 标题
      - `link` 分享出去的地址, 默认会在link上添加`_thanks_``shareid`属性
      - `imgUrl` 图片地址
    - `log` 日志配置，配置了该参数会向服务器发送日志信息
      - `RefType` 类型, 16为活动分享, 具体类型看秒赚API
      - `Key` 活动ID
      - `RefId` 活动ID
      - `RefCode` 活动编号, 没有为0
      - `RefName` 活动名称

Method
===
- `revertDefault()` 还原到默认分享, 取决于初始化时设置的默认分享方式
- `updateByKey(params)` 通过自定义参数分享
  - params
    - `key`
    - `params1` 参数1
    - `params2` 参数2
    - `...`更多参数
- `updateByAttr(params, log)` 通过key更新文案
  - params
    - `title` 标题
    - `desc` 描述
    - `imgUrl` 图片地址
    - `link` 分享出去的地址, 默认会在link上添加`_thanks_``shareid`属性
  - log 参考 Config -> defaultShare -> byContent -> log
- `btnShare(params, log)` app按钮分享 允许修改某个文案属性
  - params
    - `title` 标题
    - `desc` 描述
    - `imgUrl` 图片地址
    - `link` 分享出去的地址, 默认会在link上添加`_thanks_``shareid`属性
    - `target` 分享平台
  - log 参考 Config -> defaultShare -> byContent -> log

ChangeLog
---
0.0.8
- 修复缓存失效问题

0.0.7
- 所有请求默认缓存
- 添加支持清除缓存的方法(cleanCache)
- 新增cleanCacheOnSuccess属性。默认true。 分享成功之后, 是否清空请求缓存
- updateByAttr新增参数, 支持自定义log参数
- btnShare新增参数, 支持自定义log参数
- 详情见文档

0.0.6
- 支持自定义分享回调函数

0.0.5
- 修复当默认分享为key, 并且获取分享文案异常时, weixin配置对象抱错的异常处理

0.0.4
- 修复感恩号不存在对象找不到的bug

0.0.3
- 新增微信接口授权列表

0.0.2
 - 新增reverseShareCopy配置
