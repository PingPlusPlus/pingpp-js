var utils = require('../utils');

module.exports = {

  handleCharge: function(charge) {
    var credential = charge.credential[charge.channel];
    var request_url = credential.channelUrl;
    delete credential.channelUrl;

    utils.formSubmit(request_url, 'post', credential);
  }
};
