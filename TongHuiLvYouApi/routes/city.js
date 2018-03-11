/**
 * Created by Administrator on 2017/8/25.
 */
const cityService = require('../service/cityService');
const express = require('express');
const router = express.Router();
const logger = require('../utils/logHelper').helper;

/**
 * @api {post} /api/city/queryCitysByPid 查询指定地区下的子地区
 * @apiGroup City
 * @apiName queryCitysByPid
 * @apiParam {String} id 地区ID
 * @apiSuccess {String} id 地区ID
 * @apiSuccess {String} name 地区简称
 * @apiSuccess {String} fullname 地区全称
 * @apiSuccess {String} pinyin 地区拼音
 * @apiSuccess {String} level 地区等级
 * @apiSuccess {String} pid 地区父级ID
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/queryCitysByPid', (req, res)=>{
    logger.startLog();
    let data = req.body;
    if (!data.id) {
        let error = {code: 4, message: "参数不齐"};
        res.send(error);
        logger.endErrLog(error);
        return;
    }
    cityService.queryCitysByPid(data).then((val)=>{
        logger.endLog(val);
        res.send(val);
    }).catch((error)=>{
        logger.endErrLog(error);
        res.send(error);
    });
});

/**
 * @api {post} /api/city/queryCityByLevel 查询指定等级的地区
 * @apiGroup City
 * @apiName queryCityByLevel
 * @apiParam {String} level 地区等级(1,省 2,市 3,区/县)
 * @apiSuccess {String} id 地区ID
 * @apiSuccess {String} name 地区简称
 * @apiSuccess {String} fullname 地区全称
 * @apiSuccess {String} pinyin 地区拼音
 * @apiSuccess {String} level 地区等级
 * @apiSuccess {String} pid 地区父级ID
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/queryCityByLevel', (req, res)=>{
    logger.startLog();
    let data = req.body;
    if (!data.level) {
        let error = {code: 4, message: "参数不齐"};
        res.send(error);
        logger.endErrLog(error);
        return;
    }
    cityService.queryCityByLevel(data).then((val)=>{
        logger.endLog(val);
        res.send(val);
    },(error)=>{
        logger.endErrLog(error);
        res.send(error);
    });
});

module.exports = router;
