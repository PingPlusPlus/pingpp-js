var callbacks = require('../callbacks');

/*global my*/
module.exports = {

  PINGPP_NOTIFY_URL_BASE: 'https://notify.pingxx.com/notify',

  handleCharge: function (charge) {
    var trade_no = charge.credential[charge.channel];
    if (trade_no) {
      this.callpay(trade_no);
    } else {
      callbacks.innerCallback('fail',
        callbacks.error('invalid_credential', 'missing_alipay_lite'));
    }
  },

  alipayLiteEnabled: function () {
    return typeof my !== 'undefined' && my.tradePay;
  },

  //支付宝小程序支付
  callpay: function (tradeNO) {
    if (!this.alipayLiteEnabled()) {
      console.log('请在支付宝小程序中打开');
      return;
    }
    var alipay_lite = {};
    alipay_lite.tradeNO = tradeNO;
    alipay_lite.complete = function (res) {
      //支付成功
      if (res.resultCode == 9000) {
        callbacks.innerCallback('success');
      } else if (res.resultCode == 6001) { //取消支付
        callbacks.innerCallback('cancel', callbacks.error('用户取消支付'));
      } else {
        callbacks.innerCallback('fail', callbacks.error('支付失败'));
      }
    };
    my.tradePay(alipay_lite);
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
