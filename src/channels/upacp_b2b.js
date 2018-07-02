var utils = require('../utils');
var hasOwn = {}.hasOwnProperty;

module.exports = {

  handleCharge: function(charge) {
    var channel = charge.channel;
    var credential = charge.credential[channel];
    var baseURL;
    if (hasOwn.call(credential, 'channel_url')) {
      baseURL = credential.channel_url;
      delete credential.channel_url;
    }

    utils.formSubmit(baseURL, 'post', credential);
  }
};
