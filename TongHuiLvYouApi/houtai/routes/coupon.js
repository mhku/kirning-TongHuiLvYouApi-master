const express = require('express');
const router = express.Router();
const couponService = require('../../houtai/service/couponService');


/**
 * @api {post} /api/coupon/addCoupon 添加优惠劵
 * @apiGroup coupon
 * @apiName addCoupon
 * @apiParam {String} token
 * @apiParam {String} coupon_name 优惠劵名称
 * @apiParam {String} coupon_money 优惠劵金额
 * @apiParam {String} coupon_startTime 优惠劵开始时间
 * @apiParam {String} coupon_endTime 优惠劵结束时间
 * @apiParam {String} coupon_issued 优惠劵数量
 * @apiParam {String} coupon_explain 优惠劵说明
 * @apiParam {String} coupon_relation 优惠劵关联类目ID(多个以1,2,3传输)
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/addCoupon', function (req, res) {
    let data = req.body;
    if (!data.coupon_name || !data.coupon_money || !data.coupon_startTime || !data.coupon_endTime || !data.coupon_issued || !data.coupon_explain || !data.coupon_relation) {
        res.send({code: 2, error: '参数不齐'});
        return;
    }
    couponService.addCoupon(data).then((result) => {
        res.send(result);
    }, (error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/coupon/upCoupon 更改优惠劵状态
 * @apiGroup coupon
 * @apiName upCoupon
 * @apiParam {String} coupon_id 优惠劵ID
 * @apiParam {String} coupon_isable 状态(1:可 0：否)
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/upCoupon', function (req, res) {
    let data = req.body;
    if (!data.coupon_id || !data.coupon_isable) {
        res.send({code: 2, error: '参数不齐'});
        return;
    }
    couponService.upCoupon(data).then((result) => {
        res.send(result);
    }, (error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/coupon/searchCoupon 查询优惠劵
 * @apiGroup coupon
 * @apiName searchCoupon
 * @apiParam {Number} page 从
 * @apiParam {Number} size 到
 * @apiParam {String} coupon_name 优惠劵名称
 * @apiParam {String} coupon_isable 状态(1:可 0：否)
 * @apiParam {String} ago 从
 * @apiParam {String} end 到
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchCoupon', function (req, res) {
    let data = req.body;
    couponService.searchCoupon(data).then((result) => {
        res.send(result);
    }, (error) => {
        res.send(error);
    })
});

module.exports = router;