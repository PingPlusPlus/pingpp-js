var hasOwn = {}.hasOwnProperty;
var callbacks = require('./callbacks');
var utils = require('./utils');

module.exports = {
  signAgreement: function (agreement) {
    var agreementObj;
    if (typeof agreement === 'string') {
      try {
        agreementObj = JSON.parse(agreement);
      } catch (err) {
        callbacks.innerAgreementCallback('fail',
          callbacks.error('json_decode_fail', err));
        return false;
      }
    } else {
      agreementObj = agreement;
    }

    if (typeof agreementObj === 'undefined') {
      callbacks.innerAgreementCallback('fail',
        callbacks.error('json_decode_fail'));
      return false;
    }

    if (!hasOwn.call(agreementObj, 'object')
      || agreementObj.object !== 'agreement'
      || !hasOwn.call(agreementObj, 'channel')
      || !hasOwn.call(agreementObj, 'credential')
      || typeof agreementObj.credential !== 'object'
    ) {
      callbacks.innerAgreementCallback('fail',
        callbacks.error('invalid_object'));
      return false;
    }

    if (!hasOwn.call(agreementObj.credential, agreementObj.channel)) {
      callbacks.innerAgreementCallback('fail',
        callbacks.error('invalid_credential'));
      return false;
    }

    var credential = agreementObj.credential[agreementObj.channel];
    var urlToOpen;
    if (typeof credential === 'string') {
      urlToOpen = credential;
    } else if (hasOwn.call(credential, 'credential')
      && typeof credential.credential === 'string'
    ) {
      urlToOpen = credential.credential;
    }

    if (typeof urlToOpen === 'undefined') {
      callbacks.innerAgreementCallback('fail',
        callbacks.error('invalid_credential'));
      return false;
    }

    if (agreementObj.channel.substring(0, 6) === 'alipay') {
      var url = new URL(urlToOpen);
      urlToOpen = 'http://d.alipay.com/i/index.htm?iframeSrc='
        + encodeURIComponent('alipays://platformapi/startapp?appId=60000157'
          +'&appClearTop=false&startMultApp=YES&sign_params='
          + encodeURIComponent(url.search.substring(1))
        );
    }

    setTimeout(function() {
      utils.redirectTo(urlToOpen);
    }, 0);

    return true;
  }
};