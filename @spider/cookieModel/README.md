cookieModel
---
自动转换接口授权模式, 暂时只支持 jQuery 和 zepto。
开发和测试用url方式传递token,  预发布以上环境用cookie模式。

如何安装
===
```
$ cnpm i --save @spider/cookieModel
```

快速开始
===
```
require('@spider/cookieModel')();

// or 

require('@spider/cookieModel')({
  enableList: [
    'mzapi.ready.inkey.com',
    'mzapi.four.inkey.com',
    'mzapi-four.inkey.com',
    'mzapi-ready.inkey.com'
  ],
  sessionTokenName: 'ngStorage-token',
  header: {} // object or function
});

```

Config
===
- `enableList` 启用cookie模式的api列表, 支持简写, 默认见上
- `sessionTokenName` 通过该属性在sessionStorage取token值
- `header` 可自定义header, 支持对象和方法

ChangeLog
---
0.0.1