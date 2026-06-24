var callbacks = require('../callbacks');
var stash = require('../stash');
var mods = require('../mods');
var hasOwn = {}.hasOwnProperty;

module.exports = {
  handleWithdrawal: function(withdrawal) {
    const credential = {};
    const fields = [
      'appId', 'mchId', 'package'
    ];
    for (let k = 0; k < fields.length; k++) {
      if (!hasOwn.call(withdrawal.extra, fields[k])) {
        callbacks.innerWithdrawalCallback('fail', callbacks.error('invalid_credential', 'missing_field_' + fields[k]));
        console.error(fields[k]);
        return;
      } else {
        credential[fields[k]] = withdrawal.extra[fields[k]];
      }
    }
    stash.jsApiParameters = credential;
    this.callWithdrawal();
  },

  callWithdrawal: function() {
    const self = this;
    const wx_jssdk = mods.getExtraModule('wx_jssdk');
    if (typeof wx_jssdk !== 'undefined' && wx_jssdk.jssdkEnabled()) {
      wx_jssdk.callpay();
    } else if (typeof WeixinJSBridge === 'undefined') {
      const eventCallback = function () {
        self.jsApiCall();
      };
      if (typeof document === 'undefined') {
        callbacks.innerWithdrawalCallback(
          "fail",
          callbacks.error(
            "invalid_environment",
            "document_is_undefined",
          ),
        );
        return;
      }
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
        'requestMerchantTransfer',
        stash.jsApiParameters,
        function(res) {
          delete stash.jsApiParameters;
          if (res.err_msg === 'requestMerchantTransfer:ok') {
            callbacks.innerWithdrawalCallback("success");
          } else if (res.err_msg === 'requestMerchantTransfer:cancel') {
            callbacks.innerWithdrawalCallback("cancel");
          } else {
            callbacks.innerWithdrawalCallback(
              "fail",
              callbacks.error("wx_result_fail", res.err_msg),
            );
          }
        }
      );
    }
  }
};
