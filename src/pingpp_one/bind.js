/**
 * Created by dong on 2016/11/14.
 */
var stash = require('../stash');
var utils = require('./utils');
var commUtils = require('../utils');
var Handlebars = require('./handlebars.runtime-v4.0.5.js');
var hb = require('./sample.hbs.js');

module.exports = {

    buttonClickable: true,
    maskClickable: true,
    moveFlag: false,
    charge:{},

    init: function() {
        var _this = this,
            ul = document.getElementById('p_one_channelList');
        ul.addEventListener("click", function(e){
            e.preventDefault();
            if (!_this.buttonClickable) {
                return;
            }

            utils.showLoading();
            _this.buttonClickable = false;
            var e = e || event,
                target = e.target,
                channel = target.getAttribute('p_one_channel');

            if (channel == null) {
                channel = target.parentNode.getAttribute('p_one_channel');
            }
            if (channel == null) {
                channel = target.parentNode.parentNode.getAttribute('p_one_channel');
            }

            var postData = {};
            postData.channel = channel;
            postData.order_no = stash.userData.order_no;
            postData.amount = stash.userData.amount;
            if (channel == 'wx_pub') {
                postData.open_id = stash.userData.open_id;
            }

            if (stash.userData.charge_param) {
                var charge_param = stash.userData.charge_param;
                for (var i in charge_param) {
                    postData[i] = charge_param[i];
                }
            }

            commUtils.request(stash.userData.charge_url, "POST", postData, function (res, code) {
                utils.hideLoading();
                if(code == 200) {
                    _this.charge = res;

                    if (stash.isDebugMode) {//debug模式下暂停，调用resume之后继续
                        _this.buttonClickable = true;

                        stash.charge = res;
                        stash.channel = channel;

                        stash.userCallback({
                            status: true,
                            msg: 'charge success',
                            debug: stash.isDebugMode,
                            chargeUrlOutput: res
                        });
                        return;
                    }
                    pingpp.createPayment(res, _this.callbackCharge);
                }
            }, function(err) {
                utils.hideLoading();
                utils.close();
                stash.userCallback({
                    status: false,
                    msg: 'network error',
                    debug: stash.isDebugMode
                });
            });
        });

        var eventType;
        if ('ontouchstart' in document) {
            eventType = 'touchstart';
        }
        else eventType = 'click';

        //点mask的时候收起来
        document.addEventListener('dbclick', function () {
            return false;
        });
        document.ontouchmove = function () {
            _this.moveFlag = true;
        };
        document.ontouchend = function () {
            _this.moveFlag = false;
        };
        //如果触发了touchstart的时候触发了touchmove就不关
        document.getElementById('p_one_mask').addEventListener('touchstart', function (e) {

        });
        var touch_click = ('ontouchend' in document) ? 'touchend' : 'click';
        document.getElementById('p_one_mask').addEventListener(touch_click, function (e) {
            if (!_this.maskClickable) {
                return;
            }
            _this.buttonClickable = true;
            if (!_this.moveFlag) {
                utils.close();
                _this.moveFlag = true;
                _this.maskClickable = false;
            }
        });
    },

    callbackCharge: function(result, err){
        var _this = this;
        if(result == "fail"){
            stash.userCallback({
                status: false,
                msg: err.msg,
                debug: stash.isDebugMode,
                chargeUrlOutput: _this.charge
            });
            utils.close();
        } else if(result == "cancel") {  // 微信公众账号支付取消支付
            stash.userCallback({
                status: false,
                msg: err.msg,
                debug: stash.isDebugMode,
                chargeUrlOutput: _this.charge
            });
        } else if(result == "success") { // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
            var htmlStr = Handlebars.templates.success();
            var one_body=document.createElement('div');
            one_body.id="p_one_frame";
            one_body.innerHTML=htmlStr;
            document.body.appendChild(one_body);

            document.getElementById('p_one_goon').addEventListener('click',function(){
                stash.successCallback();
            });
        }
    }
};