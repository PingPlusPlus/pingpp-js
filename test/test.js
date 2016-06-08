/*eslint quotes: ["off"]*/
/*eslint max-len: ["off"]*/

module.exports = {

  run: function() {
    var version = require('../package.json').version;
    var pingpp = require('../dist/pingpp');
    if (version != pingpp.version) {
      console.log('Version number does not match.');
    } else {
      console.log('Version: ' + pingpp.version);
    }
    var charge = {
      "id": "ch_oCtn1dmbv0KGPyugGGHyf5K2",
      "object": "charge",
      "created": 1465266413,
      "livemode": true,
      "paid": false,
      "refunded": false,
      "app": "app_9acb18iK84P5xDQW",
      "channel": "alipay_wap",
      "order_no": "3901fdbc6084a414",
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
      "time_expire": 1465266713,
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
          "format": "xml",
          "partner": "2084611476903971",
          "req_data": "<auth_and_execute_req><request_token>201606078383881acbbc730d7d747219bf5bac64</request_token></auth_and_execute_req>",
          "sec_id": "0001",
          "service": "alipay.wap.auth.authAndExecute",
          "v": "2.0",
          "sign": "oAYtlTdC4V4//bdJBdwiw4Kppy6GHUE3bhcdOeaKF8cbcMwvh6GOIf1Kcm1yeAYEeNmOSuoBkN0g9FZAjK8mGvtmNiVLDr4zlKshlTyBTwFVqoqKg3l5yj+RZbLPk9OiSQoXefmbaNCevZRlyb0QQJtz23swEMJp7GrN7fx8JV8="
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
