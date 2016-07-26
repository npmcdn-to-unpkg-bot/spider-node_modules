cryptico
---
加密模块

如何安装
===
```
$ cnpm i --save @spider/cryptico
```

快速开始
===
```
var encrypt = require('@spider/cryptico')();
//返回结果不加密
var pdata1 = encrypt.RSAEncrypt({
     UserAccount: '13990005936',
     Password: '123456'
 });
 $.ajax({
     type: 'POST',
     url: 'http://192.168.0.201:8321/api/Auth/Login',
     contentType: 'application/jsonet',
     data: pdata1.data,
     success: function (data, state, request) {
         $('#rsa').addClass('blue').html('成功<br/>' + request.responseText);

     }, error: function (data) {
         $('#rsa').addClass('red').html('错误<br/>' + data.responseText);
     }
 });
//返回结果加密
var pdata2 = encrypt.RSA2AESEncrypt({
    UserAccount: '13990005936',
    Password: '123456'
});
$.ajax({
    type: 'POST',
    url: 'http://192.168.0.201:8321/api/Auth/Login',
    accepts: {
        jsonet: "application/jsonet"
    },
    dataType: "jsonet",
    contentType: 'application/jsonet',
    data: pdata2.data,
    success: function (data, state, request) {
        $('#rsa2aes').addClass('blue').html('成功<br/>' + encrypt.AESDecrypt(request.responseText, pdata2.key, pdata2.iv));

    }, error: function (data) {
        $('#rsa2aes').addClass('red').html('错误<br/>' + data.responseText);
    }
});
```

Method
===
- `RSAEncrypt` 返回结果不加密
  - `data` 要加密的json内容

- `RSA2AESEncrypt` 返回结果进行AES加密
  - `data` 要加密的json内容

- `AESDecrypt` 对数据进行AES解密
  - `data` 要加密的json内容
  - `key` 密钥匙
  - `iv` 向量

ChangeLog
---
0.0.2
 - [新增]返回结果进行AES加密
 - [新增]AES解密

0.0.1
 - 初始版本
