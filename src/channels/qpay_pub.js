/**
 * Created by dong on 2016/11/9.
 */
var callbacks = require('../callbacks');
var utils = require('../utils');
var stash = require('../stash');
var hasOwn = {}.hasOwnProperty;

/*global mqq*/
module.exports = {
  SRC_URL: 'http://pub.idqqimg.com/qqmobile/qqapi.js?_bid=152',
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
        callbacks.innerCallback('fail', 'Not in the QQ client');
        delete stash.tokenId;
        return;
      }
      mqq.tenpay.pay({
        tokenId: stash.tokenId
      }, callbacks.userCallback);
    } else {
      callbacks.innerCallback('fail', 'network_err');
    }
    delete stash.tokenId;
  }
};