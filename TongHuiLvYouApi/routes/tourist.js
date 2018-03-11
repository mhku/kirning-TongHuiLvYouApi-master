/**
 * Created by Administrator on 2017/9/1.
 */
const express = require('express');
const router = express.Router();
const logger = require('../utils/logHelper').helper;
const touristService = require('../service/touristService');
const moment = require('moment');

/**
 * @api {post} /api/tourist/addTourist 添加游客信息
 * @apiGroup Tourist
 * @apiName addTourist
 * @apiParam {String} token token
 * @apiParam {String} tourist_name 游客姓名
 * @apiParam {String} tourist_gender 游客性别(1男 2女)
 * @apiParam {String} tourist_identityType 游客证件类型（1 身份证，2 护照， 3军官证，4 士兵证， 5 台胞证， 6 其他）
 * @apiParam {String} tourist_birthday 游客生日
 * @apiParam {String} tourist_identityNo 游客证件号
 * @apiParam {String} tourist_phone 游客联系电话
 * @apiParam {String} tourist_email 游客电子邮箱（非必填）
 * @apiParam {String} tourist_crowd_type 游客属于人群（0成人，1 儿童）
 * @apiSuccess {String} 1 添加成功
 * @apiError {String} 2 添加失败
 * @apiError {String} 3 错误信息
 */
router.post('/addTourist', (req, res) => {
    let data = req.body;
    if (!data.tourist_name || !data.tourist_gender || !data.tourist_identityType || !data.tourist_birthday || !data.tourist_identityNo || !data.tourist_phone || !data.tourist_crowd_type) {
        res.send({code: 4, message: "参数不齐"});
        return;
    }
    logger.startLog();
    touristService.addTourist(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    })
});

/**
 * @api {post} /api/tourist/delTourist 删除游客信息
 * @apiGroup Tourist
 * @apiName delTourist
 * @apiParam {String} token token
 * @apiParam {String} tourist_id 游客ID
 * @apiSuccess {String} 1 删除成功
 * @apiError {String} 2 删除失败
 * @apiError {String} 3 错误信息
 */
router.post('/delTourist', (req, res) => {
    let data = req.body;
    logger.startLog();
    touristService.delTourist(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }, err => {
        logger.endErrLog(err);
        res.send(err);
    })
});

/**
 * @api {post} /api/tourist/updateTourist 修改游客信息
 * @apiGroup Tourist
 * @apiName updateTourist
 * @apiParam {String} token token
 * @apiParam {String} tourist_id 游客ID
 * @apiParam {String} tourist_name 游客姓名
 * @apiParam {String} tourist_gender 游客性别(1男 2女)
 * @apiParam {String} tourist_identityType 游客证件类型
 * @apiParam {String} tourist_identityNo 游客证件类型（1 身份证，2 护照， 3军官证，4 士兵证， 5 台胞证， 6 其他）
 * @apiParam {String} tourist_birthday 游客生日
 * @apiParam {String} tourist_phone 游客联系电话
 * @apiParam {String} tourist_email 游客电子邮箱
 * @apiParam {String} tourist_crowd_type 游客属于人群（0成人，1 儿童）
 * @apiParam {String} tourist.tourist_default 默认状态(0,无默认 1,默认)
 * @apiSuccess {String} 1 修改成功
 * @apiError {String} 2 修改失败
 * @apiError {String} 3 错误信息
 */
router.post('/updateTourist', (req, res) => {
    let data = req.body;
    logger.startLog();
    touristService.updateTourist(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }, err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/tourist/findTouristById 查询指定游客信息
 * @apiGroup Tourist
 * @apiName findTouristById
 * @apiParam {String} token token
 * @apiParam {String} tourist_id 游客ID
 * @apiSuccess {String} tourist_name 游客姓名
 * @apiSuccess {String} tourist_gender 游客性别(1男 2女)
 * @apiSuccess {String} tourist_identityType 游客证件类型（1 身份证，2 护照， 3军官证，4 士兵证， 5 台胞证， 6 其他）
 * @apiSuccess {String} tourist_birthday 游客生日
 * @apiSuccess {String} tourist_identityNo 游客证件号
 * @apiSuccess {String} tourist_phone 游客联系电话
 * @apiSuccess {String} tourist_email 游客电子邮箱（非必填）
 * @apiSuccess {String} tourist_crowd_type 游客属于人群（0成人，1 儿童）
 * @apiSuccess {String} tourist.tourist_default 默认状态(0,无默认 1,默认)
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/findTouristById', (req, res) => {
    let data = req.body;
    logger.startLog();
    touristService.findTouristById(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }, err => {
        logger.endErrLog(err);
        res.send(err);
    })
});

/**
 * @api {post} /api/tourist/findTouristByUser 查询用户的所有游客信息
 * @apiGroup Tourist
 * @apiName findTouristByUser
 * @apiParam {String} token token
 * @apiSuccess {String} tourist_name 游客姓名
 * @apiSuccess {String} tourist_gender 游客性别(1男 2女)
 * @apiSuccess {String} tourist_identityType 游客证件类型（1 身份证，2 护照， 3军官证，4 士兵证， 5 台胞证， 6 其他）
 * @apiSuccess {String} tourist_birthday 游客生日
 * @apiSuccess {String} tourist_identityNo 游客证件号
 * @apiSuccess {String} tourist_phone 游客联系电话
 * @apiSuccess {String} tourist_email 游客电子邮箱（非必填）
 * @apiSuccess {String} tourist_crowd_type 游客属于人群（0成人，1 儿童）
 * @apiSuccess {String} tourist.tourist_default 默认状态(0,无默认 1,默认)
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/findTouristByUser', (req, res) => {
    let data = req.body;
    logger.startLog();
    touristService.findTouristByUser(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }, err => {
        logger.endErrLog(err);
        res.send(err);
    })
});

/**
 * @api {post} /api/tourist/setDefaultTourist 设置默认游客
 * @apiGroup Tourist
 * @apiName setDefaultTourist
 * @apiParam {String} token token
 * @apiParam {Object[]} tourist 游客
 * @apiParam {String} tourist.tourist_id 游客ID
 * @apiParam {String} tourist.tourist_default 默认状态(0,无默认 1,默认)
 * @apiSuccess {String} 1 设置成功
 * @apiError {String} 2 设置失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/setDefaultTourist', (req, res) => {
    let data = req.body;
    if (!data.tourist) {
        return res.send({ code: 4, msg: "参数不齐"});
    }
    // data.tourist = JSON.parse(data.tourist);
    logger.startLog();
    touristService.setDefaultTourist(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch((err) => {
        logger.endErrLog(err);
        res.send(err);
    })
});



module.exports = router;