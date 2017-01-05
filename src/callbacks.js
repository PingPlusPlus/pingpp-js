var payment_elements = require('./payment_elements.js');
module.exports = {

  userCallback: undefined,

  innerCallback: function(result, err) {
    if (typeof this.userCallback === 'function') {
      if (typeof err === 'undefined') {
        err = this.error();
      }
      this.userCallback(result, err);
      this.userCallback = undefined;
      payment_elements.clear();
    }
  },

  error: function(msg, extra) {
    msg = (typeof msg === 'undefined') ? '' : msg;
    extra = (typeof extra === 'undefined') ? '' : extra;
    return {
      msg: msg,
      extra: extra
    };
  }
};
