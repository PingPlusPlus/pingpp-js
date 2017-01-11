/**
 * Created by yulitao on 2016/12/29.
 */
var stash = require('../stash');
var callbacks = require('../callbacks');
var mods = require('../mods');
var hasOwn = {}.hasOwnProperty;
/*global wx*/
module.exports = {

  handleCharge: function (charge) {
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
  wxLiteEnabled: function () {
    return typeof wx !== 'undefined' && wx.requestPayment;
  },
  //微信小程序支付
  callpay: function () {
    if (!this.wxLiteEnabled()) {
      console.log("请在微信小程序中打开");
      return;
    }
    var wx_lite = stash.jsApiParameters;
    delete wx_lite.appId;
    wx_lite.complete = function (res) {
      //支付成功
      if (res.errMsg === "requestPayment:ok") {
        callbacks.innerCallback('success');
      }
      //取消支付
      if (res.errMsg === "requestPayment:cancel") {
        callbacks.innerCallback('cancel', callbacks.error("用户取消支付"));
      }
      //支付验证签名失败
      if (res.err_code !== 'undefined' && res.err_desc !== 'undefined') {
        callbacks.innerCallback('fail', callbacks.error(res.err_desc, res))
      }
    };
    wx.requestPayment(wx_lite);
  },
  runTestMode: function (url) {
    wx.showModal({
      title: '提示',
      content: '因 \"微信小程序\" 限制 域名的原因 暂不支持 模拟付款 请使用 livekey 获取 charge 进行支付'
    });
    return;
    wx.showModal({
      title: '提示',
      content: '模拟付款?',
      success: function (res) {
        if (res.confirm) {
          console.log(url);
          wx.request({
            url: 'https://activity.pingxx.com/demos/base/notfiy',
            data: {url: url},
            fail: function (res) {
            },
            complete: function (res) {
              var status = res.statusCode
              if (status >= 200 && status < 400 && res.data == 'success') {
                callbacks.innerCallback('success');
              } else {
                var extra = 'http_code:' + status + ';response:' + res.data;
                callbacks.innerCallback('fail',
                    callbacks.error('testmode_notify_fail', extra));
              }
            }
          });

        }
      }
    });
  }
};
