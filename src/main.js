var version = require('./version').v;
var hasOwn = {}.hasOwnProperty;

var PingppSDK = function () {
  require('./init').init();
};

PingppSDK.prototype.version = version;

module.exports = new PingppSDK();

var testmode = require('./testmode');
var callbacks = require('./callbacks');
var PingppError = require('./errors').Error;
var mods = require('./mods');
var stash = require('./stash');
var dc = require('./collection');
var payment_elements = require('./payment_elements');

PingppSDK.prototype.createPayment = function (
  chargeJSON, callback, signature, debug
) {
  if (typeof callback === 'function') {
    callbacks.userCallback = callback;
  }

  try {
    payment_elements.init(chargeJSON);
  } catch (e) {
    if (e instanceof PingppError) {
      callbacks.innerCallback('fail',
        callbacks.error(e.message, e.extra));
      return;
    } else {
      throw e;
    }
  }

  if (!hasOwn.call(payment_elements, 'id')) {
    callbacks.innerCallback('fail',
      callbacks.error('invalid_charge', 'no_charge_id'));
    return;
  }
  if (!hasOwn.call(payment_elements, 'channel')) {
    callbacks.innerCallback('fail',
      callbacks.error('invalid_charge', 'no_channel'));
    return;
  }

  if (hasOwn.call(payment_elements, 'app')) {
    if (typeof payment_elements.app === 'string') {
      stash.app_id = payment_elements.app;
    } else if (typeof payment_elements.app === 'object' &&
      typeof payment_elements.app.id === 'string') {
      stash.app_id = payment_elements.app.id;
    }
  }
  dc.report({
    type: stash.type || 'pure_sdk_click',
    channel: payment_elements.channel,
    ch_id: payment_elements.id
  });
  var channel = payment_elements.channel;
  if (!hasOwn.call(payment_elements, 'credential')) {
    callbacks.innerCallback('fail',
      callbacks.error('invalid_charge', 'no_credential'));
    return;
  }
  if (!payment_elements.credential) {
    callbacks.innerCallback('fail',
      callbacks.error('invalid_credential', 'credential_is_undefined'));
    return;
  }
  if (!hasOwn.call(payment_elements.credential, channel)) {
    callbacks.innerCallback('fail',
      callbacks.error('invalid_credential', 'credential_is_incorrect'));
    return;
  }
  if (!hasOwn.call(payment_elements, 'livemode')) {
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
  if (payment_elements.livemode === false) {
    if (hasOwn.call(channelModule, 'runTestMode')) {
      channelModule.runTestMode(payment_elements);
    } else {
      testmode.runTestMode(payment_elements);
    }
    return;
  }

  if (typeof signature != 'undefined') {
    stash.signature = signature;
  }
  if (typeof debug == 'boolean') {
    stash.debug = debug;
  }
  channelModule.handleCharge(payment_elements);
};

PingppSDK.prototype.setAPURL = function (url) {
  stash.APURL = url;
};

PingppSDK.prototype.setUrlReturnCallback = function (callback, channels) {
  if (typeof callback === 'function') {
    callbacks.urlReturnCallback = callback;
  } else {
    throw 'callback need to be a function';
  }

  if (typeof channels !== 'undefined') {
    if (Array.isArray(channels)) {
      callbacks.urlReturnChannels = channels;
    } else {
      throw 'channels need to be an array';
    }
  }
};

PingppSDK.prototype.signAgreement = function (agreement, callback) {
  if (typeof callback === 'function') {
    callbacks.userAgreementCallback = callback;
  }

  var module = mods.getExtraModule('agreement');
  if (typeof module === 'undefined') {
    console.error('module "agreement" is undefined');
    callbacks.innerCallback('fail',
      callbacks.error('invalid_module',
        'module "agreement" is undefined')
    );
    return false;
  }

  return module.signAgreement(agreement);
};
