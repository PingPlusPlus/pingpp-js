/*eslint quotes: ["off"]*/
/*eslint max-len: ["off"]*/

module.exports = {
  pingpp: undefined,

  run: function() {
    const version = require('../package.json').version;
    this.pingpp = require('../src/main.js');
    if (version !== this.pingpp.version) {
      console.error('Version number does not match.');
    } else {
      console.log(`Version: ${this.pingpp.version}`);
    }

    this.testCharge();
    this.testChargeCcbWap();
    this.testAgreement();
    this.testTransfer()
  },

  testTransfer: function () {
    console.log('running transfer test...');

    const transfer = {
      "id": "tr_131250327649096837120006",
      "object": "transfer",
      "type": "b2c",
      "created": 1743068187,
      "time_transferred": null,
      "livemode": true,
      "status": "wait_user_confirm",
      "app": "app_1Gqj58ynP0mHeX1q",
      "channel": "wx_pub",
      "order_no": "912111743068187",
      "batch_no": null,
      "amount": 10,
      "amount_settle": 10,
      "currency": "cny",
      "recipient": "otdLiw0bx_HJUALDp_dzAAjp7BCA",
      "description": "转账测试",
      "transaction_no": "1330000139344692503270012303775666",
      "failure_msg": null,
      "extra": {
        "scene_id": "1005",
        "product_code": "fund-app",
        "scene_report_info": [
          {
            "info_type": "岗位类型",
            "info_content": "测试"
          },
          {
            "info_type": "报酬说明",
            "info_content": "测试"
          }
        ],
        "package": "ABBQO+oYAAABAAAAAADBGUx8UBAabcdHHhzlZxAAAADnGabcZahT9IkJjn90+abcRXA0BwkohpO9+F1BLQuBl2pCXphJtQK18bS/ShfGsIUmr1UTByVyMKCC/0/aUmIbP9y7Q8s7qutM1gFiMDRKQbtU2ks=",
        "mchId": "1250015000",
        "appId": "wx9cfac8008001600"
      },
      "metadata": {}
    }

    const ret = this.pingpp.createTransfer(transfer, (result, error) => {
      console.log(result);
      console.log(error);
    });

    console.log(ret);
  },

  testCharge: function () {
    console.log('running charge test...');

    this.pingpp.setUrlReturnCallback(function (err, url) {
      console.log("UrlReturnCallback: " + url);
    });

    var charge = `{
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
      "biz_content": "{\\"body\\":\\"订单详情\\",\\"subject\\":\\"测试订单\\",\\"out_trade_no\\":\\"201700211512994583\\",\\"total_amount\\":1,\\"product_code\\":\\"FAST_INSTANT_TRADE_PAY\\",\\"timeout_express\\":\\"1440m\\",\\"qr_pay_mode\\":4,\\"qrcode_width\\":300}",
      "notify_url": "https://notify.pingxx.com/notify/charges/ch_jD0mL8L88i9Sub9OG0qTiTOS",
      "return_url": "https://example.com/success",
      "sign": "qj7mZXBmp7s8aoWlfruqbJWNZc/Qmzrzo1BFhYvbQL6dJskc3NX7oScZuwJIoBhts/mgO77+ziYceI1XANJBhXhFzwJQS0vgEBpwzxAEY008FSbf8Rolfck6C2lyXH+4uhjlk5bzwBAMa2VudR0zcfK1/rUiHVNuG/YHhQIietyyG1SVL/YnMhwo+b7cDLn87pj6/tYRxBNob9cLRMZLQ9JOgHb2JRuRxDpiIpfSlBQMMnoC2TvkUkrLGjhdSsUXd1QqTDbT28+tsMtPMBIjw4Lmgpw6Qr/Y39MtVTOUiSIHdwnG37+8GVML6zfP9v6KNYwH62GNIU0PfpsMzv4p+w==",
      "channel_url": "https://openapi.alipay.com/gateway.do"
    }
  },
  "description": null
}`;

    this.pingpp.createPayment(charge, function(result, error){
      console.log(result);
      console.log(error);
    });
  },

  testAgreement: function () {
    console.log('running agreement test...');

    var agreement = {
      "id": "agr_19EFuyiLcdTshr",
      "object": "agreement",
      "livemode": true,
      "app": "app_1Gqj58ynP0mHeX1q",
      "created": 1545882366,
      "channel": "wx",
      "contract_no": "912111545882234",
      "contract_id": null,
      "credential": {
        "object": "credential",
        "wx": {
          "credential": "https://api.mch.weixin.qq.com/papay/entrustweb?appid=wx87cae2333f5068e1&mch_id=1300233301&plan_id=123611&contract_code=912111545882234&request_serial=912111545882234&contract_display_account=test&notify_url=https%3A%2F%2Fnotify.pingxx.com%2Fnotify%2Fagreements%2Fagr_19EFuyiLcdTsht&version=1.0&timestamp=1545882366&sign=11E5F8C28FE1CE78CF7FEEC1C502EC33"
        }
      },
      "status": "created",
      "time_succeeded": null,
      "time_canceled": null,
      "failure_code": null,
      "failure_msg": null,
      "extra": {
        "plan_id": "123611",
        "request_serial": "912111545882234",
        "display_account": "test"
      },
      "metadata": {},
      "source": null
    };

    var ret = this.pingpp.signAgreement(agreement, function (result, error) {
      console.log(result);
      console.log(error);
    });

    console.log(ret);
  },

  testChargeCcbWap: function () {
    console.log('running charge ccb_wap test...');

    this.pingpp.setUrlReturnCallback(function (err, url) {
      console.log("UrlReturnCallback: " + url);
    }, ['ccb_wap']);

    var charge = `{
  "id": "ch_101200415434992752640001",
  "object": "charge",
  "created": 1586922479,
  "livemode": true,
  "paid": false,
  "refunded": false,
  "reversed": false,
  "app": "app_1Gqj58ynP0mHeX1q",
  "channel": "ccb_wap",
  "order_no": "202002060026",
  "client_ip": "127.0.0.1",
  "amount": 1,
  "amount_settle": 1,
  "currency": "cny",
  "subject": "测试订单",
  "body": "订单详情",
  "extra": {
      "pos_id": "044507853"
  },
  "time_paid": null,
  "time_expire": 1587008879,
  "time_settle": null,
  "transaction_no": null,
  "refunds": {
      "object": "list",
      "url": "/v1/charges/ch_101200415434992752640001/refunds",
      "has_more": false,
      "data": []
  },
  "amount_refunded": 0,
  "failure_code": null,
  "failure_msg": null,
  "metadata": {},
  "credential": {
      "object": "credential",
      "ccb_wap": {
          "orderinfo": "MERCHANTID=105000056222895&POSID=044507853&BRANCHID=340000000&ORDERID=202002060026&PAYMENT=0.01&CURCODE=01&TXCODE=520100&REMARK1=ch_101200415434992752640001&TIMEOUT=20200416114759&TYPE=1&GATEWAY=UnionPay&THIRDAPPINFO=comccbpay000000000000000ccb&MAC=a4b3dbf79a7b5ca60da2997103ab6ce9"
      }
  },
  "description": null
}`;

    this.pingpp.createPayment(charge, function(result, error){
      console.log(result);
      console.log(error);
    });
  },
};
