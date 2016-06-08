var version = require('./version').v;
var testmode = require('./testmode');
var callbacks = require('./callbacks');
var mods = require('./mods');
var stash = require('./stash');
var dc = require('./collection');

var hasOwn = {}.hasOwnProperty;
var PingppSDK = function() {
  require('./init').init();
};

PingppSDK.prototype = {

  version: version,

  createPayment: function(chargeJSON, callback, signature, debug) {
    if (typeof callback === 'function') {
      callbacks.userCallback = callback;
    }
    var charge;
    if (typeof chargeJSON === 'string') {
      try {
        charge = JSON.parse(chargeJSON);
      } catch (err) {
        callbacks.innerCallback('fail',
          callbacks.error('json_decode_fail', err));
        return;
      }
    } else {
      charge = chargeJSON;
    }
    if (typeof charge === 'undefined') {
      callbacks.innerCallback('fail', callbacks.error('json_decode_fail'));
      return;
    }
    if (!hasOwn.call(charge, 'id')) {
      callbacks.innerCallback('fail',
        callbacks.error('invalid_charge', 'no_charge_id'));
      return;
    }
    if (!hasOwn.call(charge, 'channel')) {
      callbacks.innerCallback('fail',
        callbacks.error('invalid_charge', 'no_channel'));
      return;
    }
    if (hasOwn.call(charge, 'app')) {
      if (typeof charge.app === 'string') {
        stash.app_id = charge.app;
      } else if (typeof charge.app === 'object' &&
        typeof charge.app.id === 'string') {
        stash.app_id = charge.app.id;
      }
    }
    dc.report({
      type: 'pure_sdk_click',
      channel: charge.channel,
      ch_id: charge.id
    });
    var channel = charge.channel;
    if (!hasOwn.call(charge, 'credential')) {
      callbacks.innerCallback('fail',
        callbacks.error('invalid_charge', 'no_credential'));
      return;
    }
    if (!charge.credential) {
      callbacks.innerCallback('fail',
        callbacks.error('invalid_credential', 'credential_is_undefined'));
      return;
    }
    if (!hasOwn.call(charge.credential, channel)) {
      callbacks.innerCallback('fail',
        callbacks.error('invalid_credential', 'credential_is_incorrect'));
      return;
    }
    if (!hasOwn.call(charge, 'livemode')) {
      callbacks.innerCallback('fail',
        callbacks.error('invalid_charge', 'no_livemode_field'));
      return;
    }
    var channelModule = mods.getChannelModule(channel);
    if (typeof channelModule === 'undefined') {
      console.error('channel module "' + channel + '" is undefined');
      callbacks.innerCallback('fail',
        callbacks.error('invalid_channel',
          'channel module "' + channel + '" is undefined')
      );
      return;
    }
    if (charge.livemode === false) {
      if (hasOwn.call(channelModule, 'runTestMode')) {
        channelModule.runTestMode(charge);
      } else {
        testmode.runTestMode(charge);
      }
      return;
    }

    if (typeof signature != 'undefined') {
      stash.signature = signature;
    }
    if (typeof debug == 'boolean') {
      stash.debug = debug;
    }
    channelModule.handleCharge(charge);
  },

  setAPURL: function(url) {
    stash.APURL = url;
  }
};

module.exports = new PingppSDK();
