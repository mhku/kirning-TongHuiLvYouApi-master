const express = require('express');
const router = express.Router();
const logger = require('../utils/logHelper').helper;
const hotelService = require('../service/hotelService');

/**
 * @api {post} /api/hotel/getcitylist 获取城市列表
 * @apiGroup Hotel
 * @apiName getcitylist
 * @apiParam {String} cityname 城市中文名(不必填)
 * @apiParam {String} cityename 城市英文名(不必填)
 * @apiParam {String} citypy 城市拼音简称(不必填)
 * @apiSuccess {Object[]} data 查询成功
 * @apiSuccess {String} data.id 城市ID
 * @apiSuccess {String} data.cityname 城市中文名
 * @apiSuccess {String} data.cityename 城市英文名
 * @apiSuccess {String} data.citypy 城市简称
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/getcitylist', (req, res) => {
    let data = req.body;
    logger.startLog();
    hotelService.getcitylist(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch((err) => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/hotel/getmarkplace 获取城市标志地标和名称
 * @apiGroup Hotel
 * @apiName getmarkplace
 * @apiParam {String} cityid 城市ID
 * @apiParam {String} count 显示数量
 * @apiSuccess {Object} data 查询成功
 * @apiSuccess {Object[]} data.sublm 地铁站数组
 * @apiSuccess {String} data.sublm.subname 地铁线名称
 * @apiSuccess {Object[]} data.sublm.subdata 地铁线数据
 * @apiSuccess {String} data.sublm.subdata.lng 经度
 * @apiSuccess {String} data.sublm.subdata.lat 纬度
 * @apiSuccess {String} data.sublm.subdata.Name 对象名称
 * @apiSuccess {Object[]} data.tclm 交通枢纽数组
 * @apiSuccess {Object[]} data.bnslm 商业区数组
 * @apiSuccess {Object[]} data.reglm 行政区数组
 * @apiSuccess {Object[]} data.collegelm 大学附近数组
 * @apiSuccess {Object[]} data.infirmarylm 医院附近数组
 * @apiSuccess {Object[]} data.Pavilionlm 展馆会场数组
 * @apiSuccess {Object[]} data.sceniclm 景点附近数组
 * @apiSuccess {Object[]} data.city 城市信息
 * @apiSuccess {Object[]} data.city.Id 城市ID
 * @apiSuccess {Object[]} data.city.Name 城市名称
 * @apiSuccess {Object[]} data.brandcode 品牌码数组
 * @apiSuccess {String} data.brandcode.Id 品牌码ID
 * @apiSuccess {String} data.brandcode.BrandName 品牌码名称
 * @apiSuccess {String} data.brandcode.BrandCode 品牌码编码
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/getmarkplace', (req, res) => {
    let data = req.body;
    if (!data.cityid || !data.count) {
        return res.send({code: 4, msg: "参数不齐"});
    }
    logger.startLog();
    hotelService.getmarkplace(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch((err) => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/hotel/queryhotelkw 查询关键字返回地标和酒店名称
 * @apiGroup Hotel
 * @apiName queryhotelkw
 * @apiParam {String} cityid 城市ID
 * @apiParam {String} searcount 查询数量
 * @apiParam {String} kw 关键字
 * @apiSuccess {Object} data 返回结果
 * @apiSuccess {Object[]} data.landmark 地标数组
 * @apiSuccess {String} data.landmark.Lat 地标lat数据
 * @apiSuccess {String} data.landmark.Lng 地标lng数据
 * @apiSuccess {String} data.landmark.Name 地标名称
 * @apiSuccess {Object[]} data.hotel 酒店集合
 * @apiSuccess {String} data.hotel.Id 酒店ID
 * @apiSuccess {String} data.hotel.Name 酒店名称
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/queryhotelkw', (req, res) => {
    let data = req.body;
    if (!data.cityid || !data.searcount || !data.kw) {
        return res.send({code: 4, msg: "参数不齐"});
    }
    logger.startLog();
    hotelService.queryhotelkw(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch((err) => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/hotel/getbrandcode 获取酒店品牌码接口（暂不可用）
 * @apiGroup Hotel
 * @apiName getbrandcode
 * @apiSuccess {Object} data 返回结果
 * @apiSuccess {Object[]} data.landmark 地标数组
 * @apiSuccess {String} data.landmark.Lat 地标lat数据
 * @apiSuccess {String} data.landmark.Lng 地标lng数据
 * @apiSuccess {String} data.landmark.Name 地标名称
 * @apiSuccess {Object[]} data.hotel 酒店集合
 * @apiSuccess {String} data.hotel.Id 酒店ID
 * @apiSuccess {String} data.hotel.Name 酒店名称
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/getbrandcode', (req, res) => {
    let data = req.body;
    logger.startLog();
    hotelService.getbrandcode(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch((err) => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/hotel/searchHotelList 获取酒店列表接口
 * @apiGroup Hotel
 * @apiName searchHotelList
 * @apiParam {String} cityid 城市ID
 * @apiParam {String} bdate 入住日期(YYYY-MM-DD)
 * @apiParam {String} edate 离店日期(YYYY-MM-DD)
 * @apiParam {Int} page 查询页码
 * @apiParam {Int} size 每页显示行数
 * @apiParam {String} hotelid 酒店ID（不必填）
 * @apiParam {String} regionid 行政区id（不必填）
 * @apiParam {String} kw 关键词（不必填） 例：如家快捷
 * @apiParam {String} location 坐标经纬度（不必填）例：39.9533560000，116.3298660000（前者为纬度，后者为经度） 获取结果默认为以此坐标为中心圆点的5千米范围内酒店，如果传了distance，则以distance的范围为准
 * @apiParam {String} price 价格区间（不必填）例：150,300    0,150   只写一个值默认为获取大于价格的酒店
 * @apiParam {String} starid 酒店星级（不必填）
 * @apiParam {String} brandcode 品牌码（不必填）例：GLHT
 * @apiParam {String} cityname 城市中文名（不必填）城市中文名（例：北京）
 * @apiParam {Int} distance 距离范围（不必填） 单位：千米（location不为空时生效）
 * @apiParam {String} orderby 排序字段（不必填）价格排序：StartPrice 星级排序：StarID
 * @apiParam {Int} sort 排序类型（不必填）0升序 1 降序（默认为升序）
 * @apiParam {String} resultrules 返回结果规则（不必填）返回结果规则 0 无规则 1只返回有房型数据的酒店
 * @apiSuccess {Int} intpagecount 酒店总页数
 * @apiSuccess {Int} intrecordcount 酒店总数
 * @apiSuccess {Object[]} list 酒店集合
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/searchHotelList', (req, res) => {
    let data = req.body;
    if (!data.cityid || !data.bdate || !data.edate || !data.page || !data.size) {
        return res.send({code: 4, msg: "参数不齐"});
    }
    logger.startLog();
    hotelService.searchHotelList(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch((err) => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/hotel/gethoteldetail 获取酒店详细信息接口
 * @apiGroup Hotel
 * @apiName gethoteldetail
 * @apiParam {String} hid 酒店ID
 * @apiParam {String} bdate 入住日期(YYYY-MM-DD)
 * @apiParam {String} edate 离店日期(YYYY-MM-DD)
 * @apiSuccess {Object} data 酒店信息对象
 * @apiSuccess {Object} data.CommentMode 酒店评价信息
 * @apiSuccess {String} data.CommentMode.Hot 好评数
 * @apiSuccess {String} data.CommentMode.NotHot 差评数
 * @apiSuccess {String} data.CommentMode.Rate 好评率
 * @apiSuccess {String} data.CommentMode.Total 全部评论数
 * @apiSuccess {String} data.Address 详细地址
 * @apiSuccess {String} data.ID 酒店id
 * @apiSuccess {String} data.CnName 酒店中文名
 * @apiSuccess {String} data.EnName 酒店英文名
 * @apiSuccess {String} data.CityId 城市ID
 * @apiSuccess {String} data.CityName 酒店信息对象
 * @apiSuccess {String} data.StarID 酒店星级
 * @apiSuccess {String} data.SimpleSpell 酒店拼音简称
 * @apiSuccess {String} data.WholeSpell 酒店拼音全称
 * @apiSuccess {String} data.HotelType 酒店类型
 * @apiSuccess {String} data.StartPrice 起始价格
 * @apiSuccess {String} data.Rooms 加间数量
 * @apiSuccess {String} data.MasterFloorNum 酒店信息对象
 * @apiSuccess {String} data.HotelDesc 酒店介绍
 * @apiSuccess {String} data.BookingDesc 预定要求
 * @apiSuccess {String} data.ZipCode 邮编
 * @apiSuccess {String} data.SaleTel 销售电话
 * @apiSuccess {String} data.FaxTel 传真
 * @apiSuccess {String} data.TotalTel 总机号
 * @apiSuccess {String} data.Lng 酒店经度
 * @apiSuccess {String} data.Lat 酒店纬度
 * @apiSuccess {String} data.CartType 接受银行卡
 * @apiSuccess {String} data.ServiceItem 服务条目
 * @apiSuccess {String} data.FoodItem 餐饮设施
 * @apiSuccess {String} data.PlayItem 娱乐设施
 * @apiSuccess {String} data.MeetingItem 会议设施
 * @apiSuccess {String} data.PayType 支付类型
 * @apiSuccess {String} data.HotelCode 酒店编码
 * @apiSuccess {String} data.HotelSource 酒店资源
 * @apiSuccess {Object[]} data.Imgs 图片信息
 * @apiSuccess {String} data.Imgs.ID 图片id
 * @apiSuccess {String} data.Imgs.ImgPath 图片地址路径
 * @apiSuccess {String} data.Imgs.description 图片描述
 * @apiSuccess {Objecy} xianfu 现付
 * @apiSuccess {Objecy} yufu 预付
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/gethoteldetail', (req, res) => {
    let data = req.body;
    if (!data.hid || !data.bdate || !data.edate) {
        return res.send({code: 4, msg: "参数不齐"});
    }
    logger.startLog();
    hotelService.gethoteldetail(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch((err) => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/hotel/submitorder 提交酒店订单接口
 * @apiGroup Hotel
 * @apiName submitorder
 * @apiParam {String} token token
 * @apiParam {String} bdate (必填)入住日期(YYYY-MM-DD)
 * @apiParam {String} edate (必填)离店日期(YYYY-MM-DD)
 * @apiParam {String} hid  (必填)酒店ID
 * @apiParam {Int} PT (必填)支付类型(酒店详情返回的paytype)
 * @apiParam {Int} inperson (必填)入住人数
 * @apiParam {String} price (必填)总价
 * @apiParam {String} inpersonstr  (必填)入住人员姓名字符串 格式：用英文逗号分隔开，例： 王二,张三
 * @apiParam {String} VendorCode  (必填)供应商代码
 * @apiParam {String} lxrmobile (必填)联系人手机
 * @apiParam {String} cityName (必填)酒店所属城市名
 * @apiParam {String} room_property (必填)入住房间规格
 * @apiParam {String} CnName (必填) 酒店中文名
 * @apiParam {String} order_remark 房间备注信息
 * @apiParam {String} RoomTypeId 房型id(当酒店编码为空时不能为空)
 * @apiParam {String} SetmealID 套餐id(当酒店编码为空时不能为空)
 * @apiParam {String} HotelCode 酒店编码(当房型id为空时不能为空)
 * @apiParam {String} RoomTypeCode 房型编码(当房型id为空时不能为空)
 * @apiParam {String} SetmealCode 套餐编码(当房型id为空时不能为空)
 * @apiParam {String} bedtype 床型
 * @apiParam {String} noSmoking 是否禁烟
 * @apiParam {String} otherInfo 其他信息
 * @apiParam {String} isgur 是否担保(0 不担保  1 担保 可以为空，不填写时默认为不担保)
 * @apiParam {String} lxrname 联系人姓名
 * @apiParam {String} lxrtel 联系人电话
 * @apiParam {String} lxremail 联系人邮箱
 * @apiParam {String} ArriveLateTime 最晚入住时间
 * @apiParam {String} ArriveEarlyTime 最早入住时间
 * @apiParam {String} bankcode 银行编码(Isgur为1时不能为空)
 * @apiParam {String} cardnum 信用卡号(Isgur为1时不能为空)
 * @apiParam {String} expiredate 过期时间(格式： MM/YY，即前面为两位月份，后面为两位年份，用/隔开  例：06/15)
 * @apiParam {String} cvv2 信用卡安全码(Isgur为1时不能为空 信用卡安全码，3位或4位数字形式字符串 例：888 或  8888)
 * @apiParam {String} ownername 信用卡用户姓名(Isgur为1时不能为空)
 * @apiParam {String} ownertel 信用卡用户电话(Isgur为1时不能为空)
 * @apiParam {String} creditcardusertype 证件类型(Isgur为1时不能为空    01：身份证 02：护照 03：军人证)
 * @apiParam {String} creditcarduseridnum 证件号码(Isgur为1时不能为空)
 * @apiSuccess {Object} data 酒店信息对象
 * @apiSuccess {Int} intpagecount 酒店总页数
 * @apiSuccess {Int} intrecordcount 酒店总数
 * @apiSuccess {Object[]} list 酒店集合
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/submitorder', (req, res) => {
    let data = req.body;
    //必填
    if (!data.bdate || !data.edate || !(data.hid.toString()) || !(data.PT.toString()) || !data.inperson || !(data.price.toString()) || !data.inpersonstr || !data.VendorCode) {
        return res.send({code: 4, msg: "必填参数不齐"});
    }
    //酒店编号为空
    if (!data.HotelCode) {
        if (!(data.RoomTypeId.toString()) || !(data.SetmealID.toString())) {
            return res.send({code: 4, msg: "参数不齐"});
        }
    }
    //房型ID为空
    if (!(data.RoomTypeId.toString())) {
        if (!data.HotelCode || !data.RoomTypeCode || !data.SetmealCode) {
            return res.send({code: 4, msg: "参数不齐"});
        }
    }
    //担保
    // if (data.isgur == '1') {
    //     if (!data.bankcode || !data.cardnum || !data.expiredate || !data.cvv2 || !data.ownername || !data.ownertel || !data.creditcardusertype || !data.creditcarduseridnum) {
    //         return res.send({code: 4, msg: "担保参数不齐"});
    //     }
    // }
    logger.startLog();
    hotelService.submitorder(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch((err) => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/hotel/getcitylankmark 获取城市地理位置
 * @apiGroup Hotel
 * @apiName getcitylankmark
 * @apiParam {String} cityid 城市ID
 * @apiParam {String} count 查询数量
 * @apiSuccess {Object} data 返回结果
 * @apiSuccess {Object[]} data.lm1 交通枢纽
 * @apiSuccess {String} data.lm1.lng 交通枢纽lat数据
 * @apiSuccess {String} data.lm1.lat 交通枢纽lng数据
 * @apiSuccess {String} data.lm1.Name 交通枢纽名称
 * @apiSuccess {Object[]} data.lm2 地铁站
 * @apiSuccess {String} data.lm2.lng 地铁站lat数据
 * @apiSuccess {String} data.lm2.lat 地铁站lng数据
 * @apiSuccess {String} data.lm2.Name 地铁站名称
 * @apiSuccess {Object[]} data.lm3 热门位置
 * @apiSuccess {String} data.lm3.lng 热门位置lat数据
 * @apiSuccess {String} data.lm3.lat 热门位置lng数据
 * @apiSuccess {String} data.lm3.Name 热门位置名称
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/getcitylankmark', (req, res) => {
    let data = req.body;
    if (!data.cityid || !data.count) {
        return res.send({code: 4, msg: "参数不齐"});
    }
    logger.startLog();
    hotelService.getcitylankmark(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch((err) => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/hotel/gethotelcomment 获取酒店评价接口（暂不可用）
 * @apiGroup Hotel
 * @apiName gethotelcomment
 * @apiParam {String} hid 酒店ID
 * @apiParam {Int} page 查询页码
 * @apiParam {Int} size 每页显示行数
 * @apiParam {String} recommend 评论类型（0：差评  1：好评）
 * @apiSuccess {Object} data 返回结果
 * @apiSuccess {Object[]} data.landmark 地标数组
 * @apiSuccess {String} data.landmark.Lat 地标lat数据
 * @apiSuccess {String} data.landmark.Lng 地标lng数据
 * @apiSuccess {String} data.landmark.Name 地标名称
 * @apiSuccess {Object[]} data.hotel 酒店集合
 * @apiSuccess {String} data.hotel.Id 酒店ID
 * @apiSuccess {String} data.hotel.Name 酒店名称
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/gethotelcomment', (req, res) => {
    let data = req.body;
    logger.startLog();
    hotelService.gethotelcomment(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch((err) => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/hotel/testPay 酒店支付测试接口（暂不可用）
 * @apiGroup Hotel
 * @apiName testPay
 * @apiParam {String} token token
 * @apiParam {String} order_id 订单ID
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/testPay', (req, res) => {
    let data = req.body;
    if (!data.order_id) {
        return res.send({code: 4, msg: "参数不齐"})
    }
    logger.startLog();
    hotelService.hotelordervmpay(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }).catch((err) => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/hotel/testOrder 酒店订单测试接口（暂不可用）
 * @apiGroup Hotel
 * @apiName testOrder
 * @apiParam {String} token token
 * @apiParam {String} order_id 第三方订单ID
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/testOrder', (req, res) => {
    let data = req.body;
    if (!data.order_id) {
        return res.send({code: 4, msg: "参数不齐"})
    }
    hotelService.searchorderdetail({order_target_id: data.order_id}).then(val => {
        res.send(val);
    }).catch((err) => {
        res.send(err);
    });
});


module.exports = router;

