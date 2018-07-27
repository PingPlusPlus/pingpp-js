var hasOwn = {}.hasOwnProperty;
var mods = {};
module.exports = mods;

mods.channels = {
  alipay_pc_direct: require('./channels/alipay_pc_direct'),
  alipay_qr: require('./channels/alipay_qr'),
  alipay_wap: require('./channels/alipay_wap'),
  bfb_wap: require('./channels/bfb_wap'),
  cb_alipay_pc_direct: require('./channels/cb_alipay_pc_direct'),
  cb_alipay_wap: require('./channels/cb_alipay_wap'),
  cb_wx_pub: require('./channels/cb_wx_pub'),
  cmb_pc_qr: require('./channels/cmb_pc_qr'),
  cmb_wallet: require('./channels/cmb_wallet'),
  cp_b2b: require('./channels/cp_b2b'),
  fqlpay_qr: require('./channels/fqlpay_qr'),
  fqlpay_wap: require('./channels/fqlpay_wap'),
  isv_wap: require('./channels/isv_wap'),
  jdpay_wap: require('./channels/jdpay_wap'),
  paypal: require('./channels/paypal'),
  qpay_pub: require('./channels/qpay_pub'),
  upacp_b2b: require('./channels/upacp_b2b'),
  upacp_pc: require('./channels/upacp_pc'),
  upacp_wap: require('./channels/upacp_wap'),
  wx_lite: require('./channels/wx_lite'),
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
