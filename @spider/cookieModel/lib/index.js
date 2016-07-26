'use strict';

var param = require('jquery-param');

var config = {
  enableList: [],
  sessionTokenName: 'ngStorage-token',
  header: {} // object or function
};

module.exports = function(opt){

  _.extendOwn(config, opt);

  config.enableList = config.enableList.concat([
    'mzapi.ready.inkey.com',
    'mzapi.four.inkey.com',
    'mzapi-four.inkey.com',
    'mzapi-ready.inkey.com',
    'mzapi.inkey.com'
  ]);

  if(window.jQuery && jQuery.ajaxSetup){
    setJquery();
  }

  if(!window.jQuery && $ && $.ajaxSettings){
    setZepto();
  }
};

function setJquery(){
  $.ajaxSetup({
    beforeSend: function(xhr, settings){
      if(verifyUrl(settings.url)){

        // 设置跨域传递cookie

        settings.xhrFields = {
          withCredentials: false
        };

        // 设置header

        _.forEach(getHeader(), function(value, key){
          xhr.setRequestHeader(key, value);
        });

      }else{
        settings.url = getNewUrl(settings.url);
      }

    }
  });
}


function setZepto(){
  $.ajaxSettings.beforeSend = function(xhr, settings){
    if(verifyUrl(settings.url)){

      // 设置跨域传递cookie

      xhr.withCredentials = true;

      // 设置header

      _.forEach(getHeader(), function(value, key){
        xhr.setRequestHeader(key, value);
      });

    }else{
      settings.url = getNewUrl(settings.url);
    }
  };
}



//////// util

function verifyUrl(url){

  var index = 0;

  _.forEach(config.enableList, function(value){
    if(url.indexOf(value) !== -1){
      index = 1;
    }
  });

  return ( index === 1 );
}

function getNewUrl(url){

  var __h = encodeURIComponent(param(_.extendOwn(getHeader(), {'token': getToken()})));

  if(url.indexOf('?') !== -1){
    url = url + '&__h=' + __h;
  }else{
    url = url + '?__h=' + __h;
  }

  return url;
}

function getHeader(){
  var header = config.header;
  if(header && _.isFunction(header)){
    return header();
  }else{
    return header;
  }
}

function getToken(){
  var match = location.href.match(/token=([^&]+)/);
  return ( match && match[1] ) || sessionStorage.getItem(config.sessionTokenName);
}