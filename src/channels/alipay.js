var callbacks = require('../callbacks');
var hasOwn = {}.hasOwnProperty;

/*global my*/
module.exports = {

  PINGPP_NOTIFY_URL_BASE: 'https://notify.pingxx.com/notify',

  handleCharge: function (charge) {
    var credential = charge.credential[charge.channel];
    if (credential || hasOwn.call(credential, 'orderInfo')) {
      this.callpay(credential.orderInfo);
    } else {
      callbacks.innerCallback('fail',
        callbacks.error('invalid_credential', 'missing_alipay'));
    }
  },

  alipayLiteEnabled: function () {
    return typeof my !== 'undefined' && my.tradePay;
  },

  // 支付宝小程序支付
  callpay: function (orderStr) {
    if (!this.alipayLiteEnabled()) {
      console.log('请在支付宝小程序中打开');
      return;
    }
    var tradePayParams = {};
    tradePayParams.orderStr = orderStr;
    tradePayParams.complete = function (res) {
      var extra = {
        resultCode: res.resultCode
      };
      if (hasOwn.call(res, 'memo')) {
        extra.memo = res.memo;
      }
      if (hasOwn.call(res, 'result')) {
        extra.result = res.result;
      }
      //支付成功
      if (res.resultCode == '9000') {
        callbacks.innerCallback('success', callbacks.error('', extra));
      } else if (res.resultCode == '6001') { //取消支付
        callbacks.innerCallback('cancel', callbacks.error('用户取消支付', extra));
      } else {
        callbacks.innerCallback('fail', callbacks.error('支付失败', extra));
      }
    };
    my.tradePay(tradePayParams);
  },

  runTestMode: function (charge) {
    var path = '/charges/' + charge.id;
    my.httpRequest({
      url: this.PINGPP_NOTIFY_URL_BASE + path + '?livemode=false',
      success: function(res) {
        if (res.data == 'success') {
          callbacks.innerCallback('success');
        } else {
          callbacks.innerCallback('fail',
            callbacks.error('testmode_notify_fail'));
        }
      },
      fail:function() {
        callbacks.innerCallback('fail', callbacks.error('network_err'));
      }
    });
  }
};
