var redirectBase = require('./commons/redirect_base');
var callbacks = require('../callbacks');
var utils = require('../utils');
var hasOwn = {}.hasOwnProperty;

module.exports = {
  handleCharge: function (charge) {
    var extra = charge.extra;
    if (hasOwn.call(extra, 'pay_channel')) {
      var pay_channel = extra.pay_channel;
      if (pay_channel === 'wx' && !utils.inWeixin()) {
        callbacks.innerCallback('fail',
          callbacks.error('Not in the WeChat browser'));
        return;
      } else if (pay_channel === 'alipay' && !utils.inAlipay()) {
        callbacks.innerCallback('fail',
          callbacks.error('Not in the Alipay browser'));
        return;
      }
    } else {
      callbacks.innerCallback('fail',
        callbacks.error('invalid_charge', 'charge 格式不正确'));
      return;
    }
    redirectBase.handleCharge(charge);
  }
};
