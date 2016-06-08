var utils = require('../utils');

module.exports = {

  UPMP_WAP_URL: 'uppay://uppayservice/?style=token&paydata=',

  handleCharge: function(charge) {
    var credential = charge.credential[charge.channel];
    utils.redirectTo(this.UPMP_WAP_URL + credential.paydata);
  }
};
