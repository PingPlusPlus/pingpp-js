# Pingpp HTML5 SDK

## 支持的渠道
- 手机网页支付
    1. 支付宝手机网页支付（alipay_wap）
    2. 百度钱包手机网页支付（bfb_wap）
    3. 银联全渠道手机网页支付（upacp_wap）
    4. 微信WAP支付（wx_wap）
    5. 微信小程序支付（wx_lite）
    6. 易宝手机网页支付（yeepay_wap）
    7. 京东手机网页支付（jdpay_wap）
    8. 招行一网通支付（cmb_wallet）

- PC 网页支付
    1. 支付宝电脑网站支付 (alipay_pc_direct)
    2. 银联网关支付 (upacp_pc)
    3. 银联企业网银支付 (cp_b2b)

- 微信公众账号支付(wx_pub)
- QQ 公众号支付 (qpay_pub)
- 支付宝口碑 (alipay_qr)
- 线下扫码支付(isv_wap)

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

同时，将 [alipay_in_weixin](/alipay_in_weixin) 目录下的 [pay.htm](/alipay_in_weixin/pay.htm) 放于你服务器可访问的路径下，如下两种方法：

- 默认情况下，访问该文件的 URL 需要与你的支付页面时同级的。例：  
支付页面 URL：http://localhost/project/payment?a=b&c=d  
该文件 URL：http://localhost/project/pay.htm

- 你也可以调用 `setAPURL` 方法来自定义该文件 URL。

``` js
pingpp.setAPURL('http://localhost/your/custom/url');
```

该文件([pay.htm](/alipay_in_weixin/pay.htm))内的 `CURRENT_PAGE_URL` 变量也设置为相同的值。

##### --wx_jssdk
如果想使用微信的 JS-SDK 来调起支付，请添加该参数

``` bash
gulp build --wx_jssdk
```

##### wx_lite
因为微信小程序中 不能使用其他支付渠道，构建时请添加该参数

``` bash
gulp build --channels=wx_lite
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
    // 只有微信公众账号 (wx_pub)、QQ 公众号 (qpay_pub)、支付宝口碑 (alipay_qr)
    // 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
  } else if (result == "fail") {
    // charge 不正确或者微信公众账号/QQ 公众号/支付宝口碑支付失败时会在此处返回
  } else if (result == "cancel") {
    // 微信公众账号、QQ 公众号、支付宝口碑支付取消支付
  }
});
```
如果 `charge` 正确的话，会跳转到相应的支付页面，要求用户进行付款。

用户支付成功后，会跳转到创建 `charge` 时定义的 `result_url` 或者 `success_url`。如果用户取消支付，则会跳转到 `result_url` 或者 `cancel_url`（具体情况根据渠道不同会有所变化）。

#### 如果不想直接跳转到支付页面，而是获取支付页面地址
在调用 `pingpp.createPayment` 之前，调用
```javascript
pingpp.setUrlReturnCallback(callback, channels);
```

##### 参数 callback
回调函数
- 第一个参数接受错误信息，没有错误时为 null。
- 第二个参数为支付界面地址的值。

##### 参数 channels
需要启用该功能的渠道列表，类型为 `array`。默认值为 `['alipay_pc_direct']`。

##### 示例
```javascript
pingpp.setUrlReturnCallback(function (err, url) {
  // 自行处理跳转或者另外打开支付页面地址(url)
  // window.location.href = url;
}, ['alipay_pc_direct', 'alipay_wap']);
```

### 微信公众号接入注意事项
_以下示例中，Server-SDK 以 `php` 为例，其他语言请参考各语言 SDK 的文档或者示例_
#### 关于 open_id
##### 用 Server-SDK 取得 `open_id`（微信公众号授权用户唯一标识）。
先跳转到微信获取`授权 code`，地址由下方代码生成，`$wx_app_id` 是你的`微信公众号应用唯一标识`，`$redirect_url` 是用户确认授权后跳转的地址，用来接收 `code`。

```php
<?php
$url = \Pingpp\WxpubOAuth::createOauthUrlForCode($wx_app_id, $redirect_url);
header('Location: ' . $url);
```

用户确认授权后，使用 `code` 获取 `open_id`，其中 `$wx_app_secret` 是你的`微信公众号应用密钥`

```php
<?php
$code = $_GET['code'];
$open_id = \Pingpp\WxpubOAuth::getOpenid($wx_app_id, $wx_app_secret, $code);
```

##### 将 `open_id` 作为创建 `charge` 时的 `extra` 参数，具体方法参考[技术文档](https://pingxx.com/document/api/#api-c-new)，例：

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

##### 得到 `charge` 后，在页面中引用 `pingpp.js`，调用 `pingpp.createPayment`，结果会直接在 `callback` 中返回。

```js
pingpp.createPayment(charge, function(result, err) {
  if (result=="success") {
    // payment succeeded
  } else {
    console.log(result+" "+err.msg+" "+err.extra);
  }
});
```

### 微信小程序接入注意事项
_以下示例中，Server-SDK 以 `php` 为例，其他语言请参考各语言 SDK 的文档或者示例_
#### 关于 open_id
##### 小程序的 `code` 获取跟公众号的有些不同，小程序是有自己的 `API` 可以在客户端直接获取 `code`。

```js
wx.login({
  success: function(res) {
    if(res.code){
      console.log('code = ' + res.code);
    }else{
     console.log('获取用户登录态失败！' + res.errMsg);
    }
  }
});
```

##### 得到 `code` 之后 以 `GET`的方式，请求你自己的服务端。然后在服务端使用 `code` 来获取 `open_id`，其中 `$wx_app_id` 是你的`微信AppID(小程序ID) ` ，`$wx_app_secret` 是你的`微信小程序密钥` 。

```php
<?php
$code = $_GET['code'];
$open_id = \Pingpp\WxpubOAuth::getOpenid($wx_app_id, $wx_app_secret, $code);
```

##### 将 `open_id` 作为创建 `charge` 时的 `extra` 参数，具体方法参考[技术文档](https://pingxx.com/document/api/#api-c-new)，例：

```js
{
  "order_no":  "1234567890",
  "app":       {"id": "app_1234567890abcDEF"},
  "channel":   "wx_lite",
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

##### 得到 `charge` 后，在页面中引用 `pingpp.js` ，调用 `pingpp.createPayment`，结果会直接在 `callback` 中返回。

```js
var pingpp = require('pingpp.js 的绝对路径');
pingpp.createPayment(charge, function(result, err) {
  if (result=="success") {
    // payment succeeded
  } else {
    console.log(result+" "+err.msg+" "+err.extra);
  }
});
```

## 常见问题
#### 问题一: H5 页面微信公众号支付调用 Ping++ 提示失败 (来源：工单)
返回结果: get_brand_wcpay_request: fail

- 报错原因：微信授权目录填写错误。
- 解决方案：详见[帮助中心](https://help.pingxx.com/article/123339)

#### 问题二：微信内调用支付宝没出现引导界面，只有复制链接到浏览器
- 报错原因：pay.htm 路径出错
- 解决方案：
    1. 默认情况下，访问该文件的 URL 需要与你的支付页面时同级的。例：  
        支付页面 URL：http://localhost/project/payment?a=b&c=d  
        该文件 URL：http://localhost/project/pay.htm
    2. 你也可以调用 `setAPURL` 方法来自定义该文件 URL。

        ``` js
        pingpp.setAPURL('http://localhost/your/custom/url');
        ```

        该文件([pay.htm](/alipay_in_weixin/pay.htm))内的 `CURRENT_PAGE_URL` 变量也设置为相同的值。

#### 问题三：调不起支付，返回报错信息 json_decode_fail
- 报错原因：传入的参数不是正确的 JSON 字符串或者 JSON 对象
- 解决方案：客户端调用 SDK 时，确认服务端输出到客户端时，数据的正确性。
