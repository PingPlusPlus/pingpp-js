var utils = require('../../utils');
var callbacks = require('../../callbacks');
var hasOwn = {}.hasOwnProperty;

module.exports = {

  handleCharge: function(charge) {
    var credential = charge.credential[charge.channel];
    var targetURL;
    if (typeof credential === 'string') {
      targetURL = credential;
    } else if (hasOwn.call(credential, 'url')) {
      targetURL = credential.url;
    } else {
      callbacks.innerCallback('fail', callbacks.error('invalid_credential',
        'credential format is incorrect'));
      return;
    }
    utils.redirectTo(targetURL);
  }
};
