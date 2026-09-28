// Loaded as a classic script, after dist/pingpp.js and script-checks.js.
document.getElementById('run').addEventListener('click', function () {
  var checks = runPaymentChecks(window.pingpp);
  checks.unshift({
    name: 'script tag exposes global pingpp',
    passed: typeof pingpp !== 'undefined' && pingpp === window.pingpp
  }, {
    name: 'no CommonJS or AMD loader required',
    passed: typeof module === 'undefined' && typeof exports === 'undefined' && typeof define === 'undefined'
  });
  window.paymentResults = checks;
  document.getElementById('results').textContent = JSON.stringify(checks, null, 2);
});
