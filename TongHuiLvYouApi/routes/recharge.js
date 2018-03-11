/**
 * Created by Administrator on 2017/9/2.
 */
const express = require('express');
const router = express.Router();
const moment = require('moment');
const logger = require('../utils/logHelper').helper;
const rechargeService = require('../service/rechargeService');
const orderService = require('../service/orderService');
const convert = require('iconv-lite');
const urlencode = require('urlencode');

const api = require('../utils/api');

/**
 * @api {post} /api/recharge/mobinfo 手机归属地查询
 * @apiGroup Recharge
 * @apiName mobinfo
 * @apiParam mobilenum 手机号码
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/mobinfo', (req, res) => {
    let data = req.body;
    if (!data.mobilenum) {
        res.send({code: 4, message: "参数不齐"});
        return;
    }
    logger.startLog();
    rechargeService.mobinfo(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/flowCheck 验证流量商品信息
 * @apiGroup Recharge
 * @apiName flowCheck
 * @apiParam {String} phoneNo 手机号码
 * @apiParam {String} perValue 价格
 * @apiParam {String} flowValue 流量值（必须加单位，如 G, M）
 * @apiParam {String} range 使用范围 1（省内）、 2（全国）
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/flowCheck', (req, res) => {
    let data = req.body;
    if (!data.phoneNo || !data.perValue || !data.flowValue || !data.range) {
        res.send({code: 4, message: "参数不齐"});
        return;
    }
    logger.startLog();
    rechargeService.flowCheck(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/telquery 根据手机号和面值查询商品信息
 * @apiGroup Recharge
 * @apiName telquery
 * @apiParam {String} phoneno 手机号码
 * @apiParam {String} pervalue 价格
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/phoneno', (req, res) => {
    let data = req.body;
    if (!data.phoneno || !data.pervalue) {
        res.send({code: 4, message: "参数不齐"});
        return;
    }
    logger.startLog();
    rechargeService.telquery(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/telcheck 查询手机号当时是否可以充值
 * @apiGroup Recharge
 * @apiName telcheck
 * @apiParam {String} phoneno 手机号码
 * @apiParam {String} price 价格
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/telcheck', (req, res) => {
    let data = req.body;
    if (!data.phoneno || !data.price) {
        res.send({code: 4, message: "参数不齐"});
        return;
    }
    logger.startLog();
    rechargeService.telcheck(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/createPhoneRecharge 创建手机话费充值订单
 * @apiGroup Recharge
 * @apiName createPhoneOrder
 * @apiParam {String} token token
 * @apiParam {String} phoneno 手机号码
 * @apiParam {String} pervalue 充值面值
 * @apiSuccess {String} 1 创建成功
 * @apiError {String} 2 创建失败
 * @apiError {String} 3 错误信息
 */
router.post('/createPhoneRecharge', (req, res) => {
    let data = req.body;
    if (!data.phoneno || !data.pervalue) {
        res.send({code: 4, message: "参数不齐"});
        return;
    }
    logger.startLog();
    console.log("之前" + orderService);
    rechargeService.createPhoneOrder(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * 兑换奖品
 */
router.post('/rechargePhone', (req, res) => {
    let data = req.body;
    if (!data.phoneno || !data.pervalue) {
        res.send({code: 4, message: "参数不齐"});
        return;
    }
    logger.startLog();
    console.log("之前" + orderService);
    rechargeService.createPhoneOrder(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/createFlowRecharge 创建手机流量充值订单
 * @apiGroup Recharge
 * @apiName createFlowRecharge
 * @apiParam {String} token token
 * @apiParam {String} phoneNo 手机号码
 * @apiParam {String} perValue 价格
 * @apiParam {String} flowValue 流量数量（注意：需写上单位，如 30M, 1G）
 * @apiParam {String} range 使用范围 1（省内）、 2（全国）
 * @apiParam {String} effectStartTime 生效时间 1（当日）、2（次日）、3（次月）
 * @apiParam {String} effectTime 1-当月有效,2-30天有效,3-半年有效,4-3个月有效,5-2个月有效,6-6个月有效,7-20天有效,8-3日有效,9-90天有效,10-7天有效,11-当日有效,12-4小时有效,13-24小时有效,14-7个月有效,16-国庆8日有效
 * @apiSuccess {String} 1 创建成功
 * @apiError {String} 2 创建失败
 * @apiError {String} 3 错误信息
 */
router.post('/createFlowRecharge', (req, res) => {
    let data = req.body;
    if (!data.phoneNo || !data.perValue || !data.flowValue || !data.range || !data.effectStartTime || !data.effectTime) {
        res.send({code: 4, message: "参数不齐"});
        return;
    }
    logger.startLog();
    rechargeService.createFlowOrder(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/createTelephoneRecharge 固话/宽带充值
 * @apiGroup Recharge
 * @apiName createTelephoneRecharge
 * @apiParam {String} token token
 * @apiParam {String} cardnum 购买面值
 * @apiParam {String} teltype 运营商（1、电信 2、联通）
 * @apiParam {String} chargeType 充值类型 （1：固话；2：宽带）
 * @apiParam {String} telephone 固话号码 （格式：021-88888888），宽带支持手机宽带 和固话宽带
 * @apiSuccess {String} 1 创建成功
 * @apiError {String} 2 创建失败
 * @apiError {String} 3 错误信息
 */
router.post('/createTelephoneRecharge', (req, res) => {
    let data = req.body;
    if (!data.cardnum || !data.teltype || !data.chargeType || !data.telephone) {
        res.send({code: 4, message: "参数不齐"});
        return;
    }
    logger.startLog();
    rechargeService.createTelephoneOrder(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/createQBRecharge 游戏任意充值
 * @apiGroup Recharge
 * @apiName createQBRecharge
 * @apiParam {String} token token
 * @apiParam {String} cardid 商品ID (Q币：220612，其它游戏更具查出结果.)
 * @apiParam {String} cardnum 充值数量
 * @apiParam {String} game_userid 账号
 * @apiParam {String} game_area 游戏区（选填）
 * @apiParam {String} game_srv 游戏组（选填）
 * @apiSuccess {String} 1 创建成功
 * @apiError {String} 2 创建失败
 * @apiError {String} 3 错误信息
 */
router.post('/createQBRecharge', (req, res) => {
    let data = req.body;
    if (!data.cardid || !data.cardnum || !data.game_userid) {
        res.send({code: 4, message: "参数不齐"});
        return;
    }
    logger.startLog();
    rechargeService.createGameOrder(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/querycardinfo 具体商品信息同步接口（游戏）
 * @apiGroup Recharge
 * @apiName querycardinfo
 * @apiParam {String} cardid 商品ID
 * @apiSuccess {String} inprice 价格
 * @apiSuccess {String} 1 创建成功
 * @apiError {String} 2 创建失败
 * @apiError {String} 3 错误信息
 */
router.post('/querycardinfo', (req, res) => {
    let data = req.body;
    if (!data.cardid) {
        res.send({code: 4, message: "参数不齐"});
        return;
    }
    logger.startLog();
    rechargeService.querycardinfo(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/createFuelCardRecharge 创建石油加油卡充值
 * @apiGroup Recharge
 * @apiName createFuelCardRecharge
 * @apiParam {String} token token
 * @apiParam {String} cardnum 1.任意充需要待充值面值（1的整数倍) 2.卡充充值这里表示数量
 * @apiParam {String} fuel_card 加油卡号（充值账号）中石化：以100011开头共19位、中石油：以90开头共16位
 * @apiParam {String} gasCardTel 持卡人手机号码
 * @apiSuccess {String} 1 创建成功
 * @apiError {String} 2 创建失败
 * @apiError {String} 3 错误信息
 */
router.post('/createFuelCardRecharge', (req, res) => {
    let data = req.body;
    if (!data.cardnum || !data.fuel_card || !data.gasCardTel) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    logger.startLog();
    rechargeService.createFuelCardOrder(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/createJYKRecahrge 创建石化加油卡充值充值
 * @apiGroup Recharge
 * @apiName createJYKRecahrge
 * @apiParam {String} token token
 * @apiParam {String} oilnumber 加油卡号（充值账号）中石化：以100011开头共19位
 * @apiParam {String} denomination 加油卡充值面额 必须整数
 * @apiParam {String} custom 备注
 * @apiSuccess {String} 1 创建成功
 * @apiError {String} 2 创建失败
 * @apiError {String} 3 错误信息
 */
router.post('/createJYKRecahrge', (req, res) => {
    let data = req.body;
    if (!data.oilnumber || !data.denomination) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    let numreg = /[1-9]0{1,2}/;　　//正整数
    if (!numreg.test(data.denomination)) {
        res.send({code: 4, msg: "参数错误"});
        return;
    }
    logger.startLog();
    rechargeService.createSINOPECOrder(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/searchCitys 获取所有水电煤支持城市
 * @apiGroup Recharge
 * @apiName searchCitys
 * @apiSuccess {String[]} electri_company 信息
 * @apiSuccess {String} electri_company.electri_company_id 运营商ID
 * @apiSuccess {String} electri_company.province_id 省ID
 * @apiSuccess {String} electri_company.city_id 市/区ID
 * @apiSuccess {String} electri_company.city_name 市/区名称
 * @apiSuccess {String} electri_company.electri_company_protype 电/水/煤 费用/类型(100 水, 200电, 300燃 )
 * @apiSuccess {String} electri_company.electri_company_name 公司名称
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchCitys', (req, res) => {
    logger.startLog();
    rechargeService.searchCitys().then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/searchCompanyByProtypeAndCity 查询指定中文名城市及类型的供应商公司
 * @apiGroup Recharge
 * @apiName searchCompanyByProtypeAndCity
 * @apiParam {String} city_name 城市中文名
 * @apiParam {String} electri_company_protype 电/水/煤 费用/类型(100 水, 200电, 300燃 )
 * @apiSuccess {String[]} electri_company 信息
 * @apiSuccess {String} electri_company.electri_company_id 运营商ID
 * @apiSuccess {String} electri_company.province_id 省ID
 * @apiSuccess {String} electri_company.city_id 市/区ID
 * @apiSuccess {String} electri_company.city_name 市/区名称
 * @apiSuccess {String} electri_company.electri_company_protype 电/水/煤 费用/类型(100 水, 200电, 300燃 )
 * @apiSuccess {String} electri_company.electri_company_name 公司名称
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchCompanyByProtypeAndCity', (req, res) => {
    const data = req.body;
    if (!data.city_name) {
        return res.send({code: 4, msg: "参数不齐"});
    }
    logger.startLog();
    rechargeService.searchCompanyByProtypeAndCity(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/searchCompanyByCity 查询指定城市所支持的类型
 * @apiGroup Recharge
 * @apiName searchCompanyByCity
 * @apiParam {String} province_id 省份编号
 * @apiParam {String} city_id 城市编号
 * @apiSuccess {String} electri_company_protype 电/水/煤 费用(100 水, 200电, 300燃 )
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchCompanyByCity', (req, res) => {
    let data = req.body;
    if (!data.province_id || !data.city_id) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    logger.startLog();
    rechargeService.searchCompanyByCity(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/searchCompanyByProtype 查询指定城市的类型供应商公司
 * @apiGroup Recharge
 * @apiName searchCompanyByProtype
 * @apiParam {String} province_id 省份编号
 * @apiParam {String} city_id 城市编号
 * @apiParam {String} electri_company_protype 电/水/煤 类型(100 水, 200电, 300燃 )
 * @apiSuccess {String[]} electri_company 信息
 * @apiSuccess {String} electri_company.electri_company_id 运营商ID
 * @apiSuccess {String} electri_company.province_id 省ID
 * @apiSuccess {String} electri_company.city_id 市/区ID
 * @apiSuccess {String} electri_company.city_name 市/区名称
 * @apiSuccess {String} electri_company.electri_company_protype 电/水/煤 费用/类型
 * @apiSuccess {String} electri_company.electri_company_name 公司名称
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchCompanyByProtype', (req, res) => {
    let data = req.body;
    if (!data.province_id || !data.city_id || !data.electri_company_protype) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    logger.startLog();
    rechargeService.searchCompanyByProtype(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/searchCompanyById 查询指定城市的类型供应商公司
 * @apiGroup Recharge
 * @apiName searchCompanyById
 * @apiParam {String} province_id 省份编号
 * @apiParam {String} city_id 城市编号
 * @apiParam {String} electri_company_protype 电/水/煤 类型
 * @apiSuccess {String[]} electri_company 信息
 * @apiSuccess {String} electri_company.electri_company_id 运营商ID
 * @apiSuccess {String} electri_company.province_id 省ID
 * @apiSuccess {String} electri_company.city_id 市/区ID
 * @apiSuccess {String} electri_company.city_name 市/区名称
 * @apiSuccess {String} electri_company.electri_company_protype 电/水/煤 费用/类型(100 水, 200电, 300燃 )
 * @apiSuccess {String} electri_company.electri_company_name 公司名称
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchCompanyById', (req, res) => {
    let data = req.body;
    if (!data.province_id || !data.city_id || !data.electri_company_protype) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    logger.startLog();
    rechargeService.searchCompanyById(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/bills 水电煤账单查询
 * @apiGroup Recharge
 * @apiName bills
 * @apiParam {String} electri_company_id 运营商ID
 * @apiParam {String} account 缴费号
 * @apiSuccess {String} picoid 产品编号
 * @apiSuccess {String} account 缴费帐号
 * @apiSuccess {String} bills 账单金额 单位分 整形
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/bills', (req, res) => {
    let data = req.body;
    if (!data.electri_company_id || !data.account) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    logger.startLog();
    rechargeService.bills(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/recharge 水电煤缴费充值
 * @apiGroup Recharge
 * @apiName recharge
 * @apiParam {String} token token
 * @apiParam {String} electri_company_id 运营商ID
 * @apiParam {String} account 缴费号
 * @apiParam {Number} money 缴费金额
 * @apiSuccess {String} ordernumber 商家订单号
 * @apiSuccess {String} 1 下单成功
 * @apiError {String} 2 下单失败
 * @apiError {String} 3 错误信息
 */
router.post('/recharge', (req, res) => {
    let data = req.body;
    if (!data.electri_company_id || !data.account || !data.money) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    logger.startLog();
    rechargeService.createRechargeOrder(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/queryList 查询商品列表（游戏）
 * @apiGroup Recharge
 * @apiName queryList
 * @apiParam {String} cardid 商品编码 (游戏22)
 * @apiSuccess {String} cardid 商品子编码
 * @apiSuccess {String} classid 商品子编码
 * @apiSuccess {String} cardname 商品名
 * @apiSuccess {String} detail 商品详情
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/queryList', (req, res) => {
    let data = req.body;
    if (!data.cardid) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    logger.startLog();
    rechargeService.queryList(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/retonline 订单充值有结果回调的URL地址
 * @apiGroup Recharge
 * @apiName retonline
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/retonline1', (req, res) => {
    logger.startLog();
    let data = req.body;
    rechargeService.retonline(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/searchFlowValue 查询指定运营商与地区的流量值
 * @apiGroup Recharge
 * @apiName searchFlowValue
 * @apiParam {String} flow_supplier 运营商（1移动, 2联通, 3电信）
 * @apiParam {String} flow_range 使用地区
 * @apiSuccess {Int} flow_flowValue 流量面值
 * @apiSuccess {Int} flow_perValue 价格面值
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/searchFlowValue', (req, res) => {
    let data = req.body;
    if (!data.flow_supplier || !data.flow_range) {
        res.send({code: 4, msg: "参数不齐"});
    }
    logger.startLog();
    rechargeService.searchFlowValue(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/searchFlowInfo 查询指定运营商及地区及流量面值查询流量信息
 * @apiGroup Recharge
 * @apiName searchFlowInfo
 * @apiParam {String} flow_supplier 运营商（1移动, 2联通, 3电信）
 * @apiParam {String} flow_range 使用地区
 * @apiParam {Int} flow_flowValue 流量面值
 * @apiSuccess {String} flow_chain 是否全国（0非全国，1全国）
 * @apiSuccess {String} flow_supplier 运营商（1移动, 2联通, 3电信）
 * @apiSuccess {Int} flow_perValue 价格面值
 * @apiSuccess {Int} flow_flowValue 流量面值
 * @apiSuccess {Int} flow_price 价格
 * @apiSuccess {String} flow_range 使用范围
 * @apiSuccess {String} flow_expiry_date 有效日期
 * @apiSuccess {String} flow_effective_date 生效日期
 * @apiSuccess {String} flow_filling_limit 是否限购
 * @apiSuccess {String} flow_remark 备注信息
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/searchFlowInfo', (req, res) => {
    let data = req.body;
    if (!data.flow_supplier || !data.flow_range || !data.flow_flowValue) {
        res.send({code: 4, msg: "参数不齐"});
    }
    logger.startLog();
    rechargeService.searchFlowInfo(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/queryTrafficCity 交罚违章支持城市查询接口
 * @apiGroup Recharge
 * @apiName queryTrafficCity
 * @apiSuccess {String} city 城市
 * @apiSuccess {String} cityPrefix 省级代码
 * @apiSuccess {Int} engineNoLength 价格面值
 * @apiSuccess {Int} vinLength 流量面值
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/queryTrafficCity', (req, res) => {
    logger.startLog();
    rechargeService.queryTrafficCity().then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/queryTrafficFines 交罚违章查询接口
 * @apiGroup Recharge
 * @apiName queryTrafficFines
 * @apiParam {String} plateNumber 车牌号码
 * @apiParam {String} frameNumber 车架号码
 * @apiParam {String} engineNumber 发动机号码
 * @apiParam {String} ownerMobile 车主号码
 * @apiParam {String} areas 查询的城市
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/queryTrafficFines', (req, res) => {
    let data = req.body;
    if (!data.plateNumber || !data.frameNumber || !data.engineNumber || !data.ownerMobile || !data.areas) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    logger.startLog();
    rechargeService.queryTrafficFines(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/createTrafficFinesOrder 创建交罚违章缴费订单
 * @apiGroup Recharge
 * @apiName createTrafficFinesOrder
 * @apiParam {String} rechargeNo 交罚充值单号
 * @apiParam {String} plateNumber 车牌号码
 * @apiParam {String} frameNumber 车架号码
 * @apiParam {String} engineNumber 发动机号码
 * @apiParam {String} ownerMobile 车主号码
 * @apiParam {String} areas 查询的城市
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/createTrafficFinesOrder', (req, res) => {
    let data = req.body;
    if (!data.plateNumber || !data.frameNumber || !data.engineNumber || !data.ownerMobile || !data.areas || !data.rechargeNo) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    logger.startLog();
    rechargeService.createTrafficFinesOrder(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/retonline 欧飞充值回调
 */
router.post('/retonline', (req, res) => {
    let data = req.body;
    if (data) {
        data = urlencode.decode(convert.decode(data, "GBK"), "GBK");
    }
    logger.startLog();
    rechargeService.retonline(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/recharge/shyNotifyurl 赛合一充值回调
 */
router.post('/shyNotifyurl', (req, res) => {
    let data = req.body;
    logger.startLog();
    rechargeService.shyNotifyurl(data).then(val => {
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