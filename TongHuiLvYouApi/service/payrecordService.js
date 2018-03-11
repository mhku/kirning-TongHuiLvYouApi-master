const moment = require('moment');
const schedule = require('node-schedule');
const serviceMethod = require('../utils/serviceCommon');
const uuid = require('../utils/uuid');
const autoConfigure = require('../utils/autoConfigure');
const orderService = require('./orderService');
const payrecordDao = require('../dao/payrecordDao');
const orderDao = require('../dao/orderDao');

const service = {
    /**
     * 支付回调结果处理
     * @param order_no
     * @param pay_type
     * @param totalFee
     */
    payCallBack: (order_no, pay_type, totalFee) => {
        return new Promise((resolve, reject) => {
            let payrecord = {};
            payrecordDao.findPayrecord({order_no}).then((res) => {
                payrecord = res[0];
                if (payrecord.payrecord_status === '1') {
                    // 当pay_status 等于 1 的时候证明该订单已经成功，就不需要再次修改了
                    return reject("该订单已经交易成功");
                }
                const payrecordData = {
                    order_no: order_no,
                    payrecord_status: '1'
                };
                return payrecordDao.updatePayrecord(payrecordData);
            }).then((res) => {
                return orderDao.payOrder({order_no, pay_type, order_state: '2'});
            }).then((res) => {
                //确认订单时间
                const cTime = autoConfigure.orderConfirmationTime;
                let date = moment(payrecord.order_departure_datetime).add(cTime.size, cTime.unit).toDate();
                //定时自动确定订单
                schedule.scheduleJob(date, () => {
                    orderDao.autoUpdateOrderState({
                        order_state: '3',
                        before_state: '2',
                        order_id: payrecord.order_id
                    }).then((result) => {
                        const fTime = autoConfigure.orderFinishTime;
                        let fDate = moment().add(fTime.size, fTime.unit).toDate();
                        //定时自动完成订单
                        schedule.scheduleJob(fDate, () => {
                            orderDao.autoUpdateOrderState({
                                order_state: '5',
                                before_state: '3',
                                order_id: payrecord.order_id
                            }).catch((error)=>{
                                console.log(error);
                            })
                        });
                    }).catch((error)=>{
                        console.log(error);
                    });
                });
                return resolve('成功')
            }).catch(err => {
                console.error(err);
                return reject("找不到订单");
            })
        });
    },

    /**
     * 添加支付记录
     * @param data
     * @returns {*}
     */
    addPayrecord: (data) => {
        data.payrecord_id = uuid.createUUID();
        return serviceMethod.addMethod(payrecordDao, "addPayrecord", data);
    },
};
module.exports = service;