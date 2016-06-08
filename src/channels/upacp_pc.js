var utils = require('../utils');

module.exports = {

  UPACP_PC_URL: 'https://gateway.95516.com/gateway/api/frontTransReq.do',

  handleCharge: function(charge) {
    var credential = charge.credential[charge.channel];
    utils.formSubmit(this.UPACP_PC_URL, 'post', credential);
  }
};
