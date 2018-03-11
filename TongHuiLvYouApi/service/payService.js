const moment = require('moment');
const alipayUtil = require('../utils/pay/alipayUtil');
const hotelService = require('./hotelService');
const scenicService = require('./scenicService');
const payrecordService = require('./payrecordService');
const trainService = require('./trainService');
const rechargeService = require('./rechargeService');
const filghrService = require('./filghrService');
const luck_drawService = require('./luck_drawService');
const orderDao = require('../dao/orderDao');
const order_recordDao = require('../dao/order_recordDao');

const service = {

    /**
     * 支付成功操作
     * @param order_no 订单号
     * @param order_pay 支付方式
     * @param data 其它参数
     * @returns {Promise}
     */
    paySuccess: (order_no, order_pay, data) => {
        return new Promise((resolve, reject) => {
            let order = {}, product_id = '';
            require('./orderService').findOrderByNoOfPay({order_no}).then((res) => {
                order = res.data[0];
                if (order.order_state != '1') return Promise.reject("已付款");
                product_id = order.product_id;
                //付款参数
                const params = {
                    order_target_id: order.order_target_id,     //第三方订单号
                    order_amount: order.order_amount,     //支付金额
                    order_no: order.order_no,     //平台订单号
                };
                if (product_id === "2") {
                    //飞机票支付
                    return require('./filghrService').autoPayment(params);
                } else if (product_id === "1") {
                    //火车票支付
                    return trainService.trainpay(params);
                } else if (product_id === "5") {
                    //话费充值支付
                    return rechargeService.phoneRecharge(order);
                } else if (product_id === "6") {
                    //流量充值接口
                    return rechargeService.flowRecharge(order);
                } else if (product_id === "7" || product_id === "22") {
                    //Q币，游戏充值
                    return rechargeService.gameRecharge(order);
                } else if (product_id === "14" || product_id === "15") {
                    //固话，宽带充值
                    return rechargeService.telephoneRecharge(order);
                } else if (product_id === "8") {
                    //中国石油
                    return rechargeService.fuelCardRecharge(order);
                } else if (product_id === "9") {
                    //中国石化
                    return rechargeService.SINOPECRecahrge(order);
                } else if (product_id === "10" || product_id === "11" || product_id === "12") {
                    //水电煤支付
                    return rechargeService.recharge(order);
                } else if (product_id === "23") {
                    //交罚违章支付
                    return rechargeService.orderTrafficFines(order);
                } else if (product_id === "17" || product_id === "18" || product_id === "19") {
                    // 酒店支付
                    return hotelService.hotelordervmpay(params);
                } else if (product_id === "20" || product_id === "21") {
                    //景点支付
                    return scenicService.orderPayment(params);
                } else if (product_id === "25") {
                    //补差价
                    return Promise.resolve(1);
                }
            }).then((res) => {
                const payInfo = {
                    order_pay: order_pay,
                    order_payTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                    order_id: order.order_id,
                    order_state: 5
                };
                const recharge = ["5", "6", "7", "22", "14", "15", "8", "9", "10", "11", "12", "23", "20", "21", "1", "2", "17", "18", "19"],
                    scenic = ["20", "21"];
                if (recharge.indexOf(product_id) !== -1) {
                    payInfo.order_state = 7;
                }

                //修改订单为支付成功
                return require('./orderService').orderPay(payInfo);
            }).then((res) => {
                // require('./orderService').autoConfirmation();
                let params = {
                    order_amount: order.order_amount,
                    user_id: order.order_creator,
                };
                order_recordDao.addRecord({order_record_type: '2', order_id: order.order_id});
                return luck_drawService.addLuckDrawCount(params);
            }).then((res) => {
                resolve(res);
            }).catch(err => {
                service.refundMethod(order);
                reject(err);
            });
        });
    },

    /**
     * 退款
     * @param data
     * @param data.user_id 用户ID
     * @param data.order_id 订单ID
     * @returns {Promise}
     */
    refund: (data) => {
        return new Promise((resolve, reject) => {
            let order = {};
            orderDao.findOrderById(data).then((res) => {
                    if (res.length > 0) {
                        order = res[0];
                        if (order.order_state == "5" || order.order_state == "7") {
                            const product_id = order.product_id;
                            //付款参数
                            const params = {
                                order_target_id: order.order_target_id,     //第三方订单号
                                order_amount: order.order_amount,     //支付金额
                                order_no: order.order_no,     //平台订单号
                                order_reason: order.order_reason || "",     //订单退款原因
                                order_remark: order.order_remark || "",     //订单备注
                            };
                            if (product_id === "2") {
                                // order.order_refund_amount = order.order_amount;
                                //飞机退款
                                return require('./filghrService').orderRefund(params);
                            } else if (product_id === "1") {
                                order.order_refund_amount = order.order_amount;
                                return trainService.trainrefund(params);
                                //火车票退款
                                // return new Promise((t_resolve, t_reject) => {
                                //     trainService.trainrefund(params).then((result) => {
                                //         // const now = moment();
                                //         // const depTime = moment(order.order_departure_datetime);
                                //         // let order_amount = order.order_amount;
                                //         // if (depTime.subtract(24, "hour").isBefore(now)) {//24小时内
                                //         //     order_amount = order_amount - ((order_amount * 20) / 100);
                                //         // } else if (depTime.subtract(48, "hour").isBefore(now)) {//48小时内
                                //         //     order_amount = order_amount - ((order_amount * 10) / 100);
                                //         // } else if (depTime.subtract(15, "day").isBefore(now)) {//15天内
                                //         //     order_amount = order_amount - ((order_amount * 5) / 100);
                                //         // }
                                //         t_resolve(order_amount);
                                //     }).catch((err) => {
                                //         t_reject(err);
                                //     });
                                // });
                            } else if (product_id === "17" || product_id === "18" || product_id === "19") {
                                // 酒店退款
                            } else if (product_id === "20" || product_id === "21") {
                                const order_payTime = moment(order.order_payTime || new Date()).add(48, 'hour');
                                order.order_refund_amount = order.order_amount;
                                if (order_payTime.isBefore(new Date())) {
                                    //景点退款
                                    return scenicService.orderCancel(params);
                                } else {
                                    return Promise.reject({code: 2, msg: "景点门票订单付款超过48小时后,无法再进行退款操作！"});
                                }
                            }
                        } else if (order.order_state == "4") {
                            return Promise.reject({code: 2, msg: "该订单已退款"});
                        } else {
                            return Promise.reject({code: 2, msg: "该订单暂不支持退款"});
                        }
                    } else {
                        return Promise.reject({code: 2, msg: "订单不存在"});
                    }
                }
            ).then((res) => {
                if (order.product_id == "2") {
                    return Promise.resolve("退款中");
                } else {
                    order_recordDao.addRecord({order_record_type: '3', order_id: order.order_id});
                    return service.refundMethod(order);
                }
            }).then((res) => {
                resolve({code: 1, msg: "退款成功"});
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 退款方式
     * @param order
     * @returns {*}
     */
    refundMethod: (order) => {
        return new Promise((resolve, reject) => {
            const refund = {
                order_no: order.order_no,
                order_amount: parseInt(order.order_refund_amount) / 100,
                order_reason: order.order_reason || "正常退款",
            };
            let func = "";
            //支付方式
            if (order.order_pay === '1') {
                func = alipayUtil.refund(refund);
            } else if (order.order_pay === '2') {
                func = Promise.reject({code: 2, msg: "微信支付暂未开通"});
            } else if (order.order_pay === '3') {
                func = Promise.reject({code: 2, msg: "余额支付暂无退款"});
            } else {
                func = Promise.reject({code: 2, msg: "未知支付"});
            }
            func.then((res) => {
                const param = {
                    order_no: order.order_no,
                    order_state: '4',
                    order_refund_amount: refund.order_amount,
                    order_reason: order.order_reason
                };
                return require('./orderService').updateOrderStateByNo(param);
            }).then((res) => {
                resolve({code: 1, msg: "退款成功"});
            }).catch((err) => {
                reject(err);
            });
        });
    }
};
module.exports = service;