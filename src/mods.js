var hasOwn = {}.hasOwnProperty;
var mods = {};
module.exports = mods;

mods.channels = {
  alipay_pc_direct: require('./channels/alipay_pc_direct'),
  alipay_wap: require('./channels/alipay_wap'),
  bfb_wap: require('./channels/bfb_wap'),
  cp_b2b: require('./channels/cp_b2b'),
  fqlpay_qr: require('./channels/fqlpay_qr'),
  fqlpay_wap: require('./channels/fqlpay_wap'),
  jdpay_wap: require('./channels/jdpay_wap'),
  upacp_pc: require('./channels/upacp_pc'),
  upacp_wap: require('./channels/upacp_wap'),
  wx_pub: require('./channels/wx_pub'),
  wx_wap: require('./channels/wx_wap'),
  yeepay_wap: require('./channels/yeepay_wap')
};

mods.extras = {
  ap: require('./channels/extras/ap')
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
