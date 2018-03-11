/**
 * Created by Administrator on 2017/8/28.
 */
const md5 = require('blueimp-md5');
const moment = require('moment');
const urlencode = require('urlencode');
const soapUtil = require('../utils/soapUtil');
const schedule = require('node-schedule');
const api = require('../utils/api').flighr;
const reqUrl = require('../utils/config').url;
const config = require('../utils/config').filghr;
const payUtil = require('../utils/payConfig');
const orderNo = require('../utils/orderNo');
const uuid = require('../utils/uuid');
const serviceMethod = require('../utils/serviceCommon');
const aircraftService = require('./aircraftService');
const touristService = require('./touristService');
const tokenService = require('./tokenService');
const payService = require('./payService');
const order_recordService = require('./order_recordService');
const filghrDao = require('../dao/filghrDao');

const service = {

    /**
     * 航班列表查询
     */
    flights: (data) => {
        return new Promise((resolve, reject) => {
            let value = {};
            const data1 = {
                agencyCode: config.agencyCode,
                onlyAvailableSeat: '0',
                onlyNormalCommision: '1',
                onlyOnWorkingCommision: '0',
                onlySelfPNR: '0',
                orgAirportCode: data.orgAirportCode,
                dstAirportCode: data.dstAirportCode,
                date: data.date
            }
            //md5加密密匙
            let sign = data1.agencyCode + data1.dstAirportCode + data1.onlyAvailableSeat + data1.onlyNormalCommision +
                data1.onlyOnWorkingCommision + data1.onlySelfPNR + data1.orgAirportCode + config.safetyCode;
            data1.sign = md5(sign);
            //调用第三方查询航班
            soapUtil.request(api.getAvailableFlightWithPriceAndCommision, data1, "getAvailableFlightWithPriceAndCommision").then(val => {
                //解析封装返回字段
                return serviceMethod.returnCode(val, 'flightItems');
            }).then(val => {
                value = val;
                value.data = val.data[0];
                //查询机场名称
                return Promise.all(value.data.flights.map((flight) => {
                    let param = {
                        depCode: flight.orgCity,
                        arrCode: flight.dstCity
                    };
                    return aircraftService.findAirportInfo(param);
                }));
            }).then(val1 => {
                for (let i = 0; i < value.data.flights.length; i++) {
                    value.data.flights[i].orgAirport = val1[i].depAirport_name;
                    value.data.flights[i].dstAirport = val1[i].arrAirport_name;
                    let flight = value.data.flights[i];
                    //其他费用低价
                    let tprice = parseFloat(flight.airportTax) + parseFloat(flight.fuelTax);
                    let seatPrice = tprice + parseFloat(flight.seatItems[0].settlePrice);
                    //计算最低价
                    for (let j = 0; j < flight.seatItems.length; j++) {
                        let seat = flight.seatItems[j];
                        if (seat.settlePrice < seatPrice) {
                            seatPrice = parseFloat(seat.settlePrice);
                        }
                    }
                    value.data.flights[i].price = tprice + seatPrice;
                }
                return resolve(value);
            }).catch(error => {
                return reject(error);
            });
        });
    },

    /**
     * 查找航班
     * @param data
     * @returns {Promise}
     */
    findFlighrs: (data) => {
        return new Promise((resolve, reject) => {
            service.flights(data).then(val => {
                const value = {
                    orgCity: val.orgCity,
                    dstCity: val.dstCity,
                    distance: val.distance,
                    flights: []
                };
                //循环包装
                for (let i = 0; i < val.data.flights.length; i++) {
                    let flight = val.data.flights[i];
                    const data1 = {
                        flightNo: flight.flightNo,
                        link: flight.link,
                        orgCity: flight.orgCity,
                        dstCity: flight.dstCity,
                        depTime: flight.depTime,
                        depModifyTime: flight.depModifyTime,
                        planeType: flight.planeType,
                        stopnum: flight.stopnum,
                        isElectronicTicket: flight.isElectronicTicket,
                        arrTime: flight.arriTime,
                        orgJetquay: flight.orgJetquay,
                        dstJetquay: flight.dstJetquay,
                        airportTax: flight.airportTax,
                        fuelTax: flight.fuelTax,
                        meal: flight.meal,
                        orgAirport: flight.orgAirport,
                        dstAirport: flight.dstAirport,
                        price: flight.price
                    };
                    value.flights.push(data1);
                }
                val.data = value;
                return resolve(val);
            }).catch(error => {
                return reject(error);
            });
        });
    },

    /**
     * 根据航班号查询航班信息
     * @param data
     */
    findFlighrByFlightNo: (data) => {
        return new Promise((resolve, reject) => {
            service.flights(data).then(val => {
                for (let i = 0; i < val.data.flights.length; i++) {
                    let flight = val.data.flights[i];
                    if (flight.flightNo = data.flightNo) {
                        val.data = flight;
                        resolve(val);
                        return;
                    }
                }
            }).catch(error => {
                return reject(error);
            });
        });
    },

    getPolicy: (data) => {
        return new Promise((resolve, reject) => {
            // depAirportCode: data.depAirportCode,
            // arrAirportCode: data.arrAirportCode,
            const data1 = {
                agencyCode: config.agencyCode,
                needSpeRulePolicy: 1,
                needSpePricePolicy: 1,
                pageNo: 1,
                rowPerPage: 1000
            };
            let signStr = data1.agencyCode + data1.needSpePricePolicy + data1.needSpeRulePolicy + data1.pageNo +
                data1.rowPerPage + config.safetyCode;
            data1.sign = md5(signStr);
            soapUtil.request(api.syncPolicy, data1, 'syncPolicy').then(val => {
                return serviceMethod.returnCode(val, 'policyDataList');
            }).then(val => {
                resolve(val);
            }, err => {
                reject(err);
            }).catch(console.log.bind(console));
        });
    },

    /**
     * 通过乘客信息生成PNR和订单
     * @param data
     * @returns {Promise}
     */
    createPlaneOrder: (data) => {
        return new Promise((resolve, reject) => {
            let order = {}, order_id = uuid.createUUID(), tourists = [], data1 = {
                agencyCode: config.agencyCode,
                policyId: data.policyId,
                linkMan: data.linkMan,
                linkPhone: data.linkPhone,
                notifiedUrl: reqUrl + '/api/flighr/flightTicket',
                paymentReturnUrl: payUtil.return_url,
                outOrderNo: orderNo.createOrderNo(),
                pnrInfo: {
                    segments: [],
                    passengers: [],
                    parPrice: data.parPrice,
                    fuelTax: data.fuelTax,
                    airportTax: data.airportTax
                }
            };
            //航班信息
            let flighrs = data.flighrs;
            //乘客信息
            tourists = data.tourists;
            //航班
            flighrs.map(flighr => {
                data1.pnrInfo.segments.push({
                    flightNo: flighr.flightNo,
                    depCode: flighr.depCode,
                    arrCode: flighr.arrCode,
                    seatClass: flighr.seatClass,
                    depDate: flighr.depDate,
                    arrTime: flighr.arrTime,
                    depTime: flighr.depTime,
                    planeModel: flighr.planeModel
                });
            });
            // tokenService.queryUserIdByToken(data).
            //循环查找游客信息
            Promise.all(tourists.map(tourist => {
                tourist.user_id = data.user_id;
                return touristService.findTouristById({tourist_id: tourist.tourist_id, user_id: data.user_id});
            })).then(val => {
                val.map(val1 => {
                    const tourist = val1.data[0];
                    data1.pnrInfo.passengers.push({
                        name: tourist.tourist_name,
                        type: tourist.tourist_crowd_type,
                        identityType: tourist.tourist_identityType,
                        identityNo: tourist.tourist_identityNo,
                        birthday: tourist.tourist_birthday
                    });
                });
                let sign = data1.agencyCode + data1.policyId + config.safetyCode;
                data1.sign = md5(sign);

                if (data.otherLinkMethod) data1.otherLinkMethod = data.otherLinkMethod;
                //调用创建订单接口
                return soapUtil.request(api.createOrderByPassenger, data1, 'createOrderByPassenger').then(val => {
                    //封装返回结果
                    return serviceMethod.returnCode(val, 'order');
                });
            }).then(val => {
                order = val.data;
                const flight = flighrs[0];
                return aircraftService.findAirportInfo({depCode: flight.depCode, arrCode: flight.arrCode});
            }).then(val => {
                const flight = flighrs[0];
                //计算总价
                let fuelTax = parseInt(parseFloat(data1.pnrInfo.fuelTax) * 100),
                    airportTax = parseInt(parseFloat(data1.pnrInfo.airportTax) * 100),
                    parPrice = parseInt(parseFloat(data1.pnrInfo.parPrice) * 100),
                    order_money = parPrice + fuelTax + airportTax;
                let depTime = moment(flight.depDate + flight.depTime, "YYYY-MM-DDHH:mm"),
                    arrTime = moment(flight.depDate + flight.arrTime, "YYYY-MM-DDHH:mm"),
                    m = arrTime.diff(depTime, 'minutes'), h = parseInt(m / 60), m2 = m - (h * 60),
                    use_time = `${h}:${m2}`;
                order_count = data.tourists.length;
                if (arrTime.isBefore(depTime)) arrTime = arrTime.add(1, 'd');
                let data2 = {
                    order_id: order_id,
                    order_no: orderNo.createOrderNo(),
                    order_target_id: order.liantuoOrderNo,
                    product_id: '2',
                    order_amount: order_money * order_count,
                    order_price: order_money,
                    order_telephone: data.linkPhone,
                    order_origin: val.depCity_name,
                    order_destination: val.arrCity_name,
                    order_other_origin: (val.depAirport_name) + flight.orgJetquay,
                    order_other_destination: (val.arrAirport_name) + flight.dstJetquay,
                    order_departure_datetime: depTime.format("YYYY-MM-DD HH:mm:ss"),
                    order_end_time: arrTime.format("YYYY-MM-DD HH:mm:ss"),
                    order_safe_state: '0',
                    order_safe_price: 0,
                    order_count: order_count,
                    order_title: (val.depCity_name + (val.depAirport_name) + flight.orgJetquay) + ' - ' + (val.arrCity_name + (val.arrAirport_name) + flight.dstJetquay),
                    order_number: flight.flightNo,
                    order_tickettype: flight.seatClass,
                    order_seat_no: flight.seatClass,
                    order_trip_rule: flight.trip_rule || 0,
                    order_company_name: '',
                    order_otherInfo: JSON.stringify({}),
                    order_user: data.order_user,
                    order_use_time: use_time,
                    user_id: data.user_id,
                    tourists: tourists,
                    order_airportTax: airportTax,
                    order_fuelTax: fuelTax,
                };
                //添加订单
                return require('./orderService').addOrder([data2]);
            }).then(val => {
                let params = {
                    user_id: data.user_id,
                    order_id
                };
                require('./orderService').autoCancelOrder(params, () => {
                    service.cancelOrder(params);
                });
                resolve(val);
            }).catch(err => {
                reject(err);
            });
        });
    },

    /**
     * 取消航班订单
     * @param data
     */
    // cancelPlaneOrder: (data) => {
    //     return new Promise((resolve, reject) => {
    //         let filghr_order = {};
    //         filghrDao.findFilghrOrder(data).then(val => {
    //             filghr_order = val.data[0];
    //             const data1 = {
    //                 agencyCode: config.agencyCode,
    //                 orderNo: filghr_order.orderNo,
    //                 cancelPNR: '1',
    //                 sign: '',
    //             };
    //             data1.sign = md5(data1.agencyCode + data1.cancelPNR + data1.orderNo + config.safetyCode);
    //             soapUtil.request(api.cancelPlaneOrder, data1, 'cancelOrder');
    //         }, err => {
    //             reject(err);
    //         }).then(val => {
    //             return serviceMethod.returnCode(val, 'orderStatus');
    //         }).then(val => {
    //             const data1 = {
    //                 order_id: filghr_order.order_id,
    //                 order_state: '7'
    //             };
    //             return require('./orderService').updateOrderState(data1);
    //         }, err => {
    //             reject(err);
    //         }).then(val => {
    //             resolve(val);
    //         }, err => {
    //             reject(err);
    //         }).catch(console.log.bind(console));
    //     });
    // },

    /**
     * 出票通知
     * @param data
     * @returns {Promise}
     */
    flightTicket: (data) => {
        return new Promise((resolve, reject) => {
            const data1 = {
                order_no: data.sequenceNo
            };
            require('./orderService').findOrderByNoOfPay(data1).then((res) => {
                const order = res.data[0];
                if (data.type == 0) {
                    order.order_reason = data.reason;
                    order.order_refund_amount = order.order_amount / 100;
                    return payService.refundMethod(order);
                } else if (data.type == 1) {
                    order.order_state = '5';
                    return require('./orderService').updateOrderStateByNo(order);
                } else if (data.type == 2) {
                    order.order_reason = "出票失败";
                    order.order_refund_amount = order.order_amount / 100;
                    return payService.refundMethod(order);
                }
                return Promise.resolve("");
            }).then(val => {
                resolve("S");
            }).catch((err) => {
                console.log(err);
                resolve("S");
            });
        });
    },

    /**
     * 退票结果
     * @param data
     */
    refundNotifiedUrl: (data) => {
        return new Promise((resolve, reject) => {
            const data1 = {
                order_no: data.sequenceNo
            };
            require('./orderService').findOrderByNoOfPay(data1).then((res) => {
                const order = res.data[0];
                if (res.type == '1') {
                    order.order_refund_amount = res.venderPayPrice;
                    return payService.refundMethod(order);
                } else {
                    const param = {
                        order_no: order.order_no,
                        order_state: '8',
                        order_refund_amount: order.order_refund_amount
                    };
                    return require('./orderService').updateOrderStateByNo(param);
                }
            }).then((res) => {
                resolve("S");
            }).catch((err) => {
                console.log(err);
                resolve("S");
            });
        });
    },

    /**
     * 根据航空公司、舱位获取退改签规定
     * @param data
     * @returns {Promise}
     */
    getModifyAndRefundStipulate: (data) => {
        return new Promise((resolve, reject) => {
            let data1 = {
                agencyCode: config.agencyCode,
                airlineCode: data.airlineCode,
                classCode: data.classCode,
                depCode: data.depCode,
                arrCode: data.arrCode,
                depDate: data.depDate
            };
            data1.sign = md5(data1.agencyCode + data1.airlineCode + data1.arrCode + data1.classCode + data1.depCode + data1.depDate + config.safetyCode);
            soapUtil.request(api.getModifyAndRefundStipulate, data1, 'getModifyAndRefundStipulate').then(val => {
                return serviceMethod.returnCode(val, "modifyAndRefundStipulateList");
            }).then(val => {
                val.data.changeStipulate = urlencode.decode(val.data.changeStipulate);
                val.data.modifyStipulate = urlencode.decode(val.data.modifyStipulate);
                val.data.refundStipulate = urlencode.decode(val.data.refundStipulate);
                resolve(val);
            }, err => {
                reject(err);
            });
        });
    },

    /**
     * 实时获取每日最低价
     * @param data
     * @returns {*|Promise.<TResult>}
     */
    getDailyLowestPrice: (data) => {
        return new Promise((resolve, reject) => {
            if (!data.arrCode) data.arrCode = '';
            let data1 = {
                agencyCode: config.agencyCode,
                startDate: data.startDate,
                endDate: data.endDate,
                arrCode: data.arrCode,
                deptCode: data.deptCode,
            }, info = [];
            data1.sign = md5(data1.agencyCode + data1.arrCode + data1.deptCode + data1.endDate + data1.startDate + config.safetyCode);
            soapUtil.request(api.getDailyLowestPrice, data1, 'getDailyLowestPrice').then(val => {
                return serviceMethod.returnCode(val, "lowestPriceList");
            }).then(val => {
                info = val.data.sort((a, b) => {
                    return a.ticketPrice - b.ticketPrice
                });
                info.splice(20, info.length - 20);
                return Promise.all(info.map((item) => {
                    //查询起止机场信息
                    return aircraftService.findAirportInfo({depCode: item.depAirport, arrCode: item.arrAirport});
                }));
            }).then((res) => {
                info.forEach((item, index) => {
                    item = Object.assign(item, res[index]);
                });
                resolve({code: 1, data: info, msg: "查询成功"});
            }).catch((error) => {
                reject(error);
            });
        });
    },

    /**
     * 自动支付
     * @param data
     * @returns {Promise}
     */
    autoPayment: (order) => {
        return new Promise((resolve, reject) => {
            let params = {
                agencyCode: config.agencyCode,
                orderNo: order.order_target_id,
                payType: '2',
                payerLoginName: config.loginName
            };
            let sign = params.agencyCode + params.orderNo + params.payType + params.payerLoginName + config.safetyCode;
            params.sign = md5(sign);
            //调用自动支付接口
            return soapUtil.request(api.pay, params, 'pay').then((res) => {
                //封装返回结果
                return serviceMethod.returnCode(res, 'order');
            }).then((res) => {
                res.msg = "支付成功";
                resolve(res);
            }).catch((err) => {
                reject(err);
            })

        });
    },

    /**
     * 航班订单取消
     * @param data
     * @param data.order_id 订单ID
     * @param data.user_id 用户ID
     * @returns {Promise}
     */
    cancelOrder: (order) => {
        return new Promise((resolve, reject) => {
            let params = {
                agencyCode: config.agencyCode,
                orderNo: order.order_target_id,
                canclePNR: 1
            };
            let sign = params.agencyCode + params.canclePNR + params.orderNo + config.safetyCode;
            params.sign = md5(sign);
            //调用自动支付接口
            return soapUtil.request(api.cancelOrder, params, 'cancelOrder').then((res) => {
                //封装返回结果
                return serviceMethod.returnCode(res, 'order');
            }).then((res) => {
                res.msg = "取消成功";
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 航班订单退款
     * @param data
     * @param data.order_id 订单ID
     * @param data.user_id 用户ID
     * @returns {Promise}
     */
    orderRefund: (order) => {
        return new Promise((resolve, reject) => {
            let params = {
                agencyCode: config.agencyCode,
                liantuoOrderNo: order.order_target_id,
                actionType: "9",
                refundTicketList: [],
                refundNotifiedUrl: reqUrl + "/api/flighr/refundNotifiedUrl",
                cancelPnrStatus: "1",
                sign: ""
            };
            let sign = params.actionType + params.agencyCode + config.safetyCode;
            params.sign = md5(sign);
            service.getOrderDetail(order).then((res) => {
                let filght = res.flightInfoList[0];
                res.passengerList.forEach((pass) => {
                    let obj = {
                        passengerName: pass.name,
                        ticketNo: pass.ticketNo,
                        segment: filght.depCode + '-' + filght.arrCode,
                    };
                    params.refundTicketList.push(obj);
                });
                //调用自动支付接口
                return soapUtil.request(api.applyPolicyOrderRefund, params, 'applyPolicyOrderRefund');
            }).then((res) => {
                //封装返回结果
                return serviceMethod.returnCode(res, 'order');
            }).then((res) => {
                res.msg = "退款中";
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    getOrderDetail: (data) => {
        return new Promise((resolve, reject) => {
            const param = {
                agencyCode: config.agencyCode,
                orderNo: data.order_target_id,
                sign: ''
            };
            param.sign = md5(param.agencyCode + param.orderNo + config.safetyCode);
            soapUtil.request(api.getOrderByOrderNo, param, "getOrderByOrderNo").then(val => {
                //解析封装返回字段
                return serviceMethod.returnCode(val, 'policyOrder');
            }).then(val => {
                let result = {
                    status: val.data.status,
                    liantuoOrderNo: val.data.liantuoOrderNo,
                    passengerList: val.data.passengerList,
                    flightInfoList: val.data.flightInfoList
                };
                resolve(result);
            }).catch(error => {
                return reject(error);
            });
        });
    },

    timingUpdateState: () => {
        console.log("开启飞机票票定时查单任务");
        const auto = schedule.scheduleJob('*/5 * * * *', () => {
            require('./orderService').searchOrderByState({product_id: '2', order_state: '7'}).then((res) => {
                const orders = res.data;
                return Promise.all(orders.map((order) => {
                    return service.getOrderDetail(order);
                }));
            }).then((res) => {
                res.forEach((result) => {
                    const status = result.status,
                        param = {product_id: '2', order_target_id: result.liantuoOrderNo};
                    return require('./orderService').findOrderByTarget(param).then((rs) => {
                        const order = rs.data[0];
                        if (status == "TICKET_SUCCESS") {
                            param.order_state = '5';
                            let order_tickeNo = [];
                            result.flightInfoList.forEach((fi) => {
                                order_tickeNo.push(fi.ticketNo);
                            });
                            param.order_tickeNo = order_tickeNo.join(',');
                            order_recordService.addRecord({
                                order_record_type: '4',
                                order_id: order.order_id
                            });
                            return require('./orderService').updateOrderStateByTargetNo(param);
                        } else if (status == "REFUSED_BY_SUPPLY" || status == "NO_SEAT") {
                            order_recordService.addRecord({
                                order_record_type: '6',
                                order_id: order.order_id,
                                order_record_fail: "出票失败"
                            });
                            return require('./payService').refundMethod(order);
                        }
                    });
                })
            }).catch((err) => {
                console.log(err)
            });
        });
    },
};

module.exports = service;