var hasOwn = {}.hasOwnProperty;
var mods = {};
module.exports = mods;

mods.channels = {
  wx_pub: require('./channels/wx_pub'),
  upacp_wap: require('./channels/upacp_wap'),
  alipay_qr: require('./channels/alipay_qr'),
  alipay_wap: require('./channels/alipay_wap'),
  yeepay_wap: require('./channels/yeepay_wap'),
  jdpay_wap: require('./channels/jdpay_wap'),
  bfb_wap: require('./channels/bfb_wap')
};

mods.extras = {
  ap: require('./channels/extras/ap'),
  one: require('./pingpp_one/init')
};

mods.getChannelModule = function(channel) {
  if (hasOwn.call(mods.channels, channel)) {
    return mods.channels[channel];
  }
  return undefined;
};

mods.getExtraModule = function(name) {
  if (hasOwn.call(mods.extras, name)) {
    return mods.extras[name];
  }
  return undefined;
};
