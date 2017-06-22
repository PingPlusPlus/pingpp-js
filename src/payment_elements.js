/**
 * Created by dong on 2016/12/30.
 */

var callbacks = require('./callbacks');
var hasOwn = {}.hasOwnProperty;

module.exports = {
  id: null,
  or_id: null,
  channel: null,
  app: null,
  credential: {},
  extra: null,
  livemode: null,
  order_no: null,
  time_expire: null,

  init: function (charge_or_order) {
    var charge;
    if (typeof charge_or_order === 'string') {
      try {
        charge = JSON.parse(charge_or_order);
      } catch (err) {
        callbacks.innerCallback('fail',
            callbacks.error('json_decode_fail', err));
        return;
      }
    } else {
      charge = charge_or_order;
    }

    if (typeof charge === 'undefined') {
      callbacks.innerCallback('fail', callbacks.error('json_decode_fail'));
      return;
    }

    if (hasOwn.call(charge, 'object') && charge.object == 'order') {
      charge.or_id = charge.id;
      charge.id = charge.charge;
      charge.order_no = charge.merchant_order_no;
      var charge_essentials = charge.charge_essentials;
      charge.channel = charge_essentials.channel;
      charge.credential = charge_essentials.credential;
      charge.extra = charge_essentials.extra;
    }

    for (var key in this) {
      if (hasOwn.call(charge, key)) {
        this[key] = charge[key];
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