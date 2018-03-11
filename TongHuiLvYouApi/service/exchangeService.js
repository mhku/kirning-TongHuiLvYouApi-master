const moment = require('moment');
const rewardUserDao = require('../dao/rewardUserDao');
const rechargeService = require('../service/rechargeService');
const serviceMethod = require('../utils/serviceCommon');
const orderNo = require('../utils/orderNo');
const reqUrl = require('../utils/config').url;
const ofReturl = reqUrl + '/api/recharge/retonline';
const shyReturl = reqUrl + '/api/recharge/shyNotifyurl';


/**
 * 字符串转JSON
 */
function strToJson(str) {
    let result = {};
    if (!str) return result;
    let params = str.split('&');
    params.forEach((item) => {
        let param = item.split('=');
        result[param[0]] = param[1];
    });
    return result;
}

const service = {

    /**
     * 兑换话费
     * @param reward_user_id
     * @param phoneNum
     * @returns {Promise.<TResult>}
     */
    exchangePhone(reward_user_id, phoneNum) {
        return new Promise((resolve, reject) => {
            let data = {}, price = 0, reward_order_no = orderNo.createOrderNo();
            rewardUserDao.getRewardUserDao({reward_user_id}).then((re) => {
                re = re[0];
                if (!re) {
                    return Promise.reject({code: 2, msg: "找不到中奖纪录"});
                }
                const type = re.reward_type;
                if (type !== "2") {
                    return Promise.reject({code: 2, msg: "这不是话费中奖纪录"});
                }
                price = re.reward_number;
                data = {
                    phoneno: phoneNum,
                    pervalue: price
                };
                // 查看手机号码是否可以充值
                return rechargeService.telcheck(data);
            }).then(val => {
                return rechargeService.telquery(data)
            }).then(() => {
                const order = {
                    order_no: reward_order_no,
                    order_telephone: phoneNum,
                    order_original_price: price,
                    other_retUrl: ofReturl
                };
                return rechargeService.phoneRecharge(order)
                return 1;
            }).then(() => {
                return serviceMethod.updateMethod(rewardUserDao, "updateRewardUserState", {
                    reward_user_id,
                    reward_order_no,
                    reward_isuse: 2
                });
            }).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            })
        });
    },

    /**
     * 兑换油卡
     * @param reward_user_id
     * @param phoneNum
     * @returns {Promise.<TResult>}
     */
    exchangeOilCard(reward_user_id, phoneNum, card_no, card_type) {
        return new Promise((resolve, reject) => {
            let price = 0, reward_order_no = orderNo.createOrderNo();
            rewardUserDao.getRewardUserDao({reward_user_id}).then((re) => {
                re = re[0];
                if (!re) {
                    return Promise.reject({code: 2, msg: "找不到中奖纪录"});
                }
                const type = re.reward_type;
                if (type !== "10") {
                    return Promise.reject({code: 2, msg: "这不是加油卡中奖纪录"});
                }
                price = re.reward_number;
                const order = {
                    order_no: reward_order_no,
                    order_original_price: price,
                    order_telephone: card_no,
                    other_retUrl: ''
                };
                if (card_type === 1) {
                    order.other_info = JSON.stringify({gasCardTel: (phoneNum || '')});
                    order.other_retUrl = ofReturl;
                    return rechargeService.fuelCardRecharge(order);
                } else {
                    order.other_retUrl = shyReturl;
                    return rechargeService.SINOPECRecahrge(order);
                }
            }).then(() => {
                return serviceMethod.updateMethod(rewardUserDao, "updateRewardUserState", {
                    reward_user_id,
                    reward_order_no,
                    reward_isuse: 2
                });
            }).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            })
        });
    },

    /**
     * 兑换流量
     * @param reward_user_id
     * @param phoneNum
     * @returns {Promise.<TResult>}
     */
    exchangeLiuLiang(reward_user_id, phoneNum) {
        return new Promise((resolve, reject) => {
            let reward = {}, reward_order_no = orderNo.createOrderNo();
            rewardUserDao.getRewardUserDao(reward_user_id).then((re) => {
                if (!re) {
                    return Promise.reject({code: 2, msg: "找不到中奖纪录"});
                }
                const type = re.reward_type;
                if (type !== "2") {
                    return Promise.reject({code: 2, msg: "这不是流量中奖纪录"});
                }
                reward = re;
                const price = re.reward_number;
                return rechargeService.mobinfo({mobilenum: phoneNum});
            }).then((res) => {
                let operators = res.data.operators, flow_supplier = '1';
                switch (operators) {
                    case '联通':
                        flow_supplier = '2';
                        break;
                    case '移动':
                        flow_supplier = '1';
                        break;
                    case '电信':
                        flow_supplier = '3';
                        break;
                }
                const param = {
                    flow_supplier: flow_supplier,
                    flow_flowValue: re.reward_record + "M",
                    flow_range: '全国',
                    flow_expiry_date: '当月有效',
                    flow_effective_date: '立即生效',
                    query_count: 1
                };
                // 查看手机号码是否可以充值
                return rechargeService.searchFlowInfo(param);
            }).then((res) => {
                const flow = res.data[0];
                const other_info = {
                    range: 2,
                    effectStartTime: 1,
                    effectTime: 1,
                    flowValue: flow.flow_flowValue,

                }, param = {
                    order_no: reward_order_no,
                    order_telephone: phoneNum,
                    order_original_price: flow.flow_perValue,
                    other_info: JSON.stringify(other_info),
                    other_retUrl: ofReturl
                };
                return rechargeService.flowRecharge(param);
            }).then(() => {
                return serviceMethod.updateMethod(rewardUserDao, "updateRewardUserState", {
                    reward_user_id,
                    reward_order_no,
                    reward_isuse: 2
                });
            }).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            })
        })
    },

    /**
     * 欧飞回调
     * @param data
     * @returns {Promise}
     */
    ofRetUrl: (data) => {
        return new Promise((resolve, reject) => {
            data = strToJson(data);
            let order = {
                reward_order_no: data.sporder_id,
            };
            rewardUserDao.findRewardUserByOrderNo(order).then((res) => {
                const reward = res[0];
                if (reward) {
                    if (data.ret_code == 1) {
                        reward.reward_isuse = 1;
                    } else {
                        reward.reward_isuse = 0;
                    }
                    return rewardUserDao.updateRewardUserState(reward);
                } else {
                    return Promise.reject("找不到记录")
                }
            }).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 赛合一回调
     * @param data
     * @returns {Promise}
     */
    shyRetUrl: (data) => {
        return new Promise((resolve, reject) => {
            let order = {
                order_no: data.ordernumber
            };
            rewardUserDao.findRewardUserByOrderNo(order).then((res) => {
                const reward = res[0];
                if (reward) {
                    if (data.status == 4) {
                        reward.reward_isuse = 1;
                    } else {
                        reward.reward_isuse = 0;
                    }
                } else {
                    return Promise.reject("找不到记录")
                }
            }).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    }
};

module.exports = service;