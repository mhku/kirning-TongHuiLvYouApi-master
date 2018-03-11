const express = require('express');
const router = express.Router();
const moment = require('moment');
const exchangeService = require('../service/exchangeService');
const convert = require('iconv-lite');
const urlencode = require('urlencode');

/**
 * @api {post} /api/excharge/exchangePhone 兑换话费
 * @apiGroup Excharge
 * @apiName telquery
 * @apiParam {String} reward_user_id 中奖纪录ID
 * @apiParam {String} phoneNum 手机号码
 * @apiSuccess {String} 1 操作成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post("/exchangePhone", (req, res) => {
    const {reward_user_id, phoneNum} = req.body;
    if (!reward_user_id || !phoneNum) {
        res.send({code: 4, message: "参数不齐"});
        return;
    }

    exchangeService.exchangePhone(reward_user_id, phoneNum).then(() => {
        res.send({code: 1, msg: "成功"})
    }).catch((error) => {
        res.send(error)
    })
});

/**
 * @api {post} /api/excharge/exchangeOilCard 兑换加油卡
 * @apiGroup Excharge
 * @apiName exchangeOilCard
 * @apiParam {String} reward_user_id 中奖纪录ID
 * @apiParam {String} phoneNum 手机号码
 * @apiParam {String} card_no 加油卡号
 * @apiParam {String} card_type 加油卡类型（1中国石油，2中国石化）
 * @apiSuccess {String} 1 操作成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post("/exchangeOilCard", (req, res) => {
    const {reward_user_id, card_no, card_type, phoneNum} = req.body;
    if (!reward_user_id || !card_no || !card_type) {
        res.send({code: 4, message: "参数不齐"});
        return;
    } else if (card_type !== 1 || card_type !== 2) {
        res.send({code: 4, message: "加油卡类型不存在"});
        return;
    }
    exchangeService.exchangeOilCard(reward_user_id, phoneNum, card_no, card_type).then(() => {
        res.send({code: 1, msg: "成功"})
    }).catch((error) => {
        res.send(error)
    })
});

/**
 * @api {post} /api/excharge/exchangeLiuLiang 兑换流量
 * @apiGroup Excharge
 * @apiName exchangeLiuLiang
 * @apiParam {String} reward_user_id 中奖纪录ID
 * @apiParam {String} phoneNum 手机号码
 * @apiSuccess {String} 1 操作成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post("/exchangeLiuLiang", (req, res) => {
    const {reward_user_id, phoneNum} = req.body;
    if (!reward_user_id || !phoneNum) {
        res.send({code: 4, message: "参数不齐"});
        return;
    }
    exchangeService.exchangeOilCard(reward_user_id, phoneNum).then(() => {
        res.send({code: 1, msg: "成功"})
    }).catch((error) => {
        res.send(error)
    })
});

/**
 * @api {post} /api/excharge/retonline 欧飞充值回调
 */
router.post('/retonline', (req, res) => {
    let data = req.body;
    if (data) {
        data = urlencode.decode(convert.decode(data, "GBK"), "GBK");
    }
    logger.startLog();
    exchangeService.ofRetUrl(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/excharge/shyNotifyurl 赛合一充值回调
 */
router.post('/shyNotifyurl', (req, res) => {
    let data = req.body;
    logger.startLog();
    exchangeService.shyRetUrl(data).then(val => {
        logger.endLog(val);
        res.send({
            result: "t",
            time: moment().format("YYYY-MM-DD HH:mm:ss")
        });
    }).catch(err => {
        logger.endErrLog(err);
        res.send({
            result: "t",
            time: moment().format("YYYY-MM-DD HH:mm:ss")
        });
    });
});

module.exports = router;
