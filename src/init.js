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
    var puid = localStorage.getItem('pingpp_uid');
    if (puid === null) {
      puid = utils.randomString();
      try {
        localStorage.setItem('pingpp_uid', puid);
      } catch (e) {
        /* empty */
      }
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
