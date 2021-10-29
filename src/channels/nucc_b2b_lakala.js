var utils = require('../utils');
var hasOwn = {}.hasOwnProperty;

module.exports = {
  handleCharge: function (charge) {
    var credential = charge.credential[charge.channel];
    if (hasOwn.call(credential, 'bankUrl')) {
      request_url = credential.bankUrl;
      delete credential.bankUrl;
    }

    utils.formSubmit(request_url, 'post', credential);
  }
};
