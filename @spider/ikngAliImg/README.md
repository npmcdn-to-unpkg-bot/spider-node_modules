ikngAliImg
---
阿里云图片处理服务。支持 webp，图片裁剪，延迟加载 等功能

如何安装
===
```
$ cnpm i --save @spider/ikngAliImg

angular
  .module('app', ['ik.ngAliImg'])
  .config(function(ikngAliImgProvider){

    // 设置阿里云图片服务
    ikngAliImgProvider.configuration({
      isWebp: true
    });

  });
```
快速开始
===
```
<ik-img src="data.img || 'no'"></ik-img>
```
Service
===
- `imageClipping` 图片剪裁服务
- `ikngAliImgProvider`
  - `configuration` 配置方法

Config
===
- `isWebp` 是否启用webp
- `defaultImg`
  - `text` 带文字的默认图地址, 默认值为阿里云上的秒赚默认图地址
  - `noText` 不带文字的默认图地址, 默认值为阿里云上的秒赚默认图地址

directiveOptions
===
- `data-boxHeight` 盒子高度（若高度是动态获取时需要传此值）默认值：box高度
- `data-size`      默认图片大小 如：50%或50px  默认值：50%
- `data-suffix`    显示图片后缀（若图为png时需要传此值）  默认值：jpg
- `data-imgW`      显示图片宽度 如：100%、100px、auto  默认值：100%
- `data-imgH`      显示图片高度 如：100%、100px、auto  默认值：100%
- `data-noCut`     不剪裁图片 如：y  默认值：n
- `data-noLazy`    不使用懒加载 如：y  默认值：n
- `data-initSrc`   默认图片 如：b、s  默认值：b

ChangeLog
---
0.0.2