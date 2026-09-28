const channels = ['yeepay_wx_pub_ofl', 'yeepay_wx_pub', 'wx_pub', 'wx_pub_pab'];
export function runPaymentChecks(pingpp) {
  const results = [];
  function check(name, action) {
    try { action(); results.push({ name, passed: true }); }
    catch (error) { results.push({ name, passed: false, error: error.message }); }
  }
  function assert(value, message) { if (!value) throw new Error(message); }
  check('package entry API', () => {
    for (const name of ['createPayment', 'createTransfer', 'createWithdrawal', 'signAgreement']) {
      assert(typeof pingpp[name] === 'function', name + ' missing');
    }
  });
  for (const channel of channels) {
    for (const [bridgeResult, expected] of [['ok', 'success'], ['cancel', 'cancel'], ['fail', 'fail']]) {
      check(channel + ': ' + expected, () => {
        let called = 0;
        let callbackResult;
        const credential = { appId: 'wx_fixture', timeStamp: '1', nonceStr: 'fixture', package: 'prepay_id=fixture', signType: 'RSA', paySign: 'fixture' };
        window.WeixinJSBridge = { invoke(method, params, callback) {
          assert(method === 'getBrandWCPayRequest', 'wrong bridge method');
          assert(JSON.stringify(params) === JSON.stringify(credential), 'credential changed');
          called++;
          callback({ err_msg: 'get_brand_wcpay_request:' + bridgeResult });
        }};
        pingpp.createPayment({ id: 'ch_fixture', app: 'app_fixture', channel, livemode: true,
          credential: { [channel]: credential } }, (result, error) => { callbackResult = { result, error }; });
        assert(called === 1, 'bridge calls: ' + called + '; callback: ' + JSON.stringify(callbackResult));
        assert(callbackResult && callbackResult.result === expected, 'unexpected callback: ' + JSON.stringify(callbackResult));
        if (expected === 'fail') assert(callbackResult.error.msg === 'wx_result_fail', 'wrong failure');
      });
    }
  }
  check('unknown channel retains invalid_channel', () => {
    let result;
    pingpp.createPayment({ id: 'ch_fixture', app: 'app_fixture', channel: 'unsupported_fixture', livemode: true,
      credential: { unsupported_fixture: {} } }, (status, error) => { result = { status, error }; });
    assert(result && result.status === 'fail' && result.error.msg === 'invalid_channel', JSON.stringify(result));
  });
  window.paymentResults = results;
  return results;
}
