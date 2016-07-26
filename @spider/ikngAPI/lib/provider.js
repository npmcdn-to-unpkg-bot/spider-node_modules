'use strict';

var _ = require('underscore');
var param = require('jquery-param');

exports.ikngAPI = ikngAPI;

/**
 * API服务
 * @param {String} id     API路径
 * @param {Object} opts   API参数
 * @example
 * 
 * var DailySpecialOffer = ikngAPI('Event/DailySpecialOffer', {
 *   // api host
 *   host: app.env.API,
 *   
 *   // 缓存, 默认关闭
 *   cache: false,
 *   
 *   // 缓存过期时间, 默认值在config里面配置
 *   expire: app.cacheExpire,
 *   
 *   // 请求锁, 默认打开
 *   lock: true,
 *   
 *   // 请求参数
 *   params: {} || function(){ return {}; }
 * });
 * 
 * // 创建子API对象
 * var IncreaseVipPv = DailySpecialOffer.new('IncreaseVipPv');
 *
 * // post请求
 * IncreaseVipPv.post().then(function(data){
 *   console.log(data);
 * });
 * 
 * // get请求
 * IncreaseVipPv.get().then(function(data){
 *   console.log(data);
 * });
 */

function ikngAPI() {
  var _pt_, caches, defaultOpt;

  // 默认参数

  defaultOpt = {
    host: '',
    cacheExpire: 30,
    httpTimeout: 25000
  };

  // 配置

  this.config = function(opt){
    opt = opt || {};

    for(var key in opt){
      if(opt[key]){
        defaultOpt[key] = opt[key]; 
      }
    }

    if(!defaultOpt.host){
      console.error('[ik.ngAPI]请先配置api host');
    }

  };

  this.$get = ['$http', '$cacheFactory', '$q', function($http, $cacheFactory, $q){

    _pt_   = CreateAPI.prototype;

    // API接口缓存集合, {API}.new 先从缓存里面取

    caches = {}; 

    function CreateAPI(id, opts, parent) {
      var that, defOpts, APICache;

      that = this;

      opts = opts || {};

      // 默认请求配置

      defOpts = {

        host: defaultOpt.host,

        // 缓存, 默认关闭

        cache: false,

        // 缓存过期时间, 默认值在config里面配置

        expire: defaultOpt.cacheExpire,

        // 请求锁, 默认打开 __unlock

        lock: true,

        // 请求参数

        params: {}
      };

      // 接口地址

      that.id = that.url = id;

      // 父级接口

      that.parent = {};

      // 接口参数

      that.opts = _.extendOwn({}, defOpts, opts);

      // 当通过 {API}.new() 方式构建子级接口
      // 会把当前接口对象作为参数传递给子级对象作为父级引用

      if (parent) {
        // 当前接口的URL地址为父级接口 URL + 当前接口ID

        that.url = parent.url + '/' + id;

        // 将父级接口的缓存对象赋给子级缓存
        // 这样变能保证该缓存对象的所有子父级接口公用一个缓存

        that.cache = parent.cache;

        // 如果子API没有自定义host, 那么共享父API的host
        if (that.opts.host === defOpts.host) {
          that.opts.host = parent.opts.host;
        }

        // 引用父级接口对象

        that.parent[parent.id] = parent;
      } else {
        // 数据缓存

        that.cache = $cacheFactory(id, {capacity: 80});
      }

      // 获取缓存中的API对象, 没有则创建新的

      APICache = caches[that.url];

      if (APICache) {
        // 返回缓存, 但要更新参数, 防止使用缓存参数调用接口
        APICache.opts = that.opts;
        return APICache;
      } else {
        caches[that.url] = that;
      }
    }

    /**
     * 构建子级接口
     * @param id 接口ID
     * @param opts 接口参数
     * @returns {CreateAPI}
     */

    _pt_.new = function (id, opts) {
      return new CreateAPI(id, opts, this);
    };

    /**
     * GET请求
     * Promise方式
     * @returns {*}
     */

    _pt_.get = function () {
      return createRequest.call(this, 'GET');
    };

    /**
     * POST请求
     * Promise方式
     * @returns {*}
     */

    _pt_.post = function () {
      return createRequest.call(this, 'POST');
    };

    /**
     * 创建请求
     * @param method
     * @returns {*}
     */

    function createRequest(method) {
      var _params, deferd, that, cacheData, data, url, isCache, cacheId;

      that    = this;
      url     = that.url;
      isCache = that.opts.cache;
      deferd  = $q.defer();
      _params = {
        method          : method,
        timeout         : defaultOpt.httpTimeout,
        url             : that.opts.host + url
      };

      // 当参数是方法 就调用此方法返回正确的参数对象
      // 这么做的好处是可以在调用接口的时候重新计算参数值

      if(_.isFunction(that.opts.params)){
        data = that.opts.params();
      }else{
        data = that.opts.params;
      }

      // 设置请求锁

      data.__unlock = !that.opts.lock;

      // 判断接口类型, 将参数赋给对应字段

      if (method === 'GET') {
        _params.params = data;
      } else {
        _params.data = data;
      }

      // 开启缓存时, 获取缓存数据

      if (isCache) {
        cacheId   = _params.url + '?' + param(_params.params || {});
        cacheData = cache.call(that, that.cache, cacheId);
      }

      // 当缓存数据存在, 返回缓存数据

      if (cacheData) {
        deferd.resolve(cacheData);
      } else {
        $http(_params)
          .success(function (data) {
            // 当开启缓存, 把数据存入缓存

            if (isCache) {
              data = cache.call(that, that.cache, cacheId, data);
            }

            deferd.resolve(data);
          })
          .error(deferd.reject);
      }

      return deferd.promise;
    }

    /**
     * 缓存操作
     * @param cache 缓存对象
     * @param cacheId 缓存ID
     * @param data 该对象存在,设置缓存. 否则,获取缓存
     * @returns {*}
     */

    function cache(cache, cacheId, data) {
      var cacheData, now, cacheExpire;

      if (data) {
        cache.put(cacheId, _.extendOwn({
          // 过期时间, 该字段表明是缓存对象
          _expire: _.now()
        }, data));
        return angular.copy(data);
      }

      // get

      cacheData   = cache.get(cacheId);
      now         = _.now();
      cacheExpire = (1000 * 60 * this.opts.expire);

      // 缓存未过期

      if (cacheData && cacheData._expire + cacheExpire > now) {
        return angular.copy(cacheData);
      }

      return '';
    }

    /**
     * 构建Root接口
     * 该接口可以无限构建子级接口, 形成一个接口链
     */
  
    return function (id, opts) {
      return new CreateAPI(id, opts);
    };
  }];
}