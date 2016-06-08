var utils = require('./utils');
var hasOwn = {}.hasOwnProperty;

module.exports = {

  PINGPP_MOCK_URL: 'http://sissi.pingxx.com/mock.php',

  runTestMode: function(charge) {
    var params = {
      'ch_id': charge.id,
      'scheme': 'http',
      'channel': charge.channel
    };
    if (hasOwn.call(charge, 'order_no')) {
      params.order_no = charge.order_no;
    } else if (hasOwn.call(charge, 'orderNo')) {
      params.order_no = charge.orderNo;
    }
    if (hasOwn.call(charge, 'time_expire')) {
      params.time_expire = charge.time_expire;
    } else if (hasOwn.call(charge, 'timeExpire')) {
      params.time_expire = charge.timeExpire;
    }
    if (hasOwn.call(charge, 'extra')) {
      params.extra = encodeURIComponent(JSON.stringify(charge.extra));
    }
    utils.redirectTo(this.PINGPP_MOCK_URL + '?' + utils.stringifyData(params));
  }
};
