const express = require('express');
const router = express.Router();
const logger = require('../utils/logHelper').helper;
const orderService = require('../service/orderService');
const payService = require('../service/payService');

/**
 * @api {post} /api/order/searchUserOrders 根据状态及产品查订单
 * @apiGroup order
 * @apiName searchUserOrders
 * @apiParam {String} token token
 * @apiParam {String} order_state 状态 逗号隔开
 * @apiParam {String} product_id 产品ID
 * @apiParam {String} page 页数
 * @apiParam {String} size 大小
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchUserOrders', (req, res) => {
    let data = req.body;
    if (!data.page || !data.size) {
        return res.send({code: 4, msg: "参数不齐"})
    }
    logger.startLog();
    orderService.searchUserOrders(data).then((val) => {
        logger.endLog(val);
        res.send(val);
    }).catch((error) => {
        logger.endErrLog(error);
        res.send(error);
    });
});

/**
 * @api {post} /api/order/searchOrderProduct 查询所有产品信息
 * @apiGroup order
 * @apiName searchOrderProduct
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchOrderProduct', (req, res) => {
    logger.startLog();
    orderService.searchOrderProduct().then((val) => {
        logger.endLog(val);
        res.send(val);
    }).catch((error) => {
        logger.endErrLog(error);
        res.send(error);
    });
});

/**
 * @api {post} /api/order/findUserOrder 获取用户下的指定ID订单
 * @apiGroup Order
 * @apiName findUserOrder
 * @apiParam {String} token token
 * @apiParam {String} order_id 订单ID
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/findUserOrder', (req, res) => {
    let data = req.body;
    if (!data.order_id) {
        return res.send({code: 4, msg: "参数不齐"})
    }
    logger.startLog();
    orderService.findOrderById(data).then((val) => {
        logger.endLog(val);
        res.send(val);
    }).catch((error) => {
        logger.endErrLog(error);
        res.send(error);
    });
});

/**
 * @api {post} /api/order/cancelOrder 取消订单
 * @apiGroup Order
 * @apiName cancelOrder
 * @apiParam {String} token token
 * @apiParam {String} order_id 订单ID
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/cancelOrder', (req, res) => {
    let data = req.body;
    if (!data.order_id) {
        return res.send({code: 4, msg: "参数不齐"})
    }
    logger.startLog();
    orderService.cancelOrder(data).then((val) => {
        logger.endLog(val);
        res.send(val);
    }).catch((error) => {
        logger.endErrLog(error);
        res.send(error);
    });
});

/**
 * @api {post} /api/order/orderRefund 订单退款
 * @apiGroup order
 * @apiName orderRefund
 * @apiParam {String} token token
 * @apiParam {String} order_id 订单ID
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/orderRefund', (req, res) => {
    let data = req.body;
    if (!data.order_id) {
        return res.send({code: 4, msg: "参数不齐"})
    }
    logger.startLog();
    payService.refund(data).then((val) => {
        logger.endLog(val);
        res.send(val);
    }).catch((error) => {
        logger.endErrLog(error);
        res.send(error);
    });
});

module.exports = router;
