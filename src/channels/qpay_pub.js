var callbacks = require('../callbacks');
var utils = require('../utils');
var stash = require('../stash');
var hasOwn = {}.hasOwnProperty;

/*global mqq*/
module.exports = {
  SRC_URL: 'https://open.mobile.qq.com/sdk/qqapi.js?_bid=152',
  ID: 'mqq_api',

  handleCharge: function (charge) {
    var credential = charge.credential[charge.channel];

    if (!hasOwn.call(credential, 'token_id')) {
      callbacks.innerCallback('fail',
        callbacks.error('invalid_credential', 'missing_token_id'));
      return;
    }
    stash.tokenId = credential.token_id;
    utils.loadUrlJs(this.ID, this.SRC_URL, this.callpay);
  },

  callpay: function () {
    if (typeof mqq != 'undefined') {
      if (mqq.QQVersion == 0) {
        callbacks.innerCallback('fail',
          callbacks.error('Not in the QQ client'));
        delete stash.tokenId;
        return;
      }
      mqq.tenpay.pay({
        tokenId: stash.tokenId
      }, function (result) {
        if (result.resultCode == 0) {
          callbacks.innerCallback('success');
        } else {
          callbacks.innerCallback('fail',
            callbacks.error(result.retmsg));
        }
      });
    } else {
      callbacks.innerCallback('fail',
        callbacks.error('network_err'));
    }
    delete stash.tokenId;
  }
};