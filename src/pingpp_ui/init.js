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
var pingpp = require('../main');
var sdk_version = require('../version').v;

var pingpp_ui = {
  AD_URL: 'https://one.pingxx.com/v1/ad',

  version: '2.0.3',
  ad_version: '1.0.2',

  init: function (opt, callback) {

    utils.hideLoading();

    stash.userData = opt;
    stash.isDebugMode = opt.debug || false;
    stash.userCallback = callback;

    bind.moveFlag = false;

    var channel = opt.channel || {};

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
        case 'wx_wap':
          _channel.wx_wap = 'wx_wap';
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
    _channel.channel = channel;

    Handlebars.registerHelper('compare', function (left, right, options) {
      if (left == right) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    var html = Handlebars.templates.channel(_channel);
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

  createPayment: function(data, callback) {
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    try{
      localStorage.setItem('pingpp_app_id', data.app);
      localStorage.setItem('pingpp_ch_id', data.id);
      localStorage.setItem('pingpp_amount', data.amount);
      localStorage.setItem('pingpp_subject', data.subject);
      localStorage.setItem('pingpp_channel', data.channel);
    } catch (e) { /* empty */}

    pingpp.createPayment(data, callback);
  },

  success: function (callback, continueCallback) {
    var _this = this;
    window.ShitudtAdFinish = continueCallback;
    if(typeof continueCallback != 'function'){
      callback({
        status:false,
        msg:'参数类型必须为 function'
      });
      return;
    }

    comUtil.documentReady(function() {
      try {
        stash.app_id = localStorage.getItem('pingpp_app_id');
        stash.ch_id = localStorage.getItem('pingpp_ch_id');
        stash.amount = localStorage.getItem('pingpp_amount');
        stash.subject = localStorage.getItem('pingpp_subject');
        stash.channel = localStorage.getItem('pingpp_channel');
      } catch (e) { /* empty */ }

      /*global pingpp_app_id,pingpp_ch_id,pingpp_amount,pingpp_subject,pingpp_channel*/
      if(!stash.app_id && ('undefined' != typeof pingpp_app_id)){
        stash.app_id = pingpp_app_id;
      }
      if(!stash.ch_id && ('undefined' != typeof pingpp_ch_id)) {
        stash.ch_id = pingpp_ch_id;
      }
      if(!stash.amount && ('undefined' != typeof pingpp_amount)) {
        stash.amount = pingpp_amount;
      }
      if(!stash.subject && ('undefined' != typeof pingpp_subject)) {
        stash.subject = pingpp_subject;
      }
      if(!stash.channel && ('undefined' != typeof pingpp_channel)) {
        stash.channel = pingpp_channel;
      }
      var device = 'H5';
      if(comUtil.inAlipay()) {
        device = 'alipay';
      } else if(comUtil.inWeixin()) {
        device = 'wx';
      }

      comUtil.request(_this.AD_URL, 'GET', {
        app: stash.app_id,
        charge_id: stash.ch_id,
        amount:stash.amount,
        subject: stash.subject,
        channel: stash.channel,
        version: _this.ad_version,
        sdk_version: sdk_version,
        one_version: _this.version,
        device: device
        /* eslint-disable no-unused-vars */
      }, function (res, status) {
        /* eslint-enable no-unused-vars */
        var data = {};
        try {
          data = JSON.parse(res);
          if (data.result == 'success' && data.type == 'html') {
            document.open();
            document.write(data.content);
            document.close();
            return;
          }
        } catch (e) { /* empty */ }

        Handlebars.registerHelper('position', function (left, right, options) {
          if (left == right) {
            return options.inverse(this);
          } else {
            return options.fn(this);
          }
        });
        var htmlStr = Handlebars.templates.success(data.content);
        var one_body = document.createElement('div');
        one_body.id = 'p_one_frame';
        one_body.innerHTML = htmlStr;
        document.body.appendChild(one_body);
        document.getElementById('p_one_goon')
          .addEventListener('click', function () {
            continueCallback();
          });
      });
    });
  }
};

if (typeof window != 'undefined') {
  window.pingpp_ui = pingpp_ui;
  comUtil.documentReady(function () {
    setTimeout(function () {
      var e = document.createEvent('Event');
      e.initEvent('pingpp_one_ready', true, true);
      document.dispatchEvent(e);
    }, 0);
  });
}

module.exports = pingpp_ui;
