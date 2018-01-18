var hasOwn = {}.hasOwnProperty;
var callbacks = require('../callbacks');

/*global AlipayJSBridge*/
module.exports = {

  handleCharge: function (charge) {
    var credential = charge.credential[charge.channel];
    if (hasOwn.call(credential, 'transaction_no')) {
      this.tradePay(credential.transaction_no);
    } else {
      callbacks.innerCallback('fail',
        callbacks.error('invalid_credential', 'missing_field_transaction_no'));
    }
  },

  ready: function (callback) {
    if (window.AlipayJSBridge) {
      callback && callback();
    } else {
      document.addEventListener('AlipayJSBridgeReady', callback, false);
    }
  },

  tradePay: function (tradeNO) {
    this.ready(function () {
      // 通过传入交易号唤起快捷调用方式(注意tradeNO大小写严格)
      AlipayJSBridge.call('tradePay', {
        tradeNO: tradeNO
      }, function (data) {
        if ('9000' == data.resultCode) {
          callbacks.innerCallback('success');
        } else if('6001' == data.resultCode) {
          callbacks.innerCallback('cancel', callbacks.error(data.result));
        } else {
          callbacks.innerCallback('fail',
            callbacks.error(data.result));
        }
      });
    });
  }
};
