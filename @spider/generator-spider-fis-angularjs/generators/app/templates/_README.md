# Useage
---

1.进入项目目录安装所需依赖

2.修改 `gulpfile.js` `config`对象

3.修改 `app/fis-conf.js` `dist、baseURL、app`属性

4.如果需要引用统计服务, 在`app/page/index.html`添加统计JS

5.修改`app/modules/config.js` `name`项目名

6.修改微信分享文案, 分享`Type`值

```
$ cd {项目路径}
$ npm i
$ cd ./app
$ fis3 release -Lwl
$ cd ..
$ gulp dev
```