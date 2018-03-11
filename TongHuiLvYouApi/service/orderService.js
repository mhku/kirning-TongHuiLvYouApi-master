/**
 * Created by Administrator on 2017/8/31.
 */
const schedule = require('node-schedule');
const moment = require('moment');
const autoConfigure = require('../utils/autoConfigure');
const serviceMethod = require('../utils/serviceCommon');
const uuid = require('../utils/uuid');
const numberUtil = require('../utils/numberUtil');
const tokenService = require('./tokenService');
const payrecordService = require('./payrecordService');
const filghrService = require('./filghrService');
const luck_drawService = require('./luck_drawService');
const orderDao = require('../dao/orderDao');
const order_recordDao = require('../dao/order_recordDao');

const service = {
    /**
     * 添加订单
     * @param data
     * @returns {Promise}
     */
    addOrder: (data) => {
        return new Promise((resolve, reject) => {
            serviceMethod.addMethod(orderDao, 'addOrder', data).then((res) => {
                let result = res;
                result.data = {
                    order_id: data[0].order_id
                };
                data.forEach((order) => {
                    order_recordDao.addRecord({order_record_type: '1', order_id: order.order_id});
                });
                resolve(result);
            }).catch((err) => {
                reject(err);
            })
        });
    },

    /**
     * 根据订单ID修改订单状态
     * @param data
     * @returns {Promise}
     */
    updateOrderStateByID: (data) => {
        return serviceMethod.updateMethod(orderDao, 'updateOrderStateByID', data);
    },

    /**
     * 修改订单状态
     * @param data
     * @returns {Promise}
     */
    updateOrderStateByNo: (data) => {
        return serviceMethod.updateMethod(orderDao, 'updateOrderStateByNo', data);
    },

    /**
     * 修改订单为已支付状态
     * @param data
     * @returns {Promise}
     */
    orderPay: (data) => {
        return serviceMethod.updateMethod(orderDao, 'orderPay', data);
    },

    /**
     * 根据订单号查询订单信息
     * @param data
     * @returns {*}
     */
    findOrderByNo: (data) => {
        return serviceMethod.searchMethod(orderDao, "findOrderByNo", data);
    },

    /**
     * 根据订单号查询订单信息(支付用)
     * @param data
     * @returns {*}
     */
    findOrderByNoOfPay: (data) => {
        return serviceMethod.searchMethod(orderDao, "findOrderByNoOfPay", data);
    },

    /**
     * 根据第三方订单查询
     * @param data
     * @returns {*}
     */
    findOrderByTarget: (data) => {
        return serviceMethod.searchMethod(orderDao, "findOrderByTarget", data);
    },

    /**
     * 查找订单
     * @param data
     * @returns {*}
     */
    findOrderById: (data) => {
        return serviceMethod.searchMethod(orderDao, 'findOrderById', data);
    },

    /**
     * 取消订单
     * @param data
     * @returns {*}
     */
    cancelOrder: (data) => {
        return new Promise((resolve, reject) => {
            let order = {};
            service.findOrderById(data).then((res) => {
                order = res.data[0], product_id = order.product_id;
                if (product_id === '2') {
                    return filghrService.cancelOrder(order);
                }
                return {code: 1};
            }).then((res) => {
                data.order_state = '6';
                order_recordDao.addRecord({order_record_type: '5', order_id: order.order_id});
                return serviceMethod.updateMethod(orderDao, 'updateOrderStateByID', data);
            }).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 查找订单下的乘客
     * @param data
     * @returns {*}
     */
    findTouristByOrder: (data) => {
        return serviceMethod.searchMethod(orderDao, 'findTouristByOrder', data);
    },

    /**
     * 查找订单下的乘客
     * @param data
     * @returns {*}
     */
    searchUserOrders: (data) => {
        const page = numberUtil.isInteger(data.page), size = numberUtil.isInteger(data.size);
        data.page = (page - 1) * size;
        data.size = size;
        //依据订单状态查询订单
        return serviceMethod.searchMethod(orderDao, 'searchUserOrders', data);
    },

    /**
     * 自动取消订单
     * @param data
     * @returns {*}
     */
    autoCancelOrder: (data, cb) => {
        let obj = autoConfigure.orderCancelTime;
        const date = moment().add(obj.size, obj.unit).toDate();
        schedule.scheduleJob(date, () => {
            data.order_state = '1';
            data.before_state = '6';
            orderDao.updateOrderStateById(data).then((res) => {
                cb();
            });
        });
    },

    /**
     * 自动确定订单
     * @param data
     * @returns {Promise}
     */
    autoConfirmation: (data, cb) => {
        let obj = autoConfigure.orderConfirmationTime;
        const date = moment().add(obj.unit, obj.size).toDate();
        schedule.scheduleJob(date, () => {
            data.order_state = '3';
            data.before_state = '2';
            orderDao.updateOrderStateById(data);
        });
    },

    /**
     * 自动完成订单
     * @param data
     * @returns {Promise}
     * @constructor
     */
    finishTime: (data) => {
        let obj = autoConfigure.orderFinishTime;
        const date = moment().add(obj.unit, obj.size).toDate();
        schedule.scheduleJob(date, () => {
            data.order_state = '5';
            data.before_state = '3';
            orderDao.updateOrderStateById(data);
        });
    },

    /**
     * 平台支付成功回调处理
     * @param data
     * @param data.order_no 订单号
     * @returns {Promise}
     */
    updateOrderByNo: (data) => {
        return new Promise((resolve, reject) => {
            //查询订单
            service.findOrderByNo(data).then((res) => {
                params.order_id = res.data[0].order_id;
                //修改状态
                orderDao.updateOrderStateById(data).then((result) => {
                    resolve("");
                });
            }).catch((err) => {
                console.log(err);
                reject(err);
            })
        });
    },

    /**
     * 根据首字母查询火车站信息
     * @param data
     */
    updateOrderStateById: (data) => {
        return orderDao.updateOrderStateByID(data);
    },

    searchOrderProduct: () => {
        return serviceMethod.searchMethod(orderDao, "searchOrderProduct", null)
    },

    orderRefund: (data) => {

    },

    searchOrderByState: (data) => {
        return serviceMethod.searchMethod(orderDao, "searchOrderByState", data);
    },

    updateOrderStateByTargetNo: (data) => {
        return serviceMethod.updateMethod(orderDao, "updateOrderStateByTargetNo", data);
    }
};

console.log(service);
module.exports = service;