var callbacks = require('../callbacks');
var utils = require('../utils');
var stash = require('../stash');
var mods = require('../mods');
var hasOwn = {}.hasOwnProperty;

/*global WeixinJSBridge*/
module.exports = {

  PINGPP_NOTIFY_URL_BASE: 'https://api.pingxx.com/notify/charges/',

  handleCharge: function(charge) {
    var credential = charge.credential[charge.channel];
    var fields = [
      'appId', 'timeStamp', 'nonceStr', 'package', 'signType', 'paySign'
    ];
    for (var k = 0; k < fields.length; k++) {
      if (!hasOwn.call(credential, fields[k])) {
        callbacks.innerCallback('fail',
          callbacks.error('invalid_credential', 'missing_field_' + fields[k]));
        return;
      }
    }
    stash.jsApiParameters = credential;
    this.callpay();
  },

  callpay: function() {
    var self = this;
    var wx_jssdk = mods.getExtraModule('wx_jssdk');
    if (typeof wx_jssdk !== 'undefined' && wx_jssdk.jssdkEnabled()) {
      wx_jssdk.callpay();
    } else if (typeof WeixinJSBridge == 'undefined') {
      var eventCallback = function() {
        self.jsApiCall();
      };
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady',
          eventCallback, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', eventCallback);
        document.attachEvent('onWeixinJSBridgeReady', eventCallback);
      }
    } else {
      this.jsApiCall();
    }
  },

  jsApiCall: function() {
    if (hasOwn.call(stash, 'jsApiParameters')) {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        stash.jsApiParameters,
        function(res) {
          delete stash.jsApiParameters;
          if (res.err_msg == 'get_brand_wcpay_request:ok') {
            callbacks.innerCallback('success');
          } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
            callbacks.innerCallback('cancel');
          } else {
            callbacks.innerCallback('fail',
              callbacks.error('wx_result_fail', res.err_msg));
          }
        }
      );
    }
  },

  runTestMode: function(charge) {
    var dopay = confirm('模拟付款？');
    if (dopay) {
      utils.request(this.PINGPP_NOTIFY_URL_BASE + charge.id + '?livemode=false',
        'GET', null,
        function(data, status) {
          if (status >= 200 && status < 400 && data == 'success') {
            callbacks.innerCallback('success');
          } else {
            var extra = 'http_code:' + status + ';response:' + data;
            callbacks.innerCallback('fail',
              callbacks.error('testmode_notify_fail', extra));
          }
        },
        function() {
          callbacks.innerCallback('fail', callbacks.error('network_err'));
        });
    }
  }
};
