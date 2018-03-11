/**
 * Created by Administrator on 2017/8/28.
 */
const express = require('express');
const router = express.Router();
const logger = require('../utils/logHelper').helper;
const filghrService = require('../service/filghrService');
const orderService = require('../service/orderService');

/**
 * @api {post} /api/flighr/findFlighrs 根据时间、地点查找航班
 * @apiGroup Flighr
 * @apiName findFlighrs
 * @apiParam {String} orgAirportCode 出发机场三字码
 * @apiParam {String} dstAirportCode 抵达城市三字码
 * @apiParam {Date} date 起飞日期 格式:"YYYY-MM-dd"
 * @apiSuccess {String} orgCity 出发城市
 * @apiSuccess {String} dstCity 抵达城市
 * @apiSuccess {String} distance 航程公里数
 * @apiSuccess {Object[]} flighrs 航班列表
 * @apiSuccess {String} flighrs.flightNo 航班号
 * @apiSuccess {String} flighrs.link 联接协议级别
 * @apiSuccess {String} flighrs.orgCity 出发城市
 * @apiSuccess {String} flighrs.dstCity 抵达城市
 * @apiSuccess {String} flighrs.depTime 起飞时间
 * @apiSuccess {String} flighrs.planeType 机型
 * @apiSuccess {Number} flighrs.stopnum 经停次数
 * @apiSuccess {Boolean} flighrs.isElectronicTicket 是否电子客票
 * @apiSuccess {String} flighrs.arriTime 降落时间
 * @apiSuccess {String} flighrs.orgJetquay 始发航站楼
 * @apiSuccess {String} flighrs.dstJetquay 到达航站楼
 * @apiSuccess {Number} flighrs.airportTax 成人的机建费
 * @apiSuccess {Number} flighrs.fuelTax 成人的燃油费
 * @apiSuccess {String} flighrs.meal 餐食标识
 * @apiSuccess {String} flighrs.orgAirport 出发机场名称
 * @apiSuccess {String} flighrs.dstAirport 抵达机场名称
 * @apiSuccess {Number} flighrs.price 航班最低价
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/findFlighrs', (req, res) => {
    let data = req.body;
    if (!data.orgAirportCode || !data.dstAirportCode || !data.date) {
        res.send({code: 4, message: "参数不齐"});
        return;
    }
    logger.startLog();
    filghrService.findFlighrs(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });

});

/**
 * @api {post} /api/flighr/findFlighrByFlightNo 根据时间、地点、航班号 查找航班
 * @apiGroup Flighr
 * @apiName findFlighrByFlightNo
 * @apiParam {String} orgAirportCode 出发机场三字码
 * @apiParam {String} dstAirportCode 抵达城市三字码
 * @apiParam {Date} date 起飞日期 格式:"YYYY-MM-dd"
 * @apiParam {String} flightNo 起飞日期 格式:"YYYY-MM-dd"
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/findFlighrByFlightNo', (req, res) => {
    let data = req.body;
    if (!data.orgAirportCode || !data.dstAirportCode || !data.date || !data.flightNo) {
        res.send({code: 4, message: "参数不齐"});
        return;
    }
    logger.startLog();
    filghrService.findFlighrByFlightNo(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });

});

/**
 * @api {post} /api/flighr/createPlaneOrder 根据乘客信息创建订单
 * @apiGroup Flighr
 * @apiName createPlaneOrder
 * @apiParam {String} token token
 * @apiParam {String} order_user 订单用户
 * @apiParam {String} product_id 产品ID
 * @apiParam {String} remark 订单备注
 * @apiParam {String} policyId 政策ID
 * @apiParam {String} linkMan 订票联系人
 * @apiParam {String} linkPhone 联系电话
 * @apiParam {Number} parPrice 票面价
 * @apiParam {Number} fuelTax 燃油税
 * @apiParam {Number} airportTax 机建费
 * @apiParam {object[]} flighrs 航班列表数组
 * @apiParam {String} flighrs.flightNo 航班号
 * @apiParam {String} flighrs.depCode 出发地三字码 格式: "PEK"
 * @apiParam {String} flighrs.arrCode 抵达地
 * @apiParam {String} flighrs.seatClass 舱位 如：Y大写
 * @apiParam {String} flighrs.depDate 出发日期 格式: "YYYY-MM-DD"
 * @apiParam {String} flighrs.depTime 出发时间 格式: "HH:ss"
 * @apiParam {String} flighrs.arrTime 抵达时间 格式: "HH:ss"
 * @apiParam {String} flighrs.planeModel 飞机型号 如"333"
 * @apiParam {String} flighrs.orgJetquay 始发航站楼
 * @apiParam {String} flighrs.dstJetquay 到达航站楼
 * @apiParam {object[]} tourists 游客信息数组
 * @apiParam {String} tourists.tourist_id 游客ID
 * @apiSuccess {String} 1 创建成功
 * @apiError {String} 2 创建失败
 * @apiError {String} 3 错误信息
 */
router.post('/createPlaneOrder', (req, res) => {
    let data = req.body;
    if (!data.product_id || !data.remark || !data.linkMan ||
        !data.linkPhone || !data.parPrice || !data.fuelTax || !data.airportTax ||
        !data.flighrs || data.flighrs.length == 0 || !data.tourists || data.tourists.length == 0) {
        res.send({code: 4, message: "参数不齐"});
        return;
    }
    logger.startLog();
    filghrService.createPlaneOrder(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch((err) => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/flighr/cancelPlaneOrder 取消航班订单
 * @apiGroup Flighr
 * @apiName cancelPlaneOrder
 * @apiParam {String} filghr_order_id 航班订单ID
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/cancelPlaneOrder', (req, res) => {
    let data = Object.assign({}, req.body);
    if (!data.filghr_order_id) {
        res.send({code: 4, message: "参数不齐"});
        return;
    }
    logger.startLog();
    filghrService.cancelPlaneOrder(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/flighr/getDailyLowestPrice 实时获取每日最低价
 * @apiGroup Flighr
 * @apiName getDailyLowestPrice
 * @apiParam {String} startDate 起始日期，格式：yyyy-MM-dd
 * @apiParam {String} endDate 结束日期，格式：yyyy-MM-dd
 * @apiParam {String} deptCode 出发城市三字码
 * @apiParam {String} arrCode 抵达城市三字码(选填)
 * @apiSuccess {String} deptCode 出发三字码
 * @apiSuccess {String} depCity_name 出发城市名
 * @apiSuccess {String} depAirport 出发机场三字码
 * @apiSuccess {String} depAirport_name 出发机场名
 * @apiSuccess {String} depDate 出发日期
 * @apiSuccess {String} arrCode 抵达三字码
 * @apiSuccess {String} arrCity_name 抵达城市名
 * @apiSuccess {String} arrAirport 抵达机场三字码
 * @apiSuccess {String} arrAirport_name 抵达机场名称
 * @apiSuccess {String} flightNo 最低价所属航班
 * @apiSuccess {String} gmtModified 最后修改时间
 * @apiSuccess {String} productType 舱位类型（1 普通舱位，3 特价舱位）
 * @apiSuccess {String} seatCode 舱位
 * @apiSuccess {String} ticketPrice 票面价
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/getDailyLowestPrice', (req, res) => {
    let data = req.body;
    if (!data.startDate || !data.endDate) {
        res.send({code: 4, message: "参数不齐"});
        return;
    }
    logger.startLog();
    filghrService.getDailyLowestPrice(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/flighr/getModifyAndRefundStipulate 根据航空公司、舱位获取退改签规定
 * @apiGroup Flighr
 * @apiName getModifyAndRefundStipulate
 * @apiParam {String} airlineCode 航空公司二字码，如：CA
 * @apiParam {String} classCode 舱位，如：Y
 * @apiParam {Date} depDate 出发日期，格式：yyyy-MM-dd
 * @apiParam {String} depCode 出发机场三字码
 * @apiParam {String} arrCode 抵达机场三字码
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/getModifyAndRefundStipulate', (req, res) => {
    let data = req.body;
    if (!data.airlineCode || !data.classCode || !data.depDate || !data.depCode || !data.arrCode) {
        res.send({code: 4, message: "参数不齐"});
        return;
    }
    logger.startLog();
    filghrService.getModifyAndRefundStipulate(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/flighr/getOrderDetail 获取订单详情
 * @apiGroup Flighr
 * @apiName getOrderDetail
 * @apiParam {String} order_target_id 航班平台ID
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/getOrderDetail', (req, res) => {
    let data = req.body;
    if (!data.order_target_id) {
        res.send({code: 4, message: "参数不齐"});
        return;
    }
    logger.startLog();
    filghrService.getOrderDetail(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * 出票回调
 */
router.post('/flightTicket', (req, res) => {
    let data = req.body;
    logger.startLog();
    //订单成功
    filghrService.flightTicket(data).then(val => {
        logger.endLog(val);
        res.send("S");
    }).catch(err => {
        logger.endErrLog(err);
        res.send("S");
    });
});

/**
 * 退款回调
 */
router.post('/refundNotifiedUrl', (req, res) => {
    let data = req.body;
    logger.startLog();
    filghrService.refundNotifiedUrl(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * 出票回调
 */
router.get('/flightTicket', (req, res) => {
    let data = req.body;
    logger.startLog();
    //订单成功
    filghrService.flightTicket(data).then(val => {
        logger.endLog(val);
        res.send("S");
    }).catch(err => {
        logger.endErrLog(err);
        res.send("S");
    });
});

/**
 * 退款回调
 */
router.get('/refundNotifiedUrl', (req, res) => {
    let data = req.body;
    logger.startLog();
    filghrService.refundNotifiedUrl(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});


module.exports = router;