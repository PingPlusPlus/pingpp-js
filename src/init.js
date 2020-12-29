var stash = require('./stash');
var utils = require('./utils');

module.exports = {
  init: function() {
    var self = this;
    utils.documentReady(function(){
      try {
        (!(utils.inWxLite() || utils.inAlipayLite())) && self.initPuid();
      } catch (e){/* empty */}
    });
  },

  initPuid: function() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined'
        || localStorage === null) {
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
  }
};
