module.exports = {
  userCallback: undefined,

  urlReturnCallback: undefined,

  urlReturnChannels: [
    'alipay_pc_direct', // 默认只开启 alipay_pc_direct 使用 callback 返回 URL
  ],

  userAgreementCallback: undefined,

  userTransferCallback: undefined,

  innerCallback: function (result, err) {
    if (typeof this.userCallback === 'function') {
      if (typeof err === 'undefined') {
        err = this.error();
      }
      this.userCallback(result, err);
      this.userCallback = undefined;
      var payment_elements = require('./payment_elements');
      payment_elements.clear();
    }
  },

  error: function (msg, extra) {
    msg = typeof msg === 'undefined' ? '' : msg;
    extra = typeof extra === 'undefined' ? '' : extra;
    return {
      msg: msg,
      extra: extra,
    };
  },

  triggerUrlReturnCallback: function (err, url) {
    if (typeof this.urlReturnCallback === 'function') {
      this.urlReturnCallback(err, url);
    }
  },

  shouldReturnUrlByCallback: function (channel) {
    if (typeof this.urlReturnCallback !== 'function') {
      return false;
    }
    return this.urlReturnChannels.indexOf(channel) !== -1;
  },

  innerAgreementCallback: function (result, err) {
    if (typeof this.userAgreementCallback === 'function') {
      if (typeof err === 'undefined') {
        err = this.error();
      }
      this.userAgreementCallback(result, err);
      this.userAgreementCallback = undefined;
    }
  },

  innerTransferCallback: function (result, err) {
    if (typeof this.userTransferCallback === 'function') {
      if (typeof err === 'undefined') {
        err = this.error();
      }
      this.userTransferCallback(result, err);
      this.userTransferCallback = undefined;
    }
  },
};
