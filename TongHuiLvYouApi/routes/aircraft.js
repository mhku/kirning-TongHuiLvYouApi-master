/**
 * Created by Administrator on 2017/9/28.
 */
const aircraftService = require('../service/aircraftService');
const express = require('express');
const router = express.Router();
const logger = require('../utils/logHelper').helper;

/**
 * @api {post} /api/aircraft/queryAircrafts 查询所有机场城市三字码
 * @apiGroup aircraft
 * @apiName queryAircrafts
 * @apiSuccess {String} airport_id 机场ID
 * @apiSuccess {String} city_name 城市名称
 * @apiSuccess {String} airport_code 城市三字码
 * @apiSuccess {String} airport_name 机场名称
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/queryAircrafts', (req, res) => {
    logger.startLog();
    aircraftService.queryAircrafts().then((val) => {
        logger.endLog(val);
        res.send(val);
    }, (error) => {
        logger.endErrLog(error);
        res.send(error);
    });
});

/**
 * @api {post} /api/aircraft/queryAircraftsByCity 查询指定城市机场三字码
 * @apiGroup aircraft
 * @apiName queryAircraftsByCity
 * @apiParam {String} city_name 城市名称
 * @apiSuccess {String} airport_id 机场ID
 * @apiSuccess {String} city_name 城市名称
 * @apiSuccess {String} airport_code 城市三字码
 * @apiSuccess {String} airport_name 机场名称
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/queryAircraftsByCity', (req, res) => {
    let data = req.body;
    if (!data.city_name) {
        res.send({code: 4, message: "参数不齐"});
        return;
    }
    logger.startLog();
    aircraftService.queryAircraftsByCity(data).then((val) => {
        logger.endLog(val);
        res.send(val);
    }).catch((error) => {
        logger.endErrLog(error);
        res.send(error);
    });
});
module.exports = router;