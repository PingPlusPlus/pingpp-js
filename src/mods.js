var hasOwn = {}.hasOwnProperty;
var mods = {};
module.exports = mods;

mods.channels = {
  abc_pay: require('./channels/abc_pay'),
  abc_pub: require('./channels/abc_pub'),
  alipay: require('./channels/alipay'),
  alipay_lite: require('./channels/alipay_lite'),
  alipay_pc_direct: require('./channels/alipay_pc_direct'),
  alipay_qr: require('./channels/alipay_qr'),
  alipay_qr_lakala: require('./channels/alipay_qr_lakala'),
  alipay_wap: require('./channels/alipay_wap'),
  alipay_wap_lakala: require('./channels/alipay_wap_lakala'),
  bfb_wap: require('./channels/bfb_wap'),
  cb_alipay_pc_direct: require('./channels/cb_alipay_pc_direct'),
  cb_alipay_wap: require('./channels/cb_alipay_wap'),
  cb_wx_pub: require('./channels/cb_wx_pub'),
  ccb_qr: require('./channels/ccb_qr'),
  ccb_wap: require('./channels/ccb_wap'),
  chinaums_alipay_pub: require('./channels/chinaums_alipay_pub'),
  chinaums_alipay_wap: require('./channels/chinaums_alipay_wap'),
  chinaums_upacp_wap: require('./channels/chinaums_upacp_wap'),
  chinaums_wx_pub: require('./channels/chinaums_wx_pub'),
  chinaums_wx_wap: require('./channels/chinaums_wx_wap'),
  cmb_pc_qr: require('./channels/cmb_pc_qr'),
  cmb_wallet: require('./channels/cmb_wallet'),
  cp_b2b: require('./channels/cp_b2b'),
  isv_lite: require('./channels/isv_lite'),
  isv_wap: require('./channels/isv_wap'),
  jdpay_wap: require('./channels/jdpay_wap'),
  nucc_b2b_lakala: require('./channels/nucc_b2b_lakala'),
  nucc_b2c_lakala: require('./channels/nucc_b2c_lakala'),
  pab_pc: require('./channels/pab_pc'),
  paypal: require('./channels/paypal'),
  qpay_pub: require('./channels/qpay_pub'),
  upacp_b2b: require('./channels/upacp_b2b'),
  upacp_pc: require('./channels/upacp_pc'),
  upacp_wap: require('./channels/upacp_wap'),
  wx_lite: require('./channels/wx_lite'),
  wx_lite_pab: require('./channels/wx_lite_pab'),
  wx_pub: require('./channels/wx_pub'),
  wx_pub_pab: require('./channels/wx_pub_pab'),
  wx_wap: require('./channels/wx_wap'),
  yeepay_wap: require('./channels/yeepay_wap'),
  yeepay_wx_lite: require('./channels/yeepay_wx_lite'),
  yeepay_wx_lite_ofl: require('./channels/yeepay_wx_lite_ofl'),
  yeepay_wx_pub: require('./channels/yeepay_wx_pub'),
  yeepay_wx_pub_ofl: require('./channels/yeepay_wx_pub_ofl')
};

mods.extras = {
  ap: require('./channels/extras/ap'),
  agreement: require('./agreement')
};

mods.transferChannels = {
  wx_pub: require('./transfer_channels/wx_pub'),
}

mods.getChannelModule = function(channel) {
  if (hasOwn.call(mods.channels, channel)) {
    return mods.channels[channel];
  }
  return undefined;
};

mods.getTransferChannelModule = function(channel) {
  if (hasOwn.call(mods.transferChannels, channel)) {
    return mods.transferChannels[channel];
  }
  return undefined;
};

mods.getExtraModule = function(name) {
  if (hasOwn.call(mods.extras, name)) {
    return mods.extras[name];
  }
  return undefined;
};
