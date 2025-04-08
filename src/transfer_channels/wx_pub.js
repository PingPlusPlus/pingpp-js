var callbacks = require('../callbacks');
var stash = require('../stash');
var mods = require('../mods');
var hasOwn = {}.hasOwnProperty;

module.exports = {
  handleTransfer: function(transfer) {
    const credential = {};
    const fields = [
      'appId', 'mchId', 'package'
    ];
    for (let k = 0; k < fields.length; k++) {
      if (!hasOwn.call(transfer.extra, fields[k])) {
        callbacks.innerTransferCallback('fail', callbacks.error('invalid_credential', 'missing_field_' + fields[k]));
        console.error(fields[k]);
        return;
      } else {
        credential[fields[k]] = transfer.extra[fields[k]];
      }
    }
    stash.jsApiParameters = credential;
    this.callTransfer();
  },

  callTransfer: function() {
    const self = this;
    const wx_jssdk = mods.getExtraModule('wx_jssdk');
    if (typeof wx_jssdk !== 'undefined' && wx_jssdk.jssdkEnabled()) {
      wx_jssdk.callpay();
    } else if (typeof WeixinJSBridge === 'undefined') {
      const eventCallback = function () {
        self.jsApiCall();
      };
      if (typeof document === 'undefined') {
        callbacks.innerTransferCallback(
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
            callbacks.innerTransferCallback("success");
          } else if (res.err_msg === 'requestMerchantTransfer:cancel') {
            callbacks.innerTransferCallback("cancel");
          } else {
            callbacks.innerTransferCallback(
              "fail",
              callbacks.error("wx_result_fail", res.err_msg),
            );
          }
        }
      );
    }
  }
};
