/*eslint quotes: ["off"]*/
/*eslint max-len: ["off"]*/

module.exports = {

  run: function() {
    var version = require('../package.json').version;
    var pingpp = require('../src/main.js');
    if (version != pingpp.version) {
      console.log('Version number does not match.');
    } else {
      console.log('Version: ' + pingpp.version);
    }
    var charge = {
      "id": "ch_oCtn1dmbv0KGPyugGGHyf5K2",
      "object": "charge",
      "created": 1467954781,
      "livemode": true,
      "paid": false,
      "refunded": false,
      "app": "app_9acb18iK84P5xDQW",
      "channel": "alipay_wap",
      "order_no": "3901fdbc6084b414",
      "client_ip": "180.148.2.118",
      "amount": 100,
      "amount_settle": 99,
      "currency": "cny",
      "subject": "测试订单",
      "body": "订单详情",
      "extra": {
        "success_url": "http://example.com/success",
        "cancel_url": "http://example.com/cancel"
      },
      "time_paid": null,
      "time_expire": 1468041181,
      "time_settle": null,
      "transaction_no": null,
      "refunds": {
        "object": "list",
        "url": "/v1/charges/ch_oCtn1dmbv0KGPyugGGHyf5K2/refunds",
        "has_more": false,
        "data": []
      },
      "amount_refunded": 0,
      "failure_code": null,
      "failure_msg": null,
      "metadata": {
      },
      "credential": {
        "object": "credential",
        "alipay_wap": {
          "channel_url": "https://mapi.alipay.com/gateway.do",
          "service": "alipay.wap.create.direct.pay.by.user",
          "_input_charset": "utf-8",
          "notify_url": "https://api.pingxx.com/notify/charges/ch_oCtn1dmbv0KGPyugGGHyf5K2",
          "partner": "2088721413954971",
          "out_trade_no": "3901fdbc6084b414",
          "subject": "测试订单",
          "body": "订单详情",
          "total_fee": "1.00",
          "payment_type": 1,
          "seller_id": "2088721413954971",
          "it_b_pay": "2016-07-09 13:13:01",
          "return_url": "http://example.com/success",
          "sign": "Kd7+F4kZxb9vSdJ/iDqtkpWKEm6NYtWOSPykBQWtLH9oXSqoh47JF+Kzn3Hg/19kgHPkS/GkLR+CEwEFHbmu0aUJUyyI0BxH76Eh4q+UnWpZZU0cHYudML+XyLDpTaJ+tAH8MpIj1icMOd1wTGUH3Asqeu/lU3tCbPTCaju4lJ0=",
          "sign_type": "RSA"
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
