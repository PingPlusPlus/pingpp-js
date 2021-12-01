var utils = require('../utils');
var callbacks = require('../callbacks');
var hasOwn = {}.hasOwnProperty;

module.exports = {
  handleCharge: function (charge) {
    var credential = charge.credential[charge.channel];
    if (typeof credential === 'string') {
      utils.redirectTo(credential, charge.channel);
    } else {
      callbacks.innerCallback('fail',
        callbacks.error('invalid_credential', 'credential 格式不正确'));
    }
  }
};