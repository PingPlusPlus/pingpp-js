var wxPub = require('./wx_pub');

/*global WeixinJSBridge*/
wxPub.callpay = function () {
  var self = this;
  if (typeof WeixinJSBridge == 'undefined') {
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
};

module.exports = wxPub;
