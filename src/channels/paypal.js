var utils = require('../utils');

module.exports = {
  handleCharge: function(charge) {
    var credential = charge.credential[charge.channel];
    utils.redirectTo(credential, charge.channel);
  }
};
