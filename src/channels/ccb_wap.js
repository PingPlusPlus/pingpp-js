var utils = require('../utils');
var hasOwn = {}.hasOwnProperty;
var callbacks = require('../callbacks');

module.exports = {

  CCB_WAP_URL_BASE: 'https://ibsbjstar.ccb.com.cn/CCBIS/ccbMain?',

  handleCharge: function(charge) {
    var channel = charge.channel;
    var credential = charge.credential[channel];
    if (!hasOwn.call(credential, 'orderinfo')) {
      callbacks.innerCallback('fail',
        callbacks.error('invalid_credential', 'missing_field:orderinfo'));
      return;
    }

    var targetURL = this.CCB_WAP_URL_BASE + credential['orderinfo'];
    utils.redirectTo(targetURL, channel);
  }
};
