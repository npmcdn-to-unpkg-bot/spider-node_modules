'use strict';
var cryptico = require('./cryptico').cryptico;
var RSAKey = require('./cryptico').RSAKey;

require('@spider/zepto');
require('@spider/zepto/src/event');
require('@spider/zepto/src/ajax');

var _instanceof_,
    moduleBase64 = 'r064mYANMiiUeFUvePpIQchAxv8J/zJERUrNFQ2FV5Q3fSDp1nlxj3dHf8pIZeYl1ivoigY745iV16Nk/2afID3RDPOUNSGaBG5Euc0p6iyV/oiAkg0vH8m46F2tbBvAoGnT05Ia88BDNtCH0BbGHtiDaCFr6JaRX47zsiJGHpM=',
    exponent = '10001';

function method() {
}

method.prototype = {
    /**
     * 获取加密后内容  需要返回密文
     * @param data
     */
    RSAEncrypt: function (data) {
        var rsaData = {d: JSON.stringify(data)};
        var module = cryptico.b64to16(moduleBase64);
        var rsaKey = new RSAKey();
        rsaKey.setPublic(module, exponent);
        var str = rsaKey.encrypt(JSON.stringify(rsaData));
        var encryptText = cryptico.b16to64(str)
        return {
            data: encryptText
        }
    },
    /**
     * 获取加密内容  请求结果返回密文
     * @param data
     * @returns {{result, key: (*|RSAKey), iv}}
     * @constructor
     */
    RSA2AESEncrypt: function (data) {
        var key = cryptico.generateAESKey(),
            iv = cryptico.generateAESIV();

        var keyStr = cryptico.b256to64(cryptico.bytes2string(key));
        var ivStr = cryptico.b256to64(cryptico.bytes2string(iv));
        var keyJson = {
            d: JSON.stringify(data),
            k: keyStr,
            i: ivStr
        };
        var rsaData = JSON.stringify(keyJson);
        var module = cryptico.b64to16(moduleBase64);
        var rsaKey = new RSAKey();
        rsaKey.setPublic(module, exponent);
        var encrypted = rsaKey.encryptBytes(rsaData);
        var encryptText = cryptico.b16to64(encrypted);
        return {
            data: encryptText,
            key: key,
            iv: iv
        };
    },
    /**
     * AES结果解密
     * @param data
     */
    AESDecrypt: function (data, key, iv) {
        var decryptText = cryptico.decryptAESCBC2(data, key, iv);
        return decryptText;
    }
}


module.exports = function () {
    if (_instanceof_ === undefined) {
        _instanceof_ = new method();
    }
    return _instanceof_;
};