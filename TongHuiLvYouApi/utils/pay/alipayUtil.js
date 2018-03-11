const urlencode = require('urlencode');
const moment = require("moment");
const crypto = require("crypto");
const reqUrl = require("../config").url;
const fs = require('fs');
const request = require('../request');
const aliPayUtil = {
    //配置参数
    alipayConfig: {
        app_id: '2016060701492258',//'2016080500170739', //app_id
        method: 'alipay.trade.app.pay', //方法
        format: 'json',   //返回格式
        charset: 'utf-8',   //编码
        sign_type: 'RSA2',   //签名算法
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),  //请求时间
        version: '1.0', //接口版本
        // notify_url: 'http://liuxin.tunnel.qydev.com/api/alipay/aliPayNotify', //回调地址
        notify_url: reqUrl + '/api/alipay/aliPayNotify', //回调地址
        //业务请求参数
        biz_content: {
            subject: '',    //标题
            out_trade_no: '',   //唯一订单号
            total_amount: '',   //订单总金额
            product_code: 'QUICK_MSECURITY_PAY',   //销售产品码
            passback_params: '' //公共参数
        },
    },
    /**
     *
     * @param params
     * @returns {*}
     */
    getVerifyParams: (params, flag) => {
        var sPara = [];
        if (!params) return null;
        for (var key in params) {
            if ((!params[key]) || key == "sign") {
                continue;
            }
            ;
            sPara.push([key, params[key]]);
        }
        sPara = sPara.sort();
        var prestr = '';
        for (var i2 = 0; i2 < sPara.length; i2++) {
            var obj = sPara[i2];
            // obj[1] = urlencode(obj[1], aliPayUtil.alipayConfig.charset);
            if (i2 == sPara.length - 1) {
                prestr = prestr + obj[0] + '=' + obj[1] + '';
            } else {
                if (flag) {
                    prestr = prestr + obj[0] + '=' + urlencode.encode(obj[1], "UTF-8") + '&';
                } else {
                    prestr = prestr + obj[0] + '=' + obj[1] + '&';
                }
            }
        }
        return prestr;
    },
    /**
     * 将发来的数据生成有序数据
     * @param params
     * @returns {*}
     */
    getVerifyParamsAfter: (params) => {
        let sPara = [];
        if (!params) return null;
        for (let key in params) {
            //排除空值，sign, sign_type
            if ((!params[key]) || key == "sign" || key == "sign_type") {
                continue;
            }
            sPara.push([key, params[key]]);
        }
        sPara = sPara.sort();
        let prestr = '';
        for (let i2 = 0; i2 < sPara.length; i2++) {
            let obj = sPara[i2];
            //最后一个值
            if (i2 == sPara.length - 1) {
                prestr = prestr + obj[0] + '=' + obj[1] + '';
            } else {
                prestr = prestr + obj[0] + '=' + obj[1] + '&';
            }
        }
        return prestr;
    },
    /**
     * 验证私钥签名
     * @param params
     * @returns {*}
     */
    veriyPrivateSign: (params) => {
        try {
            //读取秘钥
            const key = fs.readFileSync('./utils/pay/private.key').toString();
            const prestr = aliPayUtil.getVerifyParams(params);
            let sign = crypto.createSign('RSA-SHA256');
            sign.update(prestr);
            sign = sign.sign(key, 'base64');
            return sign;
        } catch (err) {
            console.log('veriyPrivateSign err', err);
        }
    },

    /**
     * 验证公钥签名
     * @param params
     * @returns {Promise}
     */
    veriyPublicSign: (params) => {
        try {
            //读取秘钥
            // const publicKey = fs.readFileSync('./utils/pay/public.key').toString();
            const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmitYA0Us6HFBcaTFy6m2ks+K+YuRAC39B6vGlOTBpnBxHfm3O4NpaA0JRkoyFpKWgyCRRItAhS7kNXYnUMubYuo1L1PqdlKfPq75m05dgCsbH4ECMmU584w53enslE9Zu38tb8s+aNqyVEmLL5LNAMAdo+EpZSornyMCb0EY7vtzX93PfyF1ZmN4B+QFG9yM+m419WYHbfTyVoUSsKUrlSprTUCfQhe7DaRuhF8mFkhIfZaRhPQJUGHqH1MVQcpZduSFhA4qDx+ZduDv1tFZX/kyhLVQuRLkLnejNMaIzMqB+tNtGKW1tlzlTZak0lzZb/H3TGkG0flReLCZu4FPcwIDAQAB
-----END PUBLIC KEY-----
`;
            const prestr = aliPayUtil.getVerifyParamsAfter(params);
            const sign = params['sign'] ? params['sign'] : "";
            const verify = crypto.createVerify('RSA-SHA256');
            verify.update(prestr);
            return verify.verify(publicKey, sign, 'base64');
        } catch (err) {
            console.log('veriyPublicSign err', err);
        }
    },

    /**
     *  退款
     * @param order
     */
    refund: (order) => {
        if (!order || !order.order_no || !order.order_amount) {
            return Promise.reject({code: 2, msg: "退款参数不齐"});
        }
        return new Promise((resolve, reject) => {
            let config = {
                app_id: aliPayUtil.alipayConfig.app_id,
                method: "alipay.trade.refund",
                charset: aliPayUtil.alipayConfig.charset,
                sign_type: aliPayUtil.alipayConfig.sign_type,
                timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
                version: aliPayUtil.alipayConfig.version,
                biz_content: JSON.stringify({
                    out_trade_no: order.order_no,
                    refund_amount: order.order_amount,
                    refund_reason: urlencode(order.order_reason || '')
                })
            };
            config.sign = aliPayUtil.veriyPrivateSign(config);
            //调用支付宝退款请求
            // request.post('https://openapi.alipay.com/gateway.do', config, config.charset).then((res) => {
            request.post('https://openapi.alipay.com/gateway.do', config, "GB2312").then((res) => {
                res = JSON.parse(res);
                const response = res.alipay_trade_refund_response;
                if (response.code == '10000') {
                    resolve({code: 1, msg: "退款成功"});
                } else {
                    reject({code: 2, msg: response.msg});
                }
            }).catch((err) => {
                reject({code: 2, msg: err.message});
            });
        });
    }
}
module.exports = aliPayUtil;