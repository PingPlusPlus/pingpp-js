var utils = require('../utils');
var hasOwn = {}.hasOwnProperty;

module.exports = {

  JDPAY_WAP_URL_OLD: 'https://m.jdpay.com/wepay/web/pay',
  JDPAY_H5_URL: 'https://h5pay.jd.com/jdpay/saveOrder',
  JDPAY_PC_URL: 'https://wepay.jd.com/jdpay/saveOrder',

  handleCharge: function(charge) {
    var credential = charge.credential[charge.channel];
    var request_url = this.JDPAY_H5_URL;
    if (hasOwn.call(credential, 'channelUrl')) {
      request_url = credential.channelUrl;
      delete credential.channelUrl;
    } else if (hasOwn.call(credential, 'merchantRemark')) {
      request_url = this.JDPAY_WAP_URL_OLD;
    }
    utils.formSubmit(request_url, 'post', credential);
  }
};
