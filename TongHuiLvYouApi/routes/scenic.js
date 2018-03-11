const express = require('express');
const router = express.Router();
const xml2js = require('xml2js');
const parseString = xml2js.parseString;
const builder = new xml2js.Builder();
const logger = require('../utils/logHelper').helper;
const scenicService = require('../service/scenicService');
const returnXml = builder.buildObject({
    response: {
        state: {
            code: 1000,
            message: "接收成功"
        }
    }
});


/**
 * @api {post} /api/scenic/searchProducts 批量景区基本信息接口
 * @apiGroup Scenic
 * @apiName searchProducts
 * @apiSuccess {String} totalPage 列表总页数
 * @apiSuccess {String} scenicNameList 结果集合
 * @apiSuccess {String} scenicNameList.place 景区
 * @apiSuccess {String} scenicNameList.secnicId 景区 ID 唯一
 * @apiSuccess {String} scenicNameList.secnicName 景区名称
 * @apiSuccess {String} scenicNameList.placeInfo 景区描述
 * @apiSuccess {String} scenicNameList.placeAct 景区主题
 * @apiSuccess {String} scenicNameList.placeLevel 景区等级 0：无；1：A 级；2：AA 级；3：AAA 级；4：AAAA 级；5：AAAAA
 * @apiSuccess {String} scenicNameList.placeImage 图片 URl
 * @apiSuccess {String} scenicNameList.placeToAddr 景区详细地
 * @apiSuccess {String} scenicNameList.openTimes 景区营业时间
 * @apiSuccess {String} scenicNameList.openTimeInfo 景区营业时间描述
 * @apiSuccess {String} scenicNameList.sightStart 景区营业开始时间
 * @apiSuccess {String} scenicNameList.sightEnd 景区营业结束时间
 * @apiSuccess {String} scenicNameList.placeTown 所属镇和街道
 * @apiSuccess {String} scenicNameList.placeXian 所属县
 * @apiSuccess {String} scenicNameList.placeCity 省/自治区下曲市，直辖市和特别行政区下曲区
 * @apiSuccess {String} scenicNameList.placeProvince 国内取省级别
 * @apiSuccess {String} scenicNameList.placeCountry 景区所在国家
 * @apiSuccess {String} scenicNameList.baiduDat 景区经纬度（百度）
 * @apiSuccess {String} scenicNameList.googleDat 景区经纬度（谷歌）
 * @apiSuccess {String} scenicNameList.longitud 景区所在经度
 * @apiSuccess {String} scenicNameList.latitude 景区所在纬度
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/searchProducts', (req, res) => {
    logger.startLog();
    scenicService.scenicInfoListByPage(1).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/scenic/productInfoListByPage 批量产品/商品信息接口
 * @apiGroup Scenic
 * @apiName productInfoListByPage
 * @apiSuccess {String} totalPage 列表总页数
 * @apiSuccess {String} productList 结果集合
 * @apiSuccess {String} scenicNameList.place 城市名称
 * @apiSuccess {String} scenicNameList.secnicId 城市名称
 * @apiSuccess {String} scenicNameList.secnicName 城市名称
 * @apiSuccess {String} scenicNameList.placeInfo 城市名称
 * @apiSuccess {String} scenicNameList.placeAct 城市名称
 * @apiSuccess {String} scenicNameList.placeLevel 城市名称
 * @apiSuccess {String} scenicNameList.placeImage 城市名称
 * @apiSuccess {String} scenicNameList.place 城市名称
 * @apiSuccess {String} city_initials 城市首字母组合
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/productInfoListByPage', (req, res) => {
    logger.startLog();
    scenicService.productInfoListByPage(1).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/scenic/productPriceListByPage 批量价格/库存信息接口
 * @apiGroup Scenic
 * @apiName productPriceListByPage
 * @apiSuccess {String} totalPage 列表总页数
 * @apiSuccess {String} productList 结果集合
 * @apiSuccess {String} scenicNameList.place 城市名称
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/productPriceListByPage', (req, res) => {
    logger.startLog();
    scenicService.productPriceListByPage(1).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/scenic/createOrder 创建订单
 * @apiGroup Scenic
 * @apiName createOrder
 * @apiParam {String} token token
 * @apiParam {String} goodsId 商品ID（必传）
 * @apiParam {Object} booker 订票人信息（必传）
 * @apiParam {String} booker.name 取票人名称（必传）
 * @apiParam {String} booker.mobile 取票人手机号（必传）
 * @apiParam {String} booker.email 邮箱（选填）
 * @apiParam {Int} quantity 游玩人数
 * @apiParam {Date} visitDate 时间（必传）
 * @apiParam {Object[]} travellers 游客
 * @apiParam {String} travellers.name 游玩人姓名
 * @apiParam {String} travellers.enName 游玩人英文名
 * @apiParam {String} travellers.mobile 游玩人手机号
 * @apiParam {String} travellers.email 游玩人email
 * @apiParam {String} travellers.credentials 游玩人证件
 * @apiParam {String} travellers.credentialsType 游玩人证件类型
 * @apiParam {String} travellers.birthday 游玩人生日（YYYY-MM-DD）
 * @apiParam {Object[]} expressage 收件人信息
 * @apiParam {String} expressage.recipients 收件人（根据商品决定）
 * @apiParam {String} expressage.contactNumber 收件手机号码（根据商品决定）
 * @apiParam {String} expressage.address 地址（根据商品决定）
 * @apiParam {String} expressage.postcode 邮编（根据商品决定）
 * @apiSuccess {String} totalPage 列表总页数
 * @apiSuccess {String} productList 结果集合
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/createOrder', (req, res) => {
    let data = req.body;
    if (!data.goodsId || !data.booker || !data.quantity || !data.visitDate || !data.travellers) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    // data.tourists = data.tourists.split(',');
    // data.travellers = JSON.parse(data.travellers);
    // data.expressage = data.expressage ? JSON.parse(data.expressage) : null;
    // data.booker = JSON.parse(data.booker);
    logger.startLog();
    scenicService.createOrder(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        console.error(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/scenic/resendCode 重发凭证接口
 * @apiGroup Scenic
 * @apiName resendCode
 * @apiParam {String} token token
 * @apiParam {String} order_id 订单ID（必传）
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/resendCode', (req, res) => {
    let data = req.body;
    if (!data.order_id) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    logger.startLog();
    scenicService.resendCode(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/scenic/orderCancel 申请退款接口
 * @apiGroup Scenic
 * @apiName orderCancel
 * @apiParam {String} token token
 * @apiParam {String} order_id 订单ID（必传）
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/orderCancel', (req, res) => {
    // let data = req.body;
    // if (!data.order_id) {
    //     res.send({code: 4, msg: "参数不齐"});
    //     return;
    // }
    // logger.startLog();
    // scenicService.orderCancel(data).then(val => {
    //     logger.endLog(val);
    //     res.send(val);
    // }).catch(err => {
    //     logger.endErrLog(err);
    //     res.send(err);
    // });
});

/**
 * @api {post} /api/scenic/getOrderInfo 订单查询接口
 * @apiGroup Scenic
 * @apiName getOrderInfo
 * @apiParam {String} token token
 * @apiParam {String} partnerOrderNos 订单ID
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/getOrderInfo', (req, res) => {
    let data = req.body;
    if (!data.partnerOrderNos) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    logger.startLog();
    scenicService.getOrderInfo(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/scenic/searchScenicProducts 按景区/搜索词查询产品
 * @apiGroup Scenic
 * @apiName searchScenicProducts
 * @apiParam {String} scenicName 景区名称
 * @apiParam {String} productName 搜索关键词
 * @apiParam {String} sort 排序 1升序 2降序
 * @apiParam {String} page 查询页
 * @apiParam {String} size 查询大小
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/searchScenicProducts', (req, res) => {
    let data = req.body;
    if (!data.scenicName || !data.page || !data.size) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    logger.startLog();
    scenicService.searchScenicProducts(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/scenic/findGoodByProductId 根据产品ID获取商品信息
 * @apiGroup Scenic
 * @apiName findGoodByProductId
 * @apiParam {String} productId 产品ID
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */

router.post('/findGoodByProductId', (req, res) => {
    let data = req.body;
    if (!data.productId) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    logger.startLog();
    scenicService.findGoodByProductId(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/scenic/findProductById 根据产品ID获取产品信息
 * @apiGroup Scenic
 * @apiName findProductById
 * @apiParam {String} productId 产品ID
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/findProductById', (req, res) => {
    let data = req.body;
    if (!data.productId) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    logger.startLog();
    scenicService.findProductById(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/scenic/findPriceByGoodId 根据商品ID获取价格信息
 * @apiGroup Scenic
 * @apiName findPriceByGoodId
 * @apiParam {String} goodsId 商品ID
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/findPriceByGoodId', (req, res) => {
    let data = req.body;
    if (!data.goodsId) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    logger.startLog();
    scenicService.findPriceByGoodId(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/scenic/scenicInfoList 根据商品ID获取景区信息
 * @apiGroup Scenic
 * @apiName scenicInfoList
 * @apiParam {String} scenicId 景区ID
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/scenicInfoList', (req, res) => {
    let data = req.body;
    if (!data.scenicId) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    logger.startLog();
    scenicService.scenicInfoList(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch(err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * /api/scenic/pushProductChangeInfo 产品信息变更
 */
router.post('/pushProductChangeInfo', (req, res) => {
    let product = req.body.product;
    parseString(product, {explicitArray: false}, (err, result) => {
        logger.startLog();
        scenicService.pushProductChangeInfo(result.request).then(val => {
            logger.endLog(val);
            res.send(returnXml);
        }).catch((err) => {
            logger.endErrLog(err);
            res.send(returnXml);
        });
    });
});

/**
 * /api/scenic/pushOrder 订单信息推送
 */
router.post('/pushOrder', (req, res) => {
    let order = req.body.order;
    parseString(order, {explicitArray: false}, (err, result) => {
        logger.startLog();
        scenicService.pushOrder(result.request).then(val => {
            logger.endLog(val);
        }).catch((err) => {
            logger.endErrLog(err);
        });
        res.send(returnXml);
    });
});

/**
 * /api/scenic/pushOrderCancel 退款信息推送
 */
router.post('/pushOrderCancel', (req, res) => {
    let order = req.body.order;
    parseString(order, {explicitArray: false}, (err, result) => {
        logger.startLog();
        scenicService.pushOrderCancel(result.request).then(val => {
            logger.endLog(val);
        }).catch((err) => {
            logger.endErrLog(err);
        });
    });
    res.send(returnXml);
});


module.exports = router;