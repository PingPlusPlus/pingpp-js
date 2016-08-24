var utils = require('./utils');
var stash = require('./stash');
var md5 = require('./libs/md5');

var collection = {
  seperator: '###',
  limit: 1,
  report_url: 'https://statistics.pingxx.com/one_stats',
  timeout: 100
};
var getParam = function(str, param) {
  var reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)', 'i');
  var r = str.substr(0).match(reg);
  if (r !== null) return unescape(r[2]);
  return null;
};
var getUserAgent = function() {
  return navigator.userAgent;
};
var getHost = function() {
  return window.location.host;
};

collection.store = function(obj) {
  if (typeof localStorage === 'undefined' || localStorage === null) return;
  var _this = this;
  var reportData = {};
  reportData.app_id = obj.app_id || stash.app_id || 'app_not_defined';
  reportData.ch_id = obj.ch_id || '';
  reportData.channel = obj.channel || '';
  reportData.type = obj.type || '';
  reportData.user_agent = getUserAgent();
  reportData.host = getHost();
  reportData.time = new Date().getTime();
  reportData.puid = stash.puid;

  var reportStr = 'app_id=' + reportData.app_id +
    '&channel=' + reportData.channel + '&ch_id=' + reportData.ch_id +
    '&host=' + reportData.host + '&time=' + reportData.time +
    '&type=' + reportData.type + '&user_agent=' + reportData.user_agent +
    '&puid=' + reportData.puid;

  var statsToSave = reportStr;
  if (localStorage.getItem('PPP_ONE_STATS') !== null &&
    localStorage.getItem('PPP_ONE_STATS').length !== 0
  ) {
    statsToSave = localStorage.getItem('PPP_ONE_STATS') +
      _this.seperator + reportStr;
  }
  try {
    localStorage.setItem('PPP_ONE_STATS', statsToSave);
  } catch (e) {
    /* empty */
  }
};

collection.send = function() {
  if (typeof localStorage === 'undefined' || localStorage === null) return;
  var _this = this;
  var pppOneStats = localStorage.getItem('PPP_ONE_STATS');
  if (pppOneStats === null ||
    pppOneStats.split(_this.seperator).length < _this.limit) {
    return;
  }
  try {
    var data = [];
    var origin = pppOneStats.split(_this.seperator);
    var token = md5(origin.join('&'));

    for (var i = 0; i < origin.length; i++) {
      data.push({
        app_id: getParam(origin[i], 'app_id'),
        channel: getParam(origin[i], 'channel'),
        ch_id: getParam(origin[i], 'ch_id'),
        host: getParam(origin[i], 'host'),
        time: getParam(origin[i], 'time'),
        type: getParam(origin[i], 'type'),
        user_agent: getParam(origin[i], 'user_agent'),
        puid: getParam(origin[i], 'puid')
      });
    }

    utils.request(_this.report_url, 'POST', data, function(data, status) {
      if (status == 200) {
        localStorage.removeItem('PPP_ONE_STATS');
      }
    }, undefined, {
      'X-Pingpp-Report-Token': token
    });
  } catch (e) {
    /* empty */
  }
};

collection.report = function(obj) {
  var _this = this;
  _this.store(obj);
  setTimeout(function(){
    _this.send();
  }, _this.timeout);
};

module.exports = collection;
