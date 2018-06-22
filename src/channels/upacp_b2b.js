var utils = require('../utils');
var hasOwn = {}.hasOwnProperty;

module.exports = {

  UPACP_B2B_URL: 'https://gateway.test.95516.com/gateway/api/frontTransReq.do',

  handleCharge: function(charge) {
    var channel = charge.channel;
    var credential = charge.credential[channel];
    var baseURL = this.UPACP_B2B_URL;
    if (hasOwn.call(credential, 'channel_url')) {
      baseURL = credential.channel_url;
      delete credential.channel_url;
    }

    utils.formSubmit(baseURL, 'post', credential);
  }
};
