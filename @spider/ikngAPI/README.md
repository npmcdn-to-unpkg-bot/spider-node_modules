ikngAPI
---
AngularJS API服务

快速开始
===

```
// 安装到本地, 私有仓库安装
$ cnpm i --save @spider/ikngAPI

// 引入模块
require('@spider/ikngAPI');


angular

// 添加依赖模块
.module('app', ['ik.ngAPI'])

// 配置
.config(['ikngAPIProvider', function(ikngAPIProvider){
  
  // 具体配置参见 Configuration 
  ikngAPIProvider.config({
    host: 'http://localhost:3333/api',
    cacheExpire: 30,
    httpTimeout: 25000
  });
}])

// 控制器
.controller('IndexCtrl', ['ikngAPI', function(ikngAPI){
  var getUserAPI = ikngAPI('getUser');
  
  // 具体配置参见 Options
  getUserAPI.get(options);
}]);
```

Configuration
===
- `host` api 请求地址 `非空`
- `cacheExpire` 缓存过期时间 默认30分钟 `可空`
- `httpTimeout` 请求超时 默认25秒 `可空`

Options
===
- `host` api 请求地址
- `cache` 缓存, 默认关闭
- `expire` 缓存过期时间, 默认值在config里面配置
- `lock` 请求锁, 默认打开
- `params` 请求参数 {} || function(){ return {}; }

Method
===
- `new` 构建子API接口
- `get` GET请求
- `post` POST请求

test
===
如果你想查看单元测试结果, 那么你可以在根目录输入以下命令

```

$ npm test

// or

$ gulp test

```

ChangeLog
===