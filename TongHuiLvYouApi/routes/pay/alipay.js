const express = require('express');
const router = express.Router();
const urlencode = require('urlencode');
const logger = require('../../utils/logHelper').helper;
const alipayUtil = require('../../utils/pay/alipayUtil');
const payrecordService = require('../../service/payrecordService');
const orderService = require('../../service/orderService');
const payService = require('../../service/payService');
const AlipayConfig = alipayUtil.alipayConfig;

/**
 * /api/alipay/aliPayNotify
 * 支付宝异步回调接口
 */
router.post('/aliPayNotify', (req, res) => {
    //所有回调参数
    const params = req.body;
    const order_no = params.out_trade_no;   //订单号
    const total_fee = params.total_amout;   //获取总金额
    const trade_status = params.trade_status;//交易状态
    const passback_params = params.passback_params; //其它参数
    let result = alipayUtil.veriyPublicSign(params);
    // res.send("fail");
    // return;
    if (result) {
        if (trade_status === "TRADE_SUCCESS") {
            try {
                payService.paySuccess(order_no, '1', passback_params).then((val) => {
                    res.send("success");
                });
            } catch (err) {
                console.error(err);
                res.send("fail");
            }
        } else if (trade_status === "TRADE_FINISHED") {
            //判断该笔订单是否已经做过处理
            res.send("success");
        } else {
            res.send("fail");
        }
    } else {
        res.send("fail");
    }
});


/**
 * @api {post} /api/alipay/aliPayParams 获取支付宝签名
 * @apiGroup Alipay
 * @apiName aliPayParams
 * @apiParam {String} token token
 * @apiParam {String} order_id 订单ID
 * @apiSuccess {String} params 请求参数
 * @apiSuccess {String} sign 签名
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/aliPayParams', (req, res) => {
    const data = req.body;
    if (!data.order_id) {
        return res.send({code: 4, msg: "参数不齐"});
    }
    //获取订单信息
    orderService.findOrderById(data).then((result) => {
        //订单信息
        const order = result.data[0];
        const biz_content = {
            subject: order.order_title,//标题
            out_trade_no: order.order_no,//订单号
            total_amount: (parseInt(order.order_amount) / 100).toFixed(2),//支付总价
            product_code: 'QUICK_MSECURITY_PAY',   //销售产品码
            passback_params: urlencode(order.product_id, AlipayConfig.charset) //产品类型
        };
        //配置参数
        // AlipayConfig.biz_content.out_trade_no = order.order_no;//订单号
        // AlipayConfig.biz_content.subject = order.order_title;//标题
        // AlipayConfig.biz_content.passback_params = order.product_id;//产品类型
        // AlipayConfig.biz_content.total_amount = (parseInt(order.order_amount) / 100).toFixed(2);//支付总价
        AlipayConfig.biz_content = JSON.stringify(biz_content);
        //排序请求参数
        const myParam = alipayUtil.getVerifyParams(AlipayConfig);
        //参数签名
        const mySign = urlencode.encode(alipayUtil.veriyPrivateSign(AlipayConfig), AlipayConfig.charset);
        // const mySign = alipayUtil.veriyPrivateSign(AlipayConfig);
        //连接参数
        const last = alipayUtil.getVerifyParams(AlipayConfig, true) + "&sign=" + mySign;
        // result.data = {sign: mySign};
        result.data = {sign: last};
        console.log(last);
        logger.endLog(result);
        res.send(result);
    }).catch((err) => {
        logger.endErrLog(err);
        res.send(err);
    });
});


/**
 * @api {post} /api/alipay/testRefund 测试退款
 * @apiGroup Alipay
 * @apiName testRefund
 * @apiParam {String} token token
 * @apiParam {String} order_id 订单ID
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/testRefund', (req, response) => {
    const data = req.body;
    if (!data.order_id) {
        return response.send({code: 4, msg: "参数不齐"});
    }
    //获取订单信息
    orderService.findOrderById(data).then((result) => {
        //订单信息
        const order = result.data[0];
        order.order_amount = parseFloat(order.order_amount / 100);
        return require('../../utils/pay/alipayUtil').refund(order);
    }).then((res)=>{
        response.send(res);
    }).catch((err) => {
        logger.endErrLog(err);
        response.send(err);

    });
});

module.exports = router;