# ChangeLog

## 2.2.26

- 修复支付宝 PC 电脑网站签约跳转问题

## 2.2.25

- mock 模拟支付地址修改为 `https`

---

## 2.2.24

- 新增chinaums_alipay_wap, chinaums_upacp_wap, chinaums_wx_wap, chinaums_alipay_pub, chinaums_wx_pub

## 2.2.23

- 新增 nucc_b2b_lakala,nucc_b2c_lakala

### 2.2.22

- 修正：在部分“浏览器”无法正常打开的异常

### 2.2.21

- 新增: 支持 ccb_wap

### 2.2.20

- 新增：支持 wx_lite_pab

### 2.2.19

- 新增：支持 alipay_wap_lakala, alipay_qr_lakala

### 2.2.18

- 修改：支持 alipay 渠道在支付宝小程序或者支付宝内部网页使用

### 2.2.17

- 新增：pab_pc, wx_pub_pab 渠道

### 2.2.16

- 新增：小程序内使用 alipay 调起支付

### 2.2.15

- 修正：支付宝小程序内报错修正
- 新增：0 元订单直接返回 success

### 2.2.14

- 新增：渠道 `isv_lite`

### 2.2.13

- 新增：渠道 `coolcredit`
- 修正：JSON 解析失败时的报错修正

### 2.2.12

- 新增：渠道 `wx_pub_hzbank`
- 更新：`gulp` 更新至 `4.0.0`
- 更新：移除 `pingpp_ui`

### 2.2.11

- 新增：签约接口 `pingpp.signAgreement(agr, callback)`

### 2.2.10

- 修正：`cb_walipay_wap`、`cb_alipay_pc_direct` 的跳转地址

### 2.2.9 (2018-11-29)

- 更新：新增 `alipay_lite` 渠道

### 2.2.7 (2018-11-05)

- 更新：新增 `ccb_qr` 渠道

### 2.2.6 (2018-08-06)
- 更新：判断是否在小程序内支付

### 2.2.5 (2018-07-26)
- 新增：添加支付渠道 [ `cmb_pc_qr`]

### 2.2.4 (2018-06-22)
- 新增：添加支付渠道 [ `upacp_b2b`]
- 修复：修复 README.md 文档链接
- 更新：更新微信小程序 [`wx_lite`]

### 2.2.3 (2018-04-13)
- 新增：添加支付渠道 [ `cb_alipay_pc_direct` , `cb_alipay_wap` , `paypal`]

### 2.2.2 (2018-01-22)
- 新增：wx_pub 跨境支付
- 修改：支持小程序模拟支付

### 2.2.1 (2018-01-18)
- 新增：`pingpp_ui`

### 2.1.16 (2017-12-11)
- 新增: `pingpp.setUrlReturnCallback` 方法，支持获取支付页面地址而不是直接跳转

### 2.1.15 (2017-10-18)
- 新增: 支付宝口碑渠道 (alipay_qr)
- 修复：DOM security error

### 2.1.14 (2017-09-28)
- 修复：账户系统 1.4 中多 charge 取值问题

### 2.1.13 (2017-08-28)
- 更新：兼容账户系统 1.4

### 2.1.12 (2017-08-09)
- 修复：测试模式下 wx_pub 中 notify url 报错问题

### 2.1.11 (2017-07-14)
- 修复：修复alipay_pc_direct兼容性

### 2.1.10 (2017-07-11)
- 新增：添加 招行一网通(cmb_wallet)

### 2.1.9 (2017-06-21)
- 新增：添加 线下扫码渠道(isv_wap)
- 更改：更新QQ钱包公众号
- 更改: 兼容 alipay_pc_direct 2.0
- 修复：localStorage为null报错

### 2.1.8 (2017-03-09)
- 更改：兼容 IE10 浏览器

### 2.1.7 (2017-01-12)
- 新增：添加 微信小程序
- 更改：支付宝（alipay_wap）支持 openapi

### 2.1.6 (2017-01-04)
- 修复：test 模式支付 order 成功 order 状态未更正问题
- 新增：QQ 钱包公众号（qpay_pub）

### 2.1.5
- 修复：Safari 无痕模式报错

### 2.1.4
- require 源码，而不是构建完的 js

### 2.1.3
- 新增：支持京东支付2.0
- 修复：微信支付测试模式
- 修复：Android WebView localStorage 兼容问题

### 2.1.2
- 新增：支持 wx_wap

### 2.1.1
- 更改：修复在 head 导入报错问题

### 2.1.0
- 更改：支持模块化构建

### 2.0.8
- 新增：添加企业网银支付（cp_b2b）

### 2.0.7
- 更改：重命名文件名为 pingpp.js  
- 更改：删除无用配置  
- 新增：增加 PC 端接口，pingpp-pc.js，调用方式为 `pingppPc.createPayment(charge, callback)`

### 2.0.6
- 新增：添加京东钱包 WAP 支付

### 2.0.5
- 新增：添加易宝 WAP 支付

### 2.0.4
- 更改：改进数组元素类型的判断

### 2.0.3
- 新增：支持微信公众号 JS-SDK 调起支付  
- 新增：添加在微信中使用支付宝手机网页支付的处理

### 2.0.2
- 更改：修正微信公众号 JSAPI 未加载完成时调用的问题

### 2.0.1
- 更改：新的测试模式  
- 更改：合并 HTML5 和 微信公众号 SDK

### 2.0.0
- 更改：添加新渠道：百付宝WAP  
- 更改：调用方法添加 callback，未跳转渠道前，出错时可返回错误信息
