/**
 * Created by dong on 2016/11/14.
 */

var bind = require('./bind');
var Handlebars = require('./handlebars.runtime.js');

module.exports = {

  createFrame: function (html) {
    if (document.getElementById('p_one_frame') == null) {
      var one_body = document.createElement('div');
      one_body.id = 'p_one_frame';
      one_body.innerHTML = html;
      document.body.appendChild(one_body);
      bind.buttonClickable = true;
    } else {
      document.getElementById('p_one_frame').style.display = 'block';
      bind.buttonClickable = false;
    }
  },

  open: function () {
    this.addClass(document.body, 'p_one_open');
    this.addClass(document.getElementsByClassName('p_one_html')[0], 'in');
  },

  close: function () {
    this.removeClass(document.getElementsByClassName('p_one_html')[0], 'in');
    setTimeout(function () {
      document.getElementById('p_one_frame').style.display = 'none';
    }, 400);
    this.removeClass(document.body, 'p_one_open');
  },

  addClass: function (obj, cls) {
    if (!this.hasClass(obj, cls)) {
      var addVal = (obj.className) ? ' ' + cls : cls;
      obj.className += addVal;
    }
  },

  hasClass: function (obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  },

  removeClass: function (obj, cls) {
    if (this.hasClass(obj, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      obj.className = obj.className.replace(reg, '');
    }
  },

  removeFromArray: function (arr, ele) {
    var len = arr.length;
    var narr = [];
    for (var i = 0; i < len; i++) {
      if (arr[i] != ele) {
        narr.push(arr[i]);
      }
    }
    return narr;
  },

  hideLoading: function () {
    if (document.getElementById('p_one_loading')) {
      document.body.removeChild(document.getElementById('p_one_loading'));
    }
  },

  showLoading: function () {
    var html = Handlebars.templates.loading();
    var n = document.createElement('div');
    n.id = 'p_one_loading';
    n.innerHTML = html;
    document.body.appendChild(n);
  }
};
