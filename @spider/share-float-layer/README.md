share-float-layer
===
全平台分享浮层

作用
===

```
1、 分享着陆页根据微信公主号关注状态显示不同的状态
2、 二次分享

```

快速开始
===

```
//首先在gitlab上面下载fis3-hook-node_modules，然后安装上面的说明进行安装

// 进入项目fis-config目录安装@spider/share-float-layer
$ cnpm i @spider/share-float-layer --save

//使用方法

var shareFloatLayer=require('@spider/share-float-layer')(json);

json说明
{
  container:Object,//zepto容器对象
  wxAPI:String,//微信签名API地址
  shareConfig:shareJson,//微信分享内容配置 可以为空则不进行微信签名
  resetHostory:String,//重置URL地址 不配置则不重置
  thankUser:String //感恩用户 可以不配置
}

注意返回的shareFloatLayer可以调用shareConfig进行分享配置
shareFloatLayer.shareConfig(shareJson)

shareJson说明
{
  title:String,//分享标题
  desc:String,//分享描述
  link:String,//分享地址
  imgUrl:String,//图片地址
}

```
ChangeLog
---
## v0.0.4
---
###修改功能
 - 修改样式信息

---
## v0.0.3
---
###修改功能
 - 修改分享模块的目录结构
 - 加入分享统计

---
## v0.0.2
---
###修改功能
 - 修改README说明使用方法

---
## v0.0.1
---
###新增功能
 - 项目创建