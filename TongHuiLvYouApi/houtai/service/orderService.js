const orderDao = require('../../houtai/dao/orderDao');
const uuid = require('../../utils/uuid');
const serviceMethod = require('../../utils/serviceCommon');
const orderNo=require('../../utils/orderNo');
const orderDao2=require('../../dao/orderDao');
const userServer=require('./userService');
let service =
    {
        /**
         * 订单列表
         * @param data
         * @return {*}
         */
        searchOrder: (data) => {
            return new Promise((resolve, reject) => {
                return serviceMethod.searchMethod(orderDao, "searchOrder", data).then((result) => {
                    data.counts = 1;
                    result.data.forEach((item)=>{
                        item.order_amount = parseFloat(item.order_amount/100);
                        item.order_price = parseFloat(item.order_price / 100);
                        item.order_service_price = parseFloat(item.order_service_price / 100);
                        item.order_discount = parseFloat(item.order_discount / 100);
                        item.order_safe_price = parseFloat(item.order_safe_price / 100);
                        item.order_airportTax = parseFloat(item.order_airportTax / 100);
                        item.order_fuelTax = parseFloat(item.order_fuelTax / 100);
                    });
                    return serviceMethod.searchMethod(orderDao, "searchOrder", data).then((result2) => {
                        result.count = result2.data.length;
                        resolve(result);
                    }, err => {
                        reject(err);
                    })
                }, err => {
                    reject(err);
                })
            });
        },
        /**
         * 修改订单状态
         * @param data
         * @return {*}
         */
        updateOrderstate: (data) => {
            return orderDao.updateOrderstate(data);
        },
        /**
         * 订单详细
         * @param data
         * @returns {*}
         */
        searchOrderDetailed: (data) => {
            return new Promise((resolve, reject) => {
                return serviceMethod.searchMethod(orderDao, "selectUser", data).then((result) => {
                    return orderDao.selectOrder(data).then((result2) => {
                        if (result2.length > 0) {
                            result2.forEach((item)=>{
                                item.order_amount = parseFloat(item.order_amount / 100);
                                item.order_price = parseFloat(item.order_price / 100);
                                item.order_service_price = parseFloat(item.order_service_price / 100);
                                item.order_discount = parseFloat(item.order_discount / 100);
                                item.order_safe_price = parseFloat(item.order_safe_price / 100);
                                item.order_airportTax = parseFloat(item.order_airportTax / 100);
                                item.order_fuelTax = parseFloat(item.order_fuelTax / 100);
                            });
                            let results;
                            let state = {code: 1, msg: "查询成功"};
                            results = state;
                            results.data = result.data;
                            results.data[0].tourist = result2;
                            resolve(results);
                        }
                    }).catch((error) => {
                        reject(error);
                    })
                }, err => {
                    reject(err);
                })
            });
        },

        /**
         * 充值中心列表
         *@param data
         *@return {*}
         */
        searchCharge: (data) => {
            return new Promise((resolve, reject) => {
                return serviceMethod.searchMethod(orderDao, "searchCharge", data).then((result) => {
                    result.data.forEach((item)=>{
                        item.order_amount = parseFloat(item.order_amount/100);
                        item.order_price = parseFloat(item.order_price / 100);
                        item.order_service_price = parseFloat(item.order_service_price / 100);
                        item.order_discount = parseFloat(item.order_discount / 100);
                        item.order_safe_price = parseFloat(item.order_safe_price / 100);
                        item.order_airportTax = parseFloat(item.order_airportTax / 100);
                        item.order_fuelTax = parseFloat(item.order_fuelTax / 100);
                    });
                    data.counts = 1;
                    return serviceMethod.searchMethod(orderDao, "searchCharge", data).then((result2) => {
                        let count = result2.data.length;
                        result.count = count;
                        resolve(result);
                    }, err => {
                        reject(err);
                    })
                }, err => {
                    reject(err);
                })
            })
        },

        /**
         * 加油卡充值列表
         * @param data
         * @returns {*}
         */
        searchCard: (data) => {
            return new Promise((resolve, reject) => {
                return serviceMethod.searchMethod(orderDao, "searchCard", data).then((result) => {
                    data.counts = 1;
                    result.data.forEach((item)=>{
                        item.order_amount = parseFloat(item.order_amount/100);
                        item.order_price = parseFloat(item.order_price / 100);
                        item.order_service_price = parseFloat(item.order_service_price / 100);
                        item.order_discount = parseFloat(item.order_discount / 100);
                        item.order_safe_price = parseFloat(item.order_safe_price / 100);
                        item.order_airportTax = parseFloat(item.order_airportTax / 100);
                        item.order_fuelTax = parseFloat(item.order_fuelTax / 100);
                    });
                    return serviceMethod.searchMethod(orderDao, "searchCard", data).then((result2) => {
                        result.count = result2.data.length;
                        resolve(result);
                    }, err => {
                        reject(err);
                    })
                }, err => {
                    reject(err);
                })
            })
        },
        /**
         * 生活费用列表
         * @param data
         * @returns {*}
         */
        searchLife: (data) => {
            return new Promise((resolve, reject) => {
                return serviceMethod.searchMethod(orderDao, "searchLife", data).then((result) => {
                    result.data.forEach((item)=>{
                        item.order_amount = parseFloat(item.order_amount/100);
                        item.order_price = parseFloat(item.order_price / 100);
                        item.order_service_price = parseFloat(item.order_service_price / 100);
                        item.order_discount = parseFloat(item.order_discount / 100);
                        item.order_safe_price = parseFloat(item.order_safe_price / 100);
                        item.order_airportTax = parseFloat(item.order_airportTax / 100);
                        item.order_fuelTax = parseFloat(item.order_fuelTax / 100);
                    });
                    data.counts = 1;
                    return serviceMethod.searchMethod(orderDao, "searchLife", data).then((result2) => {
                        result.count = result2.data.length;
                        resolve(result);
                    }, err => {
                        reject(err);
                    })
                }, err => {
                    reject(err);
                })
            })
        },
        /**
         * 酒店列表
         * @param data
         * @return {*}
         */
        searchHotel: (data) => {
            return new Promise((resolve, reject) => {
                return serviceMethod.searchMethod(orderDao, "searchHotel", data).then((result) => {
                    result.data.forEach((item)=>{
                        item.order_amount = parseFloat(item.order_amount/100);
                        item.order_price = parseFloat(item.order_price / 100);
                        item.order_service_price = parseFloat(item.order_service_price / 100);
                        item.order_discount = parseFloat(item.order_discount / 100);
                        item.order_safe_price = parseFloat(item.order_safe_price / 100);
                        item.order_airportTax = parseFloat(item.order_airportTax / 100);
                        item.order_fuelTax = parseFloat(item.order_fuelTax / 100);
                    });
                    data.counts = 1;
                    return serviceMethod.searchMethod(orderDao, "searchHotel", data).then((result2) => {
                        result.count = result2.data.length;
                        resolve(result);
                    }, err => {
                        reject(err);
                    })
                }, err => {
                    reject(err);
                })
            })
        },

        /**
         * 酒店详细
         * @param data
         * @return {*}
         */
        searchHotelDetailed: (data) => {
            return new Promise((resolve, reject) => {
                let results;//订单主信息
                let users;//用户信息
                return serviceMethod.searchMethod(orderDao, "selectUser", data).then((result3) => {
                    users = result3;
                    return serviceMethod.searchMethod(orderDao, "searchHotelDetailed", data).then((result) => {
                        results = result;
                        results.data[0].order_amount = parseFloat(results.data[0].order_amount / 100);
                        results.data[0].order_price = parseFloat(results.data[0].order_price / 100);
                        results.data[0].order_service_price = parseFloat(results.data[0].order_service_price / 100);
                        results.data[0].order_discount = parseFloat(results.data[0].order_discount / 100);
                        results.data[0].order_safe_price = parseFloat(results.data[0].order_safe_price / 100);
                        results.data[0].order_airportTax = parseFloat(results.data[0].order_airportTax / 100);
                        results.data[0].order_fuelTax = parseFloat(results.data[0].order_fuelTax / 100);
                        //获取游客信息
                        return orderDao.searchOrderTourist(data);
                    }).then((result2) => {
                        if (result2) {
                            results.data[0].tourist = result2;
                            results.data[0].user = users.data;
                            resolve(results);
                        }
                        resolve(results);
                    }).catch((error) => {
                        reject(error);
                    })
                }, err => {
                    reject(err);
                })
            })
        },

        /**
         * 查询景点列表
         * @param data
         * @return {*}
         */
        searchSpot: (data) => {
            return new Promise((resolve, reject) => {
                return serviceMethod.searchMethod(orderDao, "searchSpot", data).then((result) => {
                    data.counts = 1;
                    result.data.forEach((item)=>{
                        item.order_amount = parseFloat(item.order_amount/100);
                        item.order_price = parseFloat(item.order_price / 100);
                        item.order_service_price = parseFloat(item.order_service_price / 100);
                        item.order_discount = parseFloat(item.order_discount / 100);
                        item.order_safe_price = parseFloat(item.order_safe_price / 100);
                        item.order_airportTax = parseFloat(item.order_airportTax / 100);
                        item.order_fuelTax = parseFloat(item.order_fuelTax / 100);
                    });
                    return serviceMethod.searchMethod(orderDao, "searchSpot", data).then((result2) => {
                        result.count = result2.data.length;
                        resolve(result);
                    }, err => {
                        reject(err);
                    })
                }, err => {
                    reject(err);
                })
            })
        },
        /**
         * 查询景点详细
         * @param data
         * @return {*}
         */
        searchSpotDetailed: (data) => {
            return new Promise((resolve,reject)=>{
                return serviceMethod.searchMethod(orderDao, "searchSpotDetailed", data).then((results)=>{
                    results.data[0].order_amount = parseFloat(results.data[0].order_amount / 100);
                    results.data[0].order_price = parseFloat(results.data[0].order_price / 100);
                    results.data[0].order_service_price = parseFloat(results.data[0].order_service_price / 100);
                    results.data[0].order_discount = parseFloat(results.data[0].order_discount / 100);
                    results.data[0].order_safe_price = parseFloat(results.data[0].order_safe_price / 100);
                    results.data[0].order_airportTax = parseFloat(results.data[0].order_airportTax / 100);
                    results.data[0].order_fuelTax = parseFloat(results.data[0].order_fuelTax / 100);
                    resolve(results)
                }).catch((e)=>{
                    reject(e)
                });
            });
        },

        /**
         * 报表管理(票)
         * @param data
         * @returns {*}
         */
        searchTicketReport: (data) => {
            return new Promise((resolve, reject) => {
                return serviceMethod.searchMethod(orderDao, "searchTicketReport", data).then((result) => {
                    data.counts = 1;
                    return serviceMethod.searchMethod(orderDao, "searchTicketReport", data).then((result2) => {
                        result.count = result2.data.length;
                        resolve(result);
                    }, err => {
                        reject(err);
                    })
                }, err => {
                    reject(err);
                })
            })
        },

        /**
         * 报表管理(酒店)
         * @param data
         * @return {*}
         */
        searchHotelReport: (data) => {
            return new Promise((resolve, reject) => {
                return serviceMethod.searchMethod(orderDao, "searchHotelReport", data).then((result) => {
                    data.counts = 1;
                    return serviceMethod.searchMethod(orderDao, "searchHotelReport", data).then((result2) => {
                        result.count = result2.data.length;
                        resolve(result);
                    }, err => {
                        reject(err);
                    })
                }, err => {
                    reject(err);
                })
            })
        },
        /**
         * 报表管理(生活费用)
         *@param data
         * @return {*}
         */
        searchLifeReport: (data) => {
            return new Promise((resolve, reject) => {
                return serviceMethod.searchMethod(orderDao, "searchLifeReport", data).then((result) => {
                    data.counts = 1;
                    return serviceMethod.searchMethod(orderDao, "searchLifeReport", data).then((result2) => {
                        result.count = result2.data.length;
                        resolve(result);
                    }, err => {
                        reject(err);
                    })
                }, err => {
                    reject(err);
                })
            })
        },
        /**
         * 报表管理(加油卡)
         *@param data
         * @return {*}
         */
        searchCardReport: (data) => {
            return new Promise((resolve, reject) => {
                return serviceMethod.searchMethod(orderDao, "searchCardReport", data).then((result) => {
                    data.counts = 1;
                    return serviceMethod.searchMethod(orderDao, "searchCardReport", data).then((result2) => {
                        result.count = result2.data.length;
                        resolve(result);
                    }, err => {
                        reject(err);
                    })
                }, err => {
                    reject(err);
                })
            })
        },
        /**
         * 添加补差价
         * */
        addCompensationPrice:(data)=>{
            return new Promise((resolve,reject)=>{
                userServer.searchUseridByPhone(data).then((resluts)=>{
                    data.order_creator=data.user_id;
                    data.order_state=1;
                    data.order_id=uuid.createUUID();
                    data.order_no=orderNo.createOrderNo();
                    data.product_id=25;
                    data.order_title='补差价';
                    data.user_id=resluts.data[0].user_id;
                    return serviceMethod.addMethod(orderDao2,'addOrder',[data]).then((result)=>{
                        resolve(result);
                    },(err)=>{
                        reject(err);
                    })
                })

            })
        },
        /**
         * 测试消费抽奖
         * */
        ceshi:(data)=>{
            return new Promise((resole,reject)=>{
                return serviceMethod.searchMethod(orderDao,'ceshi',data).then((result)=>{
                    resole(result)
                },err=>{
                    reject(err);
                })
            })
        },

        /**
         * 查询订单操作日志记录
         * @param data
         * @return {*}
         */
        getOrderRecord: (data) => {
            return new Promise((resolve, reject) => {
                return serviceMethod.searchMethod(orderDao, "getOrderRecord", data).then((result)=>{
                    resolve(result)
                },err=>{
                    reject(err);
                });
            });
        },
    };

module.exports = service;










