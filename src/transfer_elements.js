var PingppError = require('./errors').Error;
var hasOwn = {}.hasOwnProperty;

module.exports = {
  id: null,
  channel: null,
  app: null,
  extra: null,
  livemode: null,
  order_no: null,
  time_expire: null,
  status: null,

  init: function (params) {
    let transfer;
    if (typeof params === 'string') {
      try {
        transfer = JSON.parse(params);
      } catch (err) {
        throw new PingppError('json_decode_fail', err);
      }
    } else {
      transfer = params;
    }

    if (typeof transfer === 'undefined') {
      throw new PingppError('json_decode_fail');
    }

    for (var key in this) {
      if (hasOwn.call(transfer, key)) {
        this[key] = transfer[key];
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