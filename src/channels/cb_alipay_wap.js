var utils = require('../utils');
var mods = require('../mods');
var hasOwn = {}.hasOwnProperty;

module.exports = {

  ALIPAY_WAP_URL: 'https://intlmapi.alipay.com/gateway.do',

  handleCharge: function(charge) {
    var channel = charge.channel;
    var credential = charge.credential[channel];
    var baseURL = this.ALIPAY_WAP_URL;
    if (hasOwn.call(credential, 'channel_url')) {
      baseURL = credential.channel_url;
    }
    if (!hasOwn.call(credential, '_input_charset')) {
      if ((hasOwn.call(credential, 'service')
          && credential.service === 'create_forex_trade_wap')
      ) {
        credential._input_charset = 'utf-8';
      }
    }

    var query = utils.stringifyData(credential, channel, true);
    var targetURL = baseURL + '?' + query;
    var ap = mods.getExtraModule('ap');
    if (utils.inWeixin() && typeof ap !== 'undefined') {
      ap.pay(targetURL);
    } else {
      utils.redirectTo(targetURL, channel);
    }
  }
};
