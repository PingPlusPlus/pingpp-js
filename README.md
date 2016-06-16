# Pingpp HTML5 SDK

## 如何构建
[dist](/dist) 目录下提供了已经构建好的 SDK，使用的命令是 `gulp build --alipay_in_weixin`。

#### 全局安装 gulp
``` bash
npm install -g gulp
```
#### 默认构建
默认会包含所有渠道
``` bash
npm run build
```

#### 自定义构建
安装依赖
``` bash
npm install
```
##### --channels
选择渠道，渠道字段用空格或者英文逗号分割，例：
``` bash
gulp build --channels="alipay_wap wx_pub upacp_wap"
```
可选的渠道模块请查看 [src/channels](/src/channels) 目录下的文件名

##### --name
设置对象变量名
``` bash
gulp build --name="pingppPc" --channels="alipay_pc_direct upacp_pc"
```

##### --alipay_in_weixin
如果要在微信内使用支付宝手机网页支付，请添加该参数
``` bash
gulp build --alipay_in_weixin
```
同时，将 [alipay_in_weixin](/alipay_in_weixin) 目录下的 [pay.htm](/alipay_in_weixin/pay.htm) 放于你服务器可访问的路径下。

默认情况下，访问该文件的 URL 需要与你的支付页面时同级的。例：  
支付页面 URL：http://localhost/project/payment?a=b&c=d  
该文件 URL：http://localhost/project/pay.htm

你也可以调用 `setAPURL` 方法来自定义该文件 URL。
``` js
pingpp.setAPURL('http://localhost/your/custom/url');
```
该文件([pay.htm](/alipay_in_weixin/pay.htm))内的 `CURRENT_PAGE_URL` 变量也设置为相同的值。

##### --wx_jssdk
如果想使用微信的 JS-SDK 来调起支付，请添加该参数
``` bash
gulp build --wx_jssdk
```

## 使用说明
#### 引入 JS 文件
- script 标签方式

    ``` html
    <script src="/path/to/pingpp.js"></script>
    ```

- Browserify 打包方式

    首先使用 npm 下载
    ``` bash
    npm install pingpp-js
    ```
    使用
    ``` javascript
    var pingpp = require('pingpp-js');
    ```

#### 使用服务端创建的 [charge](https://www.pingxx.com/docs/overview) 调用接口
``` javascript
pingpp.createPayment(charge, function(result, err){
  if (result == "success") {
    // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
  } else if (result == "fail") {
    // charge 不正确或者微信公众账号支付失败时会在此处返回
  } else if (result == "cancel") {
    // 微信公众账号支付取消支付
  }
});
```
如果 `charge` 正确的话，会跳转到相应的支付页面，要求用户进行付款。

用户支付成功后，会跳转到创建 `charge` 时定义的 `result_url` 或者 `success_url`。如果用户取消支付，则会跳转到 `result_url` 或者 `cancel_url`（具体情况根据渠道不同会有所变化）。

### 微信公众号接入注意事项
_以下示例中，Server-SDK 以 `php` 为例，其他语言请参考各语言 SDK 的文档或者示例_
#### 关于 open_id
1. 用 Server-SDK 取得 `open_id`(微信公众号授权用户唯一标识)
  - 先跳转到微信获取`授权 code`，地址由下方代码生成，`$wx_app_id` 是你的`微信公众号应用唯一标识`，`$redirect_url` 是用户确认授权后跳转的地址，用来接收 `code`

  ```php
  <?php
  $url = \Pingpp\WxpubOAuth::createOauthUrlForCode($wx_app_id, $redirect_url);
  header('Location: ' . $url);
  ```
  - 用户确认授权后，使用 `code` 获取 `open_id`，其中 `$wx_app_secret` 是你的`微信公众号应用密钥`

  ```php
  <?php
  $code = $_GET['code'];
  $open_id = \Pingpp\WxpubOAuth::getOpenid($wx_app_id, $wx_app_secret, $code);
  ```
2. 将 `open_id` 作为创建 `charge` 时的 `extra` 参数，具体方法参考[技术文档](https://pingxx.com/document/api/#api-c-new)，例：

  ```js
  {
    "order_no":  "1234567890",
    "app":       {"id": "app_1234567890abcDEF"},
    "channel":   "wx_pub",
    "amount":    100,
    "client_ip": "127.0.0.1",
    "currency":  "cny",
    "subject":   "Your Subject",
    "body":      "Your Body",
    "extra": {
      "open_id": open_id
    }
  }
  ```
3. 得到 `charge` 后，在页面中引用 `pingpp.js`，调用 `pingpp.createPayment`，结果会直接在 `callback` 中返回。

  ```js
  pingpp.createPayment(charge, function(result, err) {
    if (result=="success") {
      // payment succeeded
    } else {
      console.log(result+" "+err.msg+" "+err.extra);
    }
  });
  ```
