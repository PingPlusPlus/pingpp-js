var stash = require('./stash');
var utils = require('./utils');
var dc = require('./collection');

module.exports = {
  SRC_URL: 'https://cookie.pingxx.com',

  init: function() {
    var self = this;
    utils.documentReady(function(){
      self.initPuid();
    });
  },

  initPuid: function() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    var puid;
    if (typeof localStorage.pingpp_uid == 'undefined') {
      puid = utils.randomString();
      localStorage.pingpp_uid = puid;
    } else {
      puid = localStorage.pingpp_uid;
    }
    stash.puid = puid;
    if (!document.getElementById('p_analyse_iframe')) {
      var iframe = document.createElement('iframe');
      iframe.id = 'p_analyse_iframe';
      iframe.src = this.SRC_URL + '/?puid=' + puid;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }
    setTimeout(function() {
      dc.send();
    }, 0);
  }
};
