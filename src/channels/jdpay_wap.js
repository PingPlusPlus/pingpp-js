var utils = require('../utils');

module.exports = {

  JDPAY_WAP_URL: 'https://m.jdpay.com/wepay/web/pay',

  handleCharge: function(charge) {
    var credential = charge.credential[charge.channel];
    utils.formSubmit(this.JDPAY_WAP_URL, 'post', credential);
  }
};
