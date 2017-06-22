/**
 * Created by dong on 2016/11/14.
 */
var stash = require('../stash');
var mods = require('../mods');
var comUtil = require('../utils');
var Handlebars = require('./handlebars.runtime.js');
require('./css.hbs.js');
var bind = require('./bind');
var utils = require('./utils');
/*global pingpp*/

var pingpp_one = {
  init: function (opt, callback) {

    utils.hideLoading();

    stash.userData = opt;
    stash.isDebugMode = opt.debug || false;
    stash.userCallback = callback;

    bind.moveFlag = false;

    var channel = opt.channel || {};

    if (typeof opt.app_id == 'undefined') {
      callback({
        status: false,
        msg: '缺少参数app_id',
        debug: stash.isDebugMode
      });
      return;
    }

    if (typeof opt.amount == 'undefined') {
      callback({
        status: false,
        msg: '缺少参数 amount',
        debug: stash.isDebugMode
      });
      return;
    }

    if (typeof opt.channel == 'undefined') {
      callback({
        status: false,
        msg: '缺少参数 channel',
        debug: stash.isDebugMode
      });
      return;
    }

    if (opt.channel.length == 0) {
      callback({
        status: false,
        msg: '请至少配置一个渠道',
        debug: stash.isDebugMode
      });
      return;
    }

    if (typeof opt.charge_url == 'undefined') {
      callback({
        status: false,
        msg: '缺少参数 charge_url',
        debug: stash.isDebugMode
      });
      return;
    }

    //是否有非法渠道
    for (var i = 0; i < channel.length; i++) {
      if (typeof mods.getChannelModule(channel[i]) == 'undefined') {
        callback({
          status: false,
          msg: '传入了非法渠道：' + channel[i],
          debug: stash.isDebugMode
        });
        return;
      }
    }

    var _channel = {};
    for (var j = 0; j < channel.length; j++) {
      switch (channel[j]) {
        case 'alipay_wap':
          _channel.alipay_wap = 'alipay_wap';
          break;
        case 'upmp_wap':
          _channel.upmp_wap = 'upmp_wap';
          break;
        case 'upacp_wap':
          _channel.upacp_wap = 'upacp_wap';
          break;
        case 'bfb_wap':
          _channel.bfb_wap = 'bfb_wap';
          break;
        case 'wx_pub':
          _channel.wx_pub = 'wx_pub';
          break;
        case 'jdpay_wap':
          _channel.jdpay_wap = 'jdpay_wap';
          break;
        case 'yeepay_wap':
          _channel.yeepay_wap = 'yeepay_wap';
          break;
      }
    }

    //如果不在微信webview里，不能传wx_pub
    if (_channel.wx_pub && !comUtil.inWeixin()) {
      channel = utils.removeFromArray(channel, 'wx_pub');
      delete _channel.wx_pub;
    }

    //如果在微信webview里，不能传upmp_wap
    if (_channel.upmp_wap && comUtil.inWeixin()) {
      channel = utils.removeFromArray(channel, 'upmp_wap');
      delete _channel.upmp_wap;
    }

    //如果传了wx_pub则需要传openid
    if (_channel.wx_pub && comUtil.inWeixin()) {
      if (!opt.open_id || opt.open_id == '') {
        callback({
          status: false,
          msg: '缺少参数 open_id',
          debug: stash.isDebugMode
        });
        return;
      }
    }
    _channel.client = navigator.userAgent.toLowerCase().match('iphone') ?
        '' : ' p_one_default';
    var html = Handlebars.templates.sample(_channel);
    utils.createFrame(html);

    setTimeout(function () {
      utils.open();
      setTimeout(function () {
        bind.maskClickable = true;
      }, 400);
      setTimeout(function () {
        bind.buttonClickable = true;
        bind.init();
      }, 700);
    }, 0);
  },

  resume: function () {
    pingpp.createPayment(stash.charge, bind.callbackCharge);
  },

  success: function (callback) {
    var htmlStr = Handlebars.templates.success();
    var one_body = document.createElement('div');
    one_body.id = 'p_one_frame';
    one_body.innerHTML = htmlStr;
    document.body.appendChild(one_body);

    document.getElementById('p_one_goon')
        .addEventListener('click', function () {
          callback();
        });
  }
};

window.pingpp_one = pingpp_one;
module.exports =  pingpp_one;