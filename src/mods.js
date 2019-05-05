var hasOwn = {}.hasOwnProperty;
var mods = {};
module.exports = mods;

mods.channels = {
  alipay_lite: require('./channels/alipay_lite'),
  alipay_pc_direct: require('./channels/alipay_pc_direct'),
  alipay_qr: require('./channels/alipay_qr'),
  alipay_wap: require('./channels/alipay_wap'),
  bfb_wap: require('./channels/bfb_wap'),
  cb_alipay_pc_direct: require('./channels/cb_alipay_pc_direct'),
  cb_alipay_wap: require('./channels/cb_alipay_wap'),
  cb_wx_pub: require('./channels/cb_wx_pub'),
  ccb_qr: require('./channels/ccb_qr'),
  cmb_pc_qr: require('./channels/cmb_pc_qr'),
  cmb_wallet: require('./channels/cmb_wallet'),
  coolcredit: require('./channels/coolcredit'),
  cp_b2b: require('./channels/cp_b2b'),
  isv_lite: require('./channels/isv_lite'),
  isv_wap: require('./channels/isv_wap'),
  jdpay_wap: require('./channels/jdpay_wap'),
  paypal: require('./channels/paypal'),
  qpay_pub: require('./channels/qpay_pub'),
  upacp_b2b: require('./channels/upacp_b2b'),
  upacp_pc: require('./channels/upacp_pc'),
  upacp_wap: require('./channels/upacp_wap'),
  wx_lite: require('./channels/wx_lite'),
  wx_pub: require('./channels/wx_pub'),
  wx_pub_hzbank: require('./channels/wx_pub_hzbank'),
  wx_wap: require('./channels/wx_wap'),
  yeepay_wap: require('./channels/yeepay_wap')
};

mods.extras = {
  ap: require('./channels/extras/ap'),
  agreement: require('./agreement')
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
