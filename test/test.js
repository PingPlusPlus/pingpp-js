/*eslint quotes: ["off"]*/
/*eslint max-len: ["off"]*/

module.exports = {

  run: function() {
    var version = require('../package.json').version;
    var pingpp = require('../src/main.js');
    if (version != pingpp.version) {
      console.error('Version number does not match.');
    } else {
      console.log('Version: ' + pingpp.version);
    }

    pingpp.setUrlReturnCallback(function (err, url) {
      console.log(url);
    });

    var charge = {
      "id": "ch_jD0mL8L88i9Sub9OG0qTiTOS",
      "object": "charge",
      "created": 1512994590,
      "livemode": true,
      "paid": false,
      "refunded": false,
      "reversed": false,
      "app": "app_1Gqj58ynP0mHeX1q",
      "channel": "alipay_pc_direct",
      "order_no": "201700211512994583",
      "client_ip": "192.168.23.32",
      "amount": 100,
      "amount_settle": 99,
      "currency": "cny",
      "subject": "测试订单",
      "body": "订单详情",
      "extra": {
        "success_url": "https://example.com/success",
        "qr_pay_mode": 4,
        "qrcode_width": 300
      },
      "time_paid": null,
      "time_expire": 1513080990,
      "time_settle": null,
      "transaction_no": null,
      "refunds": {
        "object": "list",
        "url": "/v1/charges/ch_jD0mL8L88i9Sub9OG0qTiTOS/refunds",
        "has_more": false,
        "data": []
      },
      "amount_refunded": 0,
      "failure_code": null,
      "failure_msg": null,
      "metadata": {},
      "credential": {
        "object": "credential",
        "alipay_pc_direct": {
          "app_id": "2016110302520983",
          "method": "alipay.trade.page.pay",
          "format": "JSON",
          "charset": "utf-8",
          "sign_type": "RSA2",
          "timestamp": "2017-12-11 20:16:30",
          "version": "1.0",
          "biz_content": "{\"body\":\"订单详情\",\"subject\":\"测试订单\",\"out_trade_no\":\"201700211512994583\",\"total_amount\":1,\"product_code\":\"FAST_INSTANT_TRADE_PAY\",\"timeout_express\":\"1440m\",\"qr_pay_mode\":4,\"qrcode_width\":300}",
          "notify_url": "https://notify.pingxx.com/notify/charges/ch_jD0mL8L88i9Sub9OG0qTiTOS",
          "return_url": "https://example.com/success",
          "sign": "qj7mZXBmp7s8aoWlfruqbJWNZc/Qmzrzo1BFhYvbQL6dJskc3NX7oScZuwJIoBhts/mgO77+ziYceI1XANJBhXhFzwJQS0vgEBpwzxAEY008FSbf8Rolfck6C2lyXH+4uhjlk5bzwBAMa2VudR0zcfK1/rUiHVNuG/YHhQIietyyG1SVL/YnMhwo+b7cDLn87pj6/tYRxBNob9cLRMZLQ9JOgHb2JRuRxDpiIpfSlBQMMnoC2TvkUkrLGjhdSsUXd1QqTDbT28+tsMtPMBIjw4Lmgpw6Qr/Y39MtVTOUiSIHdwnG37+8GVML6zfP9v6KNYwH62GNIU0PfpsMzv4p+w==",
          "channel_url": "https://openapi.alipay.com/gateway.do"
        }
      },
      "description": null
    };

    pingpp.createPayment(charge, function(result, error){
      console.log(result);
      console.log(error);
    });
  }
};
