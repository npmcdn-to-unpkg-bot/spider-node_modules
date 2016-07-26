inkeyjs
===
秒赚基础库

作用
===
- 与秒赚APP交互
- 与易货APP交互
- 与微信秒赚交互
- 其他功能参见文档

快速开始
===

```
// 进入项目根目录 安装依赖模块
$ npm i -g gulp && npm i --save

// 生成文档
$ gulp dev

// 运行demo

$ fis3 server start -p 6030
$ fis3 release -wcL

// demo演示
// http://{ip}:6030/

// 查看文档
// http://{ip}:6040/
```

ChangeLog
---
## v2.0.4
---
###新增功能
 - titleBar菜单
 - [core]新增生成uid方法
 - [core]新增扩展对象方法
 - [core]新增判断是否是纯粹的对象方法
 - [core]新增判断是否是数组方法
 - [core]新增判断是否是IOS版秒赚方法
 - [core]新增判断是否是Android版秒赚方法
 - [core]新增判断是否是Android版Hybrid模式方法
 - [core]新增判断是否是IOS版Hybrid模式方法
 - [core]新增判断是否是Hybrid模式方法
 - [core]新增callByEnv6种调用方式
 - [mz]将所有android回调改成androidMiaoZhuan回调(4.0以上版本已强制支持)
 - [mz]支持IOSMiaoZhuan回调
 - [mz]shareByAttr方法增加6个字段以响应分享统计

## v2.0.3
---
###新增功能
 - [微信]修改host地址
 - [微信]新增个人认证首页

## v2.0.2
---
###新增功能
 - [安卓秒赚]银元竞猜

## v2.0.1
---
###新增功能
 - [微信]新增感恩首页跳转
