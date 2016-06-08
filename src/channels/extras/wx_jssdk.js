var stash = require('../../stash');
var callbacks = require('../../callbacks');

/*global wx*/
module.exports = {

  jssdkEnabled: function() {
    return typeof wx !== 'undefined' && typeof stash.signature !== 'undefined';
  },

  callpay: function() {
    var wxConfigFailed = false;
    wx.config({
      debug: typeof stash.debug == 'boolean' ? stash.debug : false,
      appId: stash.jsApiParameters.appId,
      timestamp: stash.jsApiParameters.timeStamp,
      nonceStr: stash.jsApiParameters.nonceStr,
      signature: stash.signature,
      jsApiList: ['chooseWXPay']
    });
    delete stash.signature;
    delete stash.debug;
    wx.ready(function() {
      if (wxConfigFailed) {
        return;
      }
      wx.chooseWXPay({
        timestamp: stash.jsApiParameters.timeStamp,
        nonceStr: stash.jsApiParameters.nonceStr,
        'package': stash.jsApiParameters.package,
        signType: stash.jsApiParameters.signType,
        paySign: stash.jsApiParameters.paySign,
        success: function(res) {
          delete stash.jsApiParameters;
          if (res.errMsg == 'chooseWXPay:ok') {
            callbacks.innerCallback('success');
          } else {
            callbacks.innerCallback('fail',
              callbacks.error('wx_result_fail', res.errMsg));
          }
        },
        /* eslint-disable no-unused-vars */
        cancel: function(res) {
          delete stash.jsApiParameters;
          callbacks.innerCallback('cancel');
        },
        /* eslint-enable no-unused-vars */
        fail: function(res) {
          delete stash.jsApiParameters;
          callbacks.innerCallback('fail',
            callbacks.error('wx_result_fail', res.errMsg));
        }
      });
    });
    wx.error(function(res) {
      wxConfigFailed = true;
      delete stash.jsApiParameters;
      callbacks.innerCallback('fail',
        callbacks.error('wx_config_error', res.errMsg));
    });
  }
};
