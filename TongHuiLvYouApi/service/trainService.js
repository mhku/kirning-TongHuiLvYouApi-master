/**
 * Created by Administrator on 2017/8/28.
 */
const moment = require('moment');
const schedule = require('node-schedule');
const serviceMethod = require('../utils/serviceCommon');
const request = require('../utils/request');
const api = require('../utils/api').train;
const config = require('../utils/config');
const uuid = require('../utils/uuid');
const orderNo = require('../utils/orderNo');
const tokenService = require('./tokenService');
const touristService = require('./touristService');
const order_recordService = require('./order_recordService');
const trainDao = require('../dao/trainDao');

const service = {

    /**
     * 统一请求
     * @param api
     * @param data
     * @param successMsg
     * @returns {Promise}
     */
    post: (api, data, successMsg) => {
        return new Promise((resolve, reject) => {
            console.log(data);
            //发情POST请求
            request.post(api, data, 'GB2312').then(res => {
                res = JSON.parse(res);
                if (res.code == 0) {
                    resolve({
                        code: 1,
                        data: res,
                        msg: successMsg
                    });
                } else {
                    reject({
                        code: 2,
                        msg: res.message
                    });
                }
            }).catch(error => {
                reject(error);
            });
        });
    },

    /**
     * 查找火车票
     * @param data
     * @returns {Promise}
     */
    findTraintickets: (data) => {
        //公司账号ID
        data.retailId = config.retailId;//config.agencyCode;
        //格式
        data = 'data=' + JSON.stringify(data);
        return service.post(api.gettrainSearch, data, "查询成功");
    },

    /**
     * 票价查询
     * @param data
     * @returns {Promise}
     */
    trainsearchPrice: (data) => {
        //公司账号ID
        data.retailId = config.retailId;//config.agencyCode;
        //格式
        data = 'data=' + JSON.stringify(data);
        return service.post(api.trainsearchPrice, data, "查询成功");
    },

    /**
     * 车票下单
     * @param data
     */
    trainCreate: (data) => {
        return new Promise((resolve, reject) => {
            // 请求数据
            //车次信息
            let flightdata = data.flightdata,
                cabindata = data.cabindata,
                traindata = data.traindata ? `&traindata=${JSON.stringify(data.traindata)}` : "",
                psgdata = [],
                retailid = config.retailId, //config.agencyCode;
                linkmobile = data.linkmobile,
                //开始时间
                end_time = moment(flightdata.startDate + flightdata.startTime + ":00", "YYYYMMDDHH:mm:ss"),
                start_time = end_time.format("YYYY-MM-DD HH:mm:ss"),
                lastTime = flightdata.lastTime.split(':');
            end_time = end_time.add('m', lastTime[1]).add('h', lastTime[0]).format("YYYY-MM-DD HH:mm:ss");
            //结束时间
            //订单
            let order = {
                order_id: uuid.createUUID(),
                order_no: orderNo.createOrderNo(),
                order_target_id: '1',
                product_id: '1',
                order_amount: parseInt(parseFloat(cabindata.price) * data.tourist_id.length * 100),
                order_price: parseInt(parseFloat(cabindata.price) * 100),
                order_telephone: linkmobile,
                order_origin: flightdata.fromStation.name,
                order_destination: flightdata.toStation.name,
                order_title: flightdata.fromStation.name + ' - ' + flightdata.toStation.name + ' ' + flightdata.trainNo + ' ' + data.cabindata.name,
                order_departure_datetime: start_time,
                order_end_time: end_time,
                order_safe_state: '0',
                order_safe_price: 0,
                order_count: data.tourist_id.length,
                order_number: flightdata.trainNo,
                order_tickettype: cabindata.name,
                order_seat_no: '',
                order_company_name: '',
                order_trip_rule: '0',
                user_id: data.user_id,
                order_user: data.order_user,
                order_use_time: flightdata.lastTime,
                tourists: []
            };
            //查询乘客信息
            Promise.all(data.tourist_id.map((tourist_id) => {
                return touristService.findTouristById({tourist_id, user_id: data.user_id});
            })).then((res) => {
                //乘客信息
                res.forEach((tourist) => {
                    let value = tourist.data[0];
                    let psg = {
                        "psgname": value.tourist_name,
                        "psgtype": value.tourist_identityType,
                        "psgni": value.tourist_identityNo,
                        "birthday": value.tourist_birthday,
                    };
                    order.tourists.push({tourist_id: value.tourist_id});
                    psgdata.push(psg);
                });
                let dataStr = 'flightdata=' + JSON.stringify(flightdata) + '&cabindata=' + JSON.stringify(cabindata) + '&psgdata=' +
                    JSON.stringify(psgdata) + traindata + '&retailid=' + retailid + '&linkmobile=' + linkmobile;
                return service.post(api.trainCreate, dataStr, "订单创建成功");
            }).then((res) => {
                order.order_target_id = res.data.orderId;
                return require('./orderService').addOrder([order])
            }).then((res) => {
                res.msg = "订单创建成功";
                return resolve(res);
            }).catch((error) => {
                return reject(error);
            });
        });
    },

    /**
     * 车票支付
     * @param data
     * @param data.order_target_id 火车票订单号
     * @returns {Promise}
     */
    trainpay: (data) => {
        return new Promise((resolve, reject) => {
            let params = {
                orderId: data.order_target_id,
                retailId: config.retailId
            };
            //调起支付
            request.post(api.trainpay, "Data=" + JSON.stringify(params), "GB2312").then((res) => {
                res = JSON.parse(res);
                if (res.paystatus) {
                    resolve({code: 1, msg: "支付成功"});
                } else {
                    reject({code: 2, msg: res.errorMsg});
                }
            }).catch((err) => {
                console.log(err.message);
                reject({code: 3, msg: err.message});
            });
        })
    },

    timingUpdateState: () => {
        console.log("开启火车票定时查单任务");
        const auto = schedule.scheduleJob('*/5 * * * *', () => {
            require('./orderService').searchOrderByState({product_id: '1', order_state: '7'}).then((res) => {
                const orders = res.data;
                return Promise.all(orders.map((order) => {
                    return service.trainOrderInfo(order);
                }));
            }).then((res) => {
                res.forEach((result) => {
                    const state = result.data.orderStatus,
                        param = {product_id: '1', order_target_id: result.data.orderId};
                    return require('./orderService').findOrderByTarget(param).then((rs) => {
                        const order = rs.data[0];
                        switch (state) {
                            case "出票失败":
                                order_recordService.addRecord({
                                    order_record_type: '6',
                                    order_id: order.order_id,
                                    order_record_fail: "出票失败"
                                });
                                return require('./payService').refundMethod(order);
                                break;
                            case "已出票":
                                param.order_state = '5';
                                order_recordService.addRecord({
                                    order_record_type: '4',
                                    order_id: order.order_id
                                });
                                return require('./orderService').updateOrderStateByTargetNo(param);
                                break;
                        }
                    });
                })
            }).catch((err) => {
                console.log(err)
            });
        });
    },

    /**
     * 订单状态查询
     * @param data
     * @param data.order_target_id 火车票订单号
     * @returns {Promise}
     */
    trainOrderInfo: (data) => {
        return new Promise((resolve, reject) => {
            let params = {
                orderId: data.order_target_id,
                retailId: config.retailId
            };
            //调起支付
            request.post(api.trainOrderInfo, params, "GB2312").then((res) => {
                res = JSON.parse(res);
                if (res.status) {
                    resolve({code: 1, data: res.orderInfoDetail, msg: "支付成功"});
                } else {
                    reject({code: 2, msg: res.errorMsg});
                }
            }).catch((err) => {
                reject({code: 3, msg: err.message});
            });
        })
    },

    /**
     * 车票退订
     * @param data
     */
    trainrefund: (order) => {
        return new Promise((resolve, reject) => {
            const info = {
                refundNo: order.order_no,
                orderId: order.order_target_id,
                retailId: config.retailId,
                refundReason: order.order_reason || "",
                refundRemark: order.order_remark || "",
                passengerList: [],
            };
            // 查询用户订单下的乘客
            return service.trainOrderInfo(order).then((res) => {
                const psgList = res.data.psgList;
                psgList.forEach((psg) => {
                    info.passengerList.push({
                        psgName: psg.psgName,
                        seatNo: psg.seatNo
                    });
                });
                let dataStr = "param=" + JSON.stringify(info);
                //发情POST请求
                return request.post(api.trainrefund, dataStr, 'GB2312');
            }).then((res) => {
                res = JSON.parse(res);
                if (res.status) {
                    resolve({code: 1, msg: "退款成功"});
                } else {
                    reject({code: 2, msg: res.errorMsg});
                }
            }).catch((error) => {
                reject(error);
            })
        })
    },

    /**
     * 根据首字母查询火车站信息
     * @param data
     */
    searchTrainCodeByInitial: (data) => {
        return serviceMethod.searchMethod(trainDao, "searchTrainCodeByInitial", data);
    },

    /**
     * 根据首城市名查询火车站信息
     * @param data
     */
    searchTrainCodeByName: (data) => {
        return serviceMethod.searchMethod(trainDao, "searchTrainCodeByName", data);
    }

};

module.exports = service;