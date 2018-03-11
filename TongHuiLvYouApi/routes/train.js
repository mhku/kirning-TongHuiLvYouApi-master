/**
 * Created by Administrator on 2017/8/28.
 */
const express = require('express');
const router = express.Router();
const logger = require('../utils/logHelper').helper;
const trainService = require('../service/trainService');

/**
 * @api {post} /api/train/findTraintickets 根据时间、地点查找火车票
 * @apiGroup Train
 * @apiName findTraintickets
 * @apiParam {String} dptCode 出发地三字码
 * @apiParam {String} eptCode 目的地三字码
 * @apiParam {String} Dptime 出发日期 格式:"YYYY-MM-DD"
 * @apiSuccess {String} trainId 班次Id
 * @apiSuccess {String} trainNo 班次
 * @apiSuccess {String} startTime 出发时间(格式:“HHSS”)
 * @apiSuccess {String} arriveTime 到达时间(格式:“HHSS”)
 * @apiSuccess {String} lastTime 历时
 * @apiSuccess {String} startDate 出发日期(格式：“YYYY-MM-DD”)
 * @apiSuccess {String} canWebBuy 是否可以购买(Y代表可以,N代表不可以)
 * @apiSuccess {String} day 天数
 * @apiSuccess {String} secretStr 加密字符串
 * @apiSuccess {Object} fromStation 始发地信息
 * @apiSuccess {String} fromStation.name 始发地城市名称
 * @apiSuccess {String} fromStation.code 始发地城市代码
 * @apiSuccess {String} fromStation.no 始发地城市编号
 * @apiSuccess {String} fromStation.type 始发地类型(START:始发车,STAGING:过路车,END:终点站)
 * @apiSuccess {Object} toStation 抵达地信息
 * @apiSuccess {String} toStation.name 抵达地城市名称
 * @apiSuccess {String} toStation.code 抵达地城市代码
 * @apiSuccess {String} toStation.no 抵达地城市编号
 * @apiSuccess {String} toStation.type 抵达地类型(START:始发车,STAGING:过路车,END:终点站)
 * @apiSuccess {Object[]} trainSeatList 座位席信息
 * @apiSuccess {String} trainSeatList.code 座位席别编号
 * @apiSuccess {String} trainSeatList.name 座位席别(比如硬座,硬卧,二等座)
 * @apiSuccess {String} trainSeatList.shortName 座位信息
 * @apiSuccess {String} trainSeatList.count 剩余座位
 * @apiSuccess {String} trainSeatList.price 车票价格(可能会为0)
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/findTraintickets', (req, res) => {
    let data = req.body;
    if (!data.dptCode || !data.eptCode || !data.Dptime) {
        res.send({code: 4, error: '参数不齐'});
        return;
    }
    logger.startLog();
    trainService.findTraintickets(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }, err => {
        logger.endErrLog(err);
        res.send(err);
    });

});

/**
 * @api {post} /api/train/trainsearchPrice 查询火车票票价
 * @apiGroup Train
 * @apiName trainsearchPrice
 * @apiParam {String} date 出发日期(格式：“YYYY-MM-DD”)
 * @apiParam {String} train_no 班次id
 * @apiParam {String} from_station_no 出发城市编号
 * @apiParam {String} to_station_no 到达城市对应编号
 * @apiParam {String} seat_types 座位席别对应的编号(多个以逗号,分开)
 * @apiSuccess {String} trainNo 班次id
 * @apiSuccess {Object} ticketPrices 对应价格信息
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/trainsearchPrice', (req, res) => {
    res.send({code: 2, msg: "接口已被禁用"});
    // let data = req.body;
    // if (!data.date || !data.train_no || !data.from_station_no || !data.to_station_no || !data.seat_types) {
    //     res.send({code: 4, error: '参数不齐'});
    //     return;
    // }
    // logger.startLog();
    // trainService.trainsearchPrice(data).then(val => {
    //     logger.endLog(val);
    //     res.send(val);
    // }, err => {
    //     logger.endErrLog(err);
    //     res.send(err);
    // });

});

/**
 * @api {post} /api/train/trainCreate 火车票下单
 * @apiGroup Train
 * @apiName trainCreate
 * @apiParam {String} token token
 * @apiParam {String} order_user 订单用户
 * @apiParam {String} flightdata 班次数据(同"/api/train/findTraintickets"查出的车次列表里对应项，原样返回)
 * @apiParam {String} cabindata 座位席别数据(同"flightdata"对象下的"trainSeatList"集合下的对象一致)
 * @apiParam {String} cabindata.code 座位席别编号
 * @apiParam {String} cabindata.name 座位席别(比如硬座,硬卧,二等座)
 * @apiParam {String} cabindata.shortName 座位信息
 * @apiParam {String} cabindata.count 剩余座位
 * @apiParam {String} cabindata.price 车票价格(可能会为0)
 * @apiParam {String} tourist_id 乘客信息(可多个)
 * @apiParam {String} traindata 12306账号信息
 * @apiParam {String} traindata.trainuser 账号
 * @apiParam {String} traindata.trainpassword 密码
 * @apiParam {String} linkmobile 联系人手机号码
 * @apiSuccess {String} order_no 订单号
 * @apiSuccess {String} order_id 订单ID
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/trainCreate', (req, res) => {
    let data = req.body;
    if (!data.flightdata || !data.cabindata || !data.tourist_id || !data.linkmobile) {
        res.send({code: 4, error: '参数不齐'});
        return;
    }
    // data.flightdata = JSON.parse(data.flightdata);
    // data.cabindata = JSON.parse(data.cabindata);
    // data.tourist_id = JSON.parse(data.tourist_id);
    // data.traindata = JSON.parse(data.traindata);
    logger.startLog();
    trainService.trainCreate(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });

});

/**
 * @api {post} /api/train/searchTrainCodeByInitial 根据首字母查询火车站信息
 * @apiGroup Train
 * @apiName searchTrainCodeByInitial
 * @apiParam {String} initial 城市首字母
 * @apiSuccess {String} code 三字码
 * @apiSuccess {String} indexed 首字母
 * @apiSuccess {String} city_name 城市名称
 * @apiSuccess {String} city_initials 城市首字母组合
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchTrainCodeByInitial', (req, res) => {
    let data = req.body;
    if (!data.initial) {
        res.send({code: 4, error: '参数不齐'});
        return;
    }
    logger.startLog();
    trainService.searchTrainCodeByInitial(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });

});

/**
 * @api {post} /api/train/searchTrainCodeByName 根据城市名查询火车站信息
 * @apiGroup Train
 * @apiName searchTrainCodeByName
 * @apiParam {String} city_name 城市名
 * @apiSuccess {String} code 三字码
 * @apiSuccess {String} indexed 首字母
 * @apiSuccess {String} city_name 城市名称
 * @apiSuccess {String} city_initials 城市首字母组合
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchTrainCodeByName', (req, res) => {
    let data = req.body;
    if (!data.city_name) {
        res.send({code: 4, error: '参数不齐'});
        return;
    }
    logger.startLog();
    trainService.searchTrainCodeByName(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });

});



module.exports = router;