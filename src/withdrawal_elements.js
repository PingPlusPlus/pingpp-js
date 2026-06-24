var PingppError = require('./errors').Error;
var hasOwn = {}.hasOwnProperty;

module.exports = {
  id: null,
  object: null,
  channel: null,
  app: null,
  extra: null,
  livemode: null,
  order_no: null,
  status: null,
  amount: null,
  description: null,
  failure_msg: null,
  time_canceled: null,
  time_succeeded: null,

  init: function (params) {
    var withdrawal;
    if (typeof params === 'string') {
      try {
        withdrawal = JSON.parse(params);
      } catch (err) {
        throw new PingppError('json_decode_fail', err);
      }
    } else {
      withdrawal = params;
    }

    if (typeof withdrawal === 'undefined') {
      throw new PingppError('json_decode_fail');
    }

    for (var key in this) {
      if (hasOwn.call(withdrawal, key)) {
        this[key] = withdrawal[key];
      }
    }
    return this;
  },

  clear: function () {
    for (var key in this) {
      if (typeof this[key] !== 'function') {
        this[key] = null;
      }
    }
  }
};
