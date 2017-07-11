var utils = require('../utils');
var hasOwn = {}.hasOwnProperty;

module.exports = {

  CMB_WALLET_URL:
    'https://netpay.cmbchina.com/netpayment/BaseHttp.dll?MB_EUserPay',

  handleCharge: function(charge) {
    var credential = charge.credential[charge.channel];
    var request_url = this.CMB_WALLET_URL;
    if (hasOwn.call(credential, 'ChannelUrl')) {
      request_url = credential.ChannelUrl;
      delete credential.ChannelUrl;
    }

    if (hasOwn.call(credential, 'channelVersion')) {
      delete credential.channelVersion;
    }

    utils.formSubmit(request_url, 'post', credential);
  }
};
