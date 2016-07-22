var hasOwn = {}.hasOwnProperty;

var utils = module.exports = {

  /**
   * 对象转换成 query string
   * @param object data  待转对象
   * @param string channel  渠道
   * @param boolean urlencode  是否需要 urlencode
   *
   * @return string query string
   */
  stringifyData: function(data, channel, urlencode) {
    if (typeof urlencode == 'undefined') {
      urlencode = false;
    }
    var output = [];
    for (var i in data) {
      if (!hasOwn.call(data, i) || typeof data[i] === 'function') {
        continue;
      }
      if (channel == 'bfb_wap' && i == 'url') {
        continue;
      }
      if (channel == 'yeepay_wap' && i == 'mode') {
        continue;
      }
      if (i == 'channel_url') {
        continue;
      }
      output.push(i + '=' +
        (urlencode ? encodeURIComponent(data[i]) : data[i]));
    }
    return output.join('&');
  },

  /**
   * 网络请求
   * @param string url
   * @param string method  请求方式, POST, GET ...
   * @param object requestData  请求数据
   * @param function successCallback  成功回调 (data, statusCode, xhr)
   * @param function errorCallback  错误回调 (xhr, statusCode, error)
   */
  request: function(url, method, requestData,
    successCallback, errorCallback, headers) {
    if (typeof XMLHttpRequest === 'undefined') {
      console.log('Function XMLHttpRequest is undefined.');
      return;
    }
    var xhr = new XMLHttpRequest();
    if (typeof xhr.timeout !== 'undefined') {
      xhr.timeout = 6000;
    }
    method = method.toUpperCase();

    if (method === 'GET' && typeof requestData === 'object' && requestData) {
      url += '?' + utils.stringifyData(requestData, '', true);
    }
    xhr.open(method, url, true);
    if (typeof headers !== 'undefined') {
      for (var k in headers) {
        if (hasOwn.call(headers, k)) {
          xhr.setRequestHeader(k, headers[k]);
        }
      }
    }
    if (method === 'POST') {
      xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
      xhr.send(JSON.stringify(requestData));
    } else {
      xhr.send();
    }
    if (typeof successCallback == 'undefined') {
      successCallback = function() {};
    }
    if (typeof errorCallback == 'undefined') {
      errorCallback = function() {};
    }
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        successCallback(xhr.responseText, xhr.status, xhr);
      }
    };
    xhr.onerror = function(e) {
      errorCallback(xhr, 0, e);
    };
  },

  /**
   * 表单提交
   * @param string url
   * @param string method  请求方式, POST, GET ...
   * @param object params  请求数据
   */
  formSubmit: function(url, method, params) {
    if (typeof window === 'undefined') {
      console.log('Not a browser, form submit url: ' + url);
      return;
    }
    var form = document.createElement('form');
    form.setAttribute('method', method);
    form.setAttribute('action', url);

    for (var key in params) {
      if (hasOwn.call(params, key)) {
        var hiddenField = document.createElement('input');
        hiddenField.setAttribute('type', 'hidden');
        hiddenField.setAttribute('name', key);
        hiddenField.setAttribute('value', params[key]);
        form.appendChild(hiddenField);
      }
    }

    document.body.appendChild(form);
    form.submit();
  },

  randomString: function(length) {
    if (typeof length == 'undefined') {
      length = 32;
    }
    var chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var maxPos = chars.length;
    var str = '';
    for (var i = 0; i < length; i++) {
      str += chars.charAt(Math.floor(Math.random() * maxPos));
    }

    return str;
  },

  redirectTo: function(url) {
    if (typeof window === 'undefined') {
      console.log('Not a browser, redirect url: ' + url);
      return;
    }
    window.location.href = url;
  },

  inWeixin: function() {
    if (typeof navigator === 'undefined') {
      return false;
    }
    var ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('micromessenger') !== -1;
  },

  documentReady: function(fn) {
    if (typeof document === 'undefined') {
      fn();
      return;
    }
    if (document.readyState != 'loading'){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }
};
