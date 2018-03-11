const express = require('express');
const router = express.Router();
const logger = require('../../utils/logHelper').helper;
const payService = require('../../service/payService');
const userService = require('../../service/userService');
const luck_drawService = require('../../service/luck_drawService');
const orderService = require('../../houtai/service/orderService');

/**
 * @api {post} /api/pay/thPay 余额支付
 * @apiGroup Pay
 * @apiName thPay
 * @apiParam {String} token token
 * @apiParam {String} order_id 订单ID
 * @apiParam {String} payword 支付密码
 * @apiSuccess {String} 1 支付成功
 * @apiError {String} 2 支付失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/thPay', (req, res) => {
    const data = req.body;
    if (!data.order_id) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    logger.startLog();
    // return orderService.ceshi(data).then((result) => {
    //     let params = {
    //         order_amount: result.data[0].order_amount,
    //         user_id: result.data[0].order_creator,
    //     };
    //     return luck_drawService.addLuckDrawCount(params);
    // }).then((e) => {
    //     res.send(e);
    // })

    userService.lifePay(data).then((val) => {
        return payService.paySuccess(val.data.out_trade_no, '3', );
    }).then((val) => {
        logger.endLog(val);
        res.send(val)
    }).catch((err) => {
        logger.endErrLog(err);
        res.send(err)
    })
});


//测试接口
/**
 * @api {post} /api/pay/ceshi01 测试接口
 * @apiGroup Pay
 * @apiName ceshi01
 * @apiParam {String} token token
 * @apiParam {String} order_amount 支付金额
 * @apiSuccess {String} 1 支付成功
 * @apiError {String} 2 支付失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/ceshi01', function (req, res) {
    const data = req.body;
    if (!data.order_amount) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    logger.startLog();
    luck_drawService.addLuckDrawCount(data).then((val) => {
        logger.endLog(val);
        res.send(val)
    }).catch((err) => {
        logger.endErrLog(err);
        res.send(err)
    })
});


module.exports = router;