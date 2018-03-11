const express = require('express');
const router = express.Router();
const orderService = require('../../houtai/service/orderService');
/**
 * @api {post} /api/order/searchOrder 订单列表
 * @apiGroup order
 * @apiName searchOrder
 * @apiParam {String} token
 * @apiParam {Number} page 从
 * @apiParam {Number} size 到
 * @apiParam {Number} order_type 订单类型(1,火车票2,飞机票3,汽车票4，船票 5补差价)
 * @apiParam {Number} order_state 订单状态（1待支付，2待使用，3待评价，4退款/售后，5已完成， 6已取消）
 * @apiParam {Number} order_no 订单号
 * @apiParam {Number} order_phone 用户手机号
 * @apiParam {Number} ago 下单时间从
 * @apiParam {Number} end 下单时间到
 * @apiSuccess {String} order_id 订单ID
 * @apiSuccess {String} order_no 订单号
 * @apiSuccess {String} order_amount  订单总额
 * @apiSuccess {String} order_price 订单单价
 * @apiSuccess {String} order_reason 订单失败原因
 * @apiSuccess {String} order_telephone 订单办理电话号码/账号
 * @apiSuccess {String} order_payTime 订单支付时间
 * @apiSuccess {String} order_origin 出发地
 * @apiSuccess {String} order_destination 目的地
 * @apiSuccess {String} order_other_origin 附加(始发机场+航站楼)
 * @apiSuccess {String} order_other_destination 附加(到达机场+航站楼)
 * @apiSuccess {String} order_departure_datetime 出发时间
 * @apiSuccess {String} order_safe_state 订单保险状态(0无, 1有)
 * @apiSuccess {String} order_safe_price 订单保险金额
 * @apiSuccess {String} order_count 购买数量
 * @apiSuccess {String} order_title 订单标题
 * @apiSuccess {String} order_discount 订单优惠
 * @apiSuccess {String} order_number 航班号/车次/房号/场次等
 * @apiSuccess {String} order_tickettype 票型
 * @apiSuccess {String} order_ticke 票别
 * @apiSuccess {String} order_seat_no 座位号/房号
 * @apiSuccess {String} order_company_name 公司名(航司等)
 * @apiSuccess {String} order_trip_rule 行程规则(0单程 1去程 2 返程)
 * @apiSuccess {String} order_otherInfo 订单其他信息
 * @apiSuccess {String} order_state 订单状态（1待支付，2待使用，3待评价，4退款/售后，5已完成， 6已取消）
 * @apiSuccess {String} order_createtime 下单时间
 * @apiSuccess {String} user_phone 用户电话
 * @apiSuccess {String} order_airportTax 机建费
 * @apiSuccess {String} order_fuelTax 燃油费
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchOrder', function (req, res) {
    let data = req.body;
    if (!data.page || !data.size) {
        return res.send({code: 2, msg: "参数不齐"})
    }
    orderService.searchOrder(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});
/**
 * @api {post} /api/order/updateOrderstate 修改订单状态
 * @apiGroup order
 * @apiName updateOrderstate
 * @apiParam {String} order_id 订单号
 * @apiParam {String} order_state 订单状态（1待支付，2待使用，3待评价，4退款/售后，5已完成， 6已取消）
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/updateOrderstate', function (req, res) {
    let data = req.body;
    if (!data.order_id || !data.order_state) {
        return res.send({code: 2, msg: "参数不齐"})
    }
    // data.order_state=parseInt(data.order_state);
    orderService.updateOrderstate(data).then((result) => {
        res.send({code:1,msg:"修改成功"});
    }).catch((error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/order/searchOrderDetailed 订单详细
 * @apiGroup order
 * @apiName searchOrderDetailed
 * @apiParam {Number} order_id 订单号
 * @apiSuccess {String} order_id 订单ID
 * @apiSuccess {String} order_no 订单号
 * @apiSuccess {String} order_amount  订单总额
 * @apiSuccess {String} order_price 订单单价
 * @apiSuccess {String} order_reason 订单失败原因
 * @apiSuccess {String} order_telephone 订单办理电话号码/账号
 * @apiSuccess {String} order_payTime 订单支付时间
 * @apiSuccess {String} order_origin 出发地
 * @apiSuccess {String} order_destination 目的地
 * @apiSuccess {String} order_other_origin 附加(始发机场+航站楼)
 * @apiSuccess {String} order_other_destination 附加(到达机场+航站楼)
 * @apiSuccess {String} order_departure_datetime 出发时间
 * @apiSuccess {String}  order_end_time 结束时间
 * @apiSuccess {String} order_safe_state 订单保险状态(0无, 1有)
 * @apiSuccess {String} order_safe_price 订单保险金额
 * @apiSuccess {String} order_count 购买数量
 * @apiSuccess {String} order_title 订单标题
 * @apiSuccess {String} order_number 航班号/车次/房号/场次等
 * @apiSuccess {String} order_tickettype 票型
 * @apiSuccess {String} order_discount 订单优惠
 * @apiSuccess {String} order_ticke 票别
 * @apiSuccess {String} order_seat_no 座位号/房号
 * @apiSuccess {String} order_company_name 公司名(航司等)
 * @apiSuccess {String} order_trip_rule 行程规则(0单程 1去程 2 返程)
 * @apiSuccess {String} order_otherInfo 订单其他信息
 * @apiSuccess {String} order_pay 订单支付方式(1, 支付宝, 2微信，3其它)
 * @apiSuccess {String} order_state 订单状态（1待支付，2待使用，3待评价，4退款/售后，5已完成， 6已取消）
 * @apiSuccess {String} user_nickname 昵称
 * @apiSuccess {String} user_phone 用户电话
 * @apiSuccess {String} user_identityCard 身份证号码
 * @apiSuccess {String} order_createtime 下单时间
 * @apiSuccess {List} tourist 游客信息
 * @apiSuccess {String} tourist.tourist_price 游客单价
 * @apiSuccess {String} tourist.tourist_name 游客姓名
 * @apiSuccess {String} tourist.tourist_gender 游客性别(1男 2女)
 * @apiSuccess {String} tourist.tourist_identityType 证件类型
 * @apiSuccess {String} tourist.tourist_identityNo 证件号
 * @apiSuccess {String} tourist.tourist_crowd_type 游客人群类型（0成人，1儿童）
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchOrderDetailed', function (req, res) {
    let data = req.body;
    if (!data.order_id) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    orderService.searchOrderDetailed(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/order/searchCharge 充值列表
 * @apiGroup order
 * @apiName searchCharge
 * @apiParam {Number} page 从
 * @apiParam {Number} size 到
 * @apiParam {Number} order_no 订单号
 * @apiParam {Number} order_phone 用户手机号码
 * @apiParam {Number} ago 从
 * @apiParam {Number} end 到
 * @apiParam {Number} number 充值号码
 * @apiParam {Number} type 1:话费，2：流量 3：Q币 4：游戏充值
 * @apiParam {Number} order_state 订单状态（1待支付，2待使用，3待评价，4退款/售后，5已完成， 6已取消）
 * @apiSuccess {String} order_id 订单ID
 * @apiSuccess {String} order_no 订单号
 * @apiSuccess {String} order_amount  订单总额
 * @apiSuccess {String} order_price 订单单价
 * @apiSuccess {String} order_reason 订单失败原因
 * @apiSuccess {String} order_telephone 订单办理电话号码/账号
 * @apiSuccess {String} order_payTime 订单支付时间
 * @apiSuccess {String} order_origin 出发地
 * @apiSuccess {String} order_destination 目的地
 * @apiSuccess {String} order_other_origin 附加(始发机场+航站楼)
 * @apiSuccess {String} order_other_destination 附加(到达机场+航站楼)
 * @apiSuccess {String} order_departure_datetime 出发时间
 * @apiSuccess {String}  order_end_time 结束时间
 * @apiSuccess {String} order_safe_state 订单保险状态(0无, 1有)
 * @apiSuccess {String} order_safe_price 订单保险金额
 * @apiSuccess {String} order_count 购买数量
 * @apiSuccess {String} order_title 订单标题
 * @apiSuccess {String} order_number 航班号/车次/房号/场次等
 * @apiSuccess {String} order_tickettype 票型
 * @apiSuccess {String} order_discount 订单优惠
 * @apiSuccess {String} order_ticke 票别
 * @apiSuccess {String} order_seat_no 座位号/房号
 * @apiSuccess {String} order_company_name 公司名(航司等)
 * @apiSuccess {String} order_trip_rule 行程规则(0单程 1去程 2 返程)
 * @apiSuccess {String} order_otherInfo 订单其他信息
 * @apiSuccess {String} order_pay 订单支付方式(1, 支付宝, 2微信，3其它)
 * @apiSuccess {String} order_state 订单状态（1待支付，2待使用，3待评价，4退款/售后，5已完成， 6已取消）
 * @apiSuccess {String} user_nickname 昵称
 * @apiSuccess {String} user_phone 用户电话
 * @apiSuccess {String} user_identityCard 身份证号码
 * @apiSuccess {String} order_createtime 下单时间
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchCharge', function (req, res) {
    let data = req.body;
    if (!data.page || !data.size) {
        return res.send({code: 2, msg: "参数不齐"})
    }
    orderService.searchCharge(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});
/**
 * @api {post} /api/order/searchCard 充值卡列表
 * @apiGroup order
 * @apiName searchCard
 * @apiParam {Number} page 从
 * @apiParam {Number} size 到
 * @apiParam {Number} order_no 订单号
 * @apiParam {Number} order_phone 用户手机号码
 * @apiParam {Number} order_telephone 加油卡号码
 * @apiParam {Number} user_name 持卡人姓名
 * @apiParam {Number} ago 从
 * @apiParam {Number} end 到
 * @apiParam {Number} order_state  订单状态（1待支付，2待使用，3待评价，4退款/售后，5已完成， 6已取消）
 * @apiParam {Number} order_type 1:中国石油 2：中石化油卡充值
 * @apiSuccess {String} order_no 订单号
 * @apiSuccess {String} user_phone 用户手机号
 * @apiSuccess {String} user_nickname 昵称(用户姓名)
 * @apiSuccess {String} order_telephone 充值账号
 * @apiSuccess {String} order_original_price 原价
 * @apiSuccess {String} order_discount 优惠
 * @apiSuccess {String} order_amount 支付金额
 * @apiSuccess {String} order_state 订单状态（1待支付，2待使用，3待评价，4退款/售后，5已完成， 6已取消）
 * @apiSuccess {String} order_payTime 付款时间
 * @apiSuccess {String} order_createtime 下单时间
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchCard', function (req, res) {
    let data = req.body;
    if (!data.page || !data.size) {
        return res.send({code: 2, msg: "参数不齐"})
    }
    orderService.searchCard(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});
/**
 * @api {post} /api/order/searchLife 生活费用列表
 * @apiGroup order
 * @apiName searchLife
 * @apiParam {Number} page 从
 * @apiParam {Number} size 到
 * @apiParam {Number} order_no 订单号
 * @apiParam {Number} order_phone 用户手机号码
 * @apiParam {Number} order_telephone 操作号码
 * @apiParam {Number} payin_gunit 缴费单位
 * @apiParam {Number} ago 从
 * @apiParam {Number} end 到
 * @apiParam {Number} order_state  订单状态（1待支付，2待使用，3待评价，4退款/售后，5已完成， 6已取消）
 * @apiParam {Number} order_type 1:水费 2:电费 3:燃气费 4：有线电视-暂无  5：固话 6：宽带 7：物业费-暂无
 * @apiSuccess {String} order_no 订单号
 * @apiSuccess {String} user_phone 用户手机号
 * @apiSuccess {String} order_departure_datetime 账期/使用时间
 * @apiSuccess {String} order_telephone 操作号码
 * @apiSuccess {String} order_company_name 缴费单位
 * @apiSuccess {String} order_amount 订单总额
 * @apiSuccess {String} order_state 订单状态（1待支付，2待使用，3待评价，4退款/售后，5已完成， 6已取消）
 * @apiSuccess {String} order_payTime 付款时间
 * @apiSuccess {String} order_createtime 下单时间
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchLife', function (req, res) {
    let data = req.body;
    if (!data.page || !data.size) {
        return res.send({code: 2, msg: "参数不齐"})
    }
    orderService.searchLife(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/order/searchHotel 酒店列表
 * @apiGroup order
 * @apiName searchHotel
 * @apiParam {Number} page 从
 * @apiParam {Number} size 到
 * @apiParam {Number} order_no 订单号
 * @apiParam {Number} city 城市
 * @apiParam {Number} company 公司名称(酒店名称)
 * @apiParam {Number} order_phone 用户手机号码
 * @apiParam {Number} ago 从
 * @apiParam {Number} end 到
 * @apiParam {Number} type 1：国内，2：国际 3：钟点
 * @apiParam {Number} order_state 1,待支付 2,已付款 4,退款/售后 5,已完成 6,已取消
 * @apiSuccess {String} order_id 订单ID
 * @apiSuccess {String} order_no 订单号
 * @apiSuccess {String} user_phone 用户手机号
 * @apiSuccess {String} order_destination 目的地
 * @apiSuccess {String} order_company_name 公司名称(酒店名称)
 * @apiSuccess {String} order_tickettype 规格
 * @apiSuccess {String} order_count 数量
 * @apiSuccess {String} order_tickettype 规格
 * @apiSuccess {String} order_price 单价
 * @apiSuccess {String} order_amount 订单总额
 * @apiSuccess {String} order_discount 优惠
 * @apiSuccess {String} order_createtime 下单时间
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchHotel', function (req, res) {
    let data = req.body;
    if (!data.page || !data.size || !data.type) {
        return res.send({code: 2, msg: "参数不齐"})
    }
    orderService.searchHotel(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});


/**
 * @api {post} /api/order/searchHotelDetailed 酒店详细
 * @apiGroup order
 * @apiName searchHotelDetailed
 * @apiParam {Number} order_id 订单号
 * @apiSuccess {String} user.order_id 订单ID
 * @apiSuccess {String} user.order_no 订单号
 * @apiSuccess {String} user.user_phone 用户手机号
 * @apiSuccess {String} user.user_nickname 用户昵称
 * @apiSuccess {String} user.order_createtime 下单时间
 * @apiSuccess {String} user.order_pay 支付方式
 * @apiSuccess {String} user.order_payTime 付款时间
 * @apiSuccess {String} user.user_identityCard 证件号
 * @apiSuccess {String} user.order_state 订单状态（1待支付，2待使用，3待评价，4退款/售后，5已完成， 6已取消）
 * @apiSuccess {String} order_departure_datetime 开始时间
 * @apiSuccess {String} order_end_time 结束时间
 * @apiSuccess {String} order_destination 目的地
 * @apiSuccess {String} order_company_name 公司名称(酒店名称)
 * @apiSuccess {String} order_tickettype 规格
 * @apiSuccess {String} order_count 数量
 * @apiSuccess {String} order_tickettype 规格
 * @apiSuccess {String} order_price 单价
 * @apiSuccess {String} order_amount 订单总额
 * @apiSuccess {String} order_discount 优惠
 * @apiSuccess {String} order_service_price 服务费用/税费
 * @apiSuccess {String} order_mailbox 联系邮箱
 * @apiSuccess {String} order_remark 订单备注
 * @apiSuccess {String} order_telephone 联系电话
 * @apiSuccess {list[]} tourist 游客名称(入住人)
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchHotelDetailed', function (req, res) {
    let data = req.body;
    if (!data.order_id) {
        return res.send({code: 2, msg: "参数不齐"})
    }
    orderService.searchHotelDetailed(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});
/**
 * @api {post} /api/order/searchSpot 景点列表
 * @apiGroup order
 * @apiName searchSpot
 * @apiParam {Number} page 从
 * @apiParam {Number} size 到
 * @apiParam {Number} order_no 订单号
 * @apiParam {Number} order_phone 用户手机号
 * @apiParam {Number} city 目的地
 * @apiParam {Number} spot 景点名称
 * @apiParam {Number} ago 从
 * @apiParam {Number} end 到
 * @apiParam {Number} type 1:境内景区 2：境外景区
 * @apiParam {Number} order_state 1,待支付 2,已付款 4,退款/售后 5,已完成 6,已取消
 * @apiSuccess {String} order_id 订单ID
 * @apiSuccess {String} order_no 订单号
 * @apiSuccess {String} user_phone 用户手机号
 * @apiSuccess {String} order_destination 目的地
 * @apiSuccess {String} tourist_name 取票人
 * @apiSuccess {String} order_company_name 公司名称(酒店名称)
 * @apiSuccess {String} order_departure_datetime 游玩日期
 * @apiSuccess {String} order_count 数量
 * @apiSuccess {String} order_price 单价
 * @apiSuccess {String} order_discount 优惠
 * @apiSuccess {String} order_safe_price 保险
 * @apiSuccess {String} order_amount 订单总额
 * @apiSuccess {String} order_createtime 下单时间
 * @apiSuccess {String} order_state 订单状态（1待支付，2待使用，3待评价，4退款/售后，5已完成， 6已取消）
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchSpot', function (req, res) {
    let data = req.body;
    if (!data.type) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    orderService.searchSpot(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});
/**
 * @api {post} /api/order/searchSpotDetailed 景点详细
 * @apiGroup order
 * @apiName searchSpotDetailed
 * @apiParam {Number} order_no 订单号
 * @apiSuccess {String} order_id 订单ID
 * @apiSuccess {String} user_phone 用户手机号
 * @apiSuccess {String} user_nickname 用户昵称
 * @apiSuccess {String} order_createtime 下单时间
 * @apiSuccess {String} order_state 订单状态
 * @apiSuccess {String} order_price 订单单价
 * @apiSuccess {String} order_payTime 付款时间
 * @apiSuccess {String} order_pay 平台支付方式(1, 支付宝, 2微信，3其它)
 * @apiSuccess {String} order_discount 优惠
 * @apiSuccess {String} order_safe_price 保险
 * @apiSuccess {String} order_destination 目的地
 * @apiSuccess {String} order_company_name 景点名称
 * @apiSuccess {String} order_remark 订单其他信息(介绍等等)
 * @apiSuccess {String} order_count 目的地
 * @apiSuccess {String} order_departure_datetime 游玩日期
 * @apiSuccess {String} tourist_name 游客名称
 * @apiSuccess {String} tourist_identityType 游客证件类型（1 身份证，2 护照， 3军官证，4 士兵证， 5 台胞证， 6 其他）
 * @apiSuccess {String} tourist_identityNo 游客证件号
 * @apiSuccess {String} tourist_phone 游客手机号码
 * @apiSuccess {String} tourist_email 游客邮箱
 * @apiSuccess {String} tourist_crowd_type 游客人群类型（0成人，1儿童）
 * @apiSuccess {String} order_amount 订单总额
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchSpotDetailed', function (req, res) {
    let data = req.body;
    if (!data.order_id) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    orderService.searchSpotDetailed(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});
/**
 * @api {post} /api/order/searchTicketReport 报表管理(车票)
 * @apiGroup report
 * @apiName searchTicketReport
 * @apiParam {Number} page 从
 * @apiParam {Number} size 到
 * @apiParam {Number} order_no 订单号
 * @apiParam {Number} ago 从
 * @apiParam {Number} end 到
 * @apiParam {Number} type 1:火车票 2：飞机票 3：汽车票 4：船票
 * @apiSuccess {String} order_no 产品ID
 * @apiSuccess {String} order_createtime 下单时间
 * @apiSuccess {String} product_name 类别
 * @apiSuccess {String} order_count 数量
 * @apiSuccess {String} order_amount 金额
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchTicketReport', function (req, res) {
    let data = req.body;
    if (!data.page || !data.size) {
        return res.send({code: 2, msg: "参数不齐"})
    }
    orderService.searchTicketReport(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/order/searchHotelReport 报表管理(酒店)
 * @apiGroup report
 * @apiName searchHotelReport
 * @apiParam {Number} page 从
 * @apiParam {Number} size 到
 * @apiParam {Number} order_no 订单号
 * @apiParam {Number} ago 从
 * @apiParam {Number} end 到
 * @apiParam {Number} type 1:酒店国内 2：酒店国际 3：酒店钟点
 * @apiSuccess {String} order_no 产品ID
 * @apiSuccess {String} order_createtime 下单时间
 * @apiSuccess {String} product_name 类别
 * @apiSuccess {String} order_count 数量
 * @apiSuccess {String} order_amount 金额
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchHotelReport', function (req, res) {
    let data = req.body;
    if (!data.page || !data.size) {
        return res.send({code: 2, msg: "参数不齐"})
    }
    orderService.searchHotelReport(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/order/searchLifeReport 报表管理(生活费用)
 * @apiGroup report
 * @apiName searchLifeReport
 * @apiParam {Number} page 从
 * @apiParam {Number} size 到
 * @apiParam {Number} order_no 订单号
 * @apiParam {Number} ago 从
 * @apiParam {Number} end 到
 * @apiParam {Number} type 1:水费 2:电费 3:燃气费 4：有线电视-暂无  5：固话 6：宽带 7：物业费-暂无
 * @apiSuccess {String} order_no 产品ID
 * @apiSuccess {String} order_createtime 下单时间
 * @apiSuccess {String} product_name 类别
 * @apiSuccess {String} order_count 数量
 * @apiSuccess {String} order_amount 金额
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchLifeReport', function (req, res) {
    let data = req.body;
    if (!data.page || !data.size) {
        return res.send({code: 2, msg: "参数不齐"})
    }
    orderService.searchLifeReport(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/order/searchCardReport 报表管理(加油卡)
 * @apiGroup report
 * @apiName searchCardReport
 * @apiParam {Number} page 从
 * @apiParam {Number} size 到
 * @apiParam {Number} order_no 订单号
 * @apiParam {Number} ago 从
 * @apiParam {Number} end 到
 * @apiParam {Number} type 1:中国石油 2：中石化油卡充值
 * @apiSuccess {String} order_no 产品ID
 * @apiSuccess {String} order_createtime 下单时间
 * @apiSuccess {String} product_name 类别
 * @apiSuccess {String} order_count 数量
 * @apiSuccess {String} order_amount 金额
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchCardReport', function (req, res) {
    let data = req.body;
    if (!data.page || !data.size) {
        return res.send({code: 2, msg: "参数不齐"})
    }
    orderService.searchCardReport(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});

/**
 * 添加补差价订单
 * */
/**
 * @api {post} /api/order/addCompensationPrice 添加补差价订单
 * @apiGroup order
 * @apiName addCompensationPrice
 * @apiParam {String} token
 * @apiParam {Number} order_amount 订单总额
 * @apiParam {Number} order_price 订单单价
 * @apiParam {Number} order_count 购买数量
 * @apiParam {Number} user_phone 补差价用户电话
 * @apiSuccess {String} 1 添加成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/addCompensationPrice', function (req, res) {
    let data = req.body;
    if (!data.order_amount || !data.order_price || !data.user_phone || !data.order_count) {
        return res.send({code: 2, msg: "参数不齐"})
    }
    orderService.addCompensationPrice(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});

/**
 * 查询订单操作日志记录
 * */
/**
 * @api {post} /api/order/getOrderRecord 查询订单操作日志记录
 * @apiGroup order
 * @apiName getOrderRecord
 * @apiParam {String} token
 * @apiParam {String} order_id 订单id
 * @apiSuccess {String} order_record_type 操作类型（1创建订单， 2用户支付，3用户退款，4供应商出单成功， 5用户取消， 6供应商出单失败）
 * @apiSuccess {String} order_record_fail 失败原因
 * @apiSuccess {String} order_record_createtime 操作时间
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/getOrderRecord', function (req, res) {
    let data = req.body;
    if (!data.order_id) {
        return res.send({code: 2, msg: "参数不齐"})
    }
    orderService.getOrderRecord(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});

module.exports = router;