var utils = require('../utils');
var callbacks = require('../callbacks');
var hasOwn = {}.hasOwnProperty;

module.exports = {

  YEEPAY_WAP_URL: 'https://ok.yeepay.com/paymobile/api/pay/request',
  YEEPAY_WAP_TEST_URL: 'http://mobiletest.yeepay.com/paymobile/api/pay/request',

  handleCharge: function(charge) {
    var channel = charge.channel;
    var credential = charge.credential[channel];
    var fields = ['merchantaccount', 'encryptkey', 'data'];
    for (var k = 0; k < fields.length; k++) {
      if (!hasOwn.call(credential, fields[k])) {
        callbacks.innerCallback('fail',
          callbacks.error('invalid_credential', 'missing_field_' + fields[k]));
        return;
      }
    }
    var baseURL;
    if (hasOwn.call(credential, 'mode') && credential.mode == 'test') {
      baseURL = this.YEEPAY_WAP_TEST_URL;
    } else {
      baseURL = this.YEEPAY_WAP_URL;
    }
    utils.redirectTo(baseURL + '?' +
      utils.stringifyData(credential, channel, true));
  }
};
