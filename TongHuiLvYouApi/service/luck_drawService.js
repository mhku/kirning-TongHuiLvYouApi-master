const uuid = require('../utils/uuid');
const serviceMethod = require('../utils/serviceCommon');
const luck_drawDao = require('../dao/luck_drawDao');
const userDao = require('../dao/userDao');
const tokenDao = require('../dao/tokenDao');
const service = {

    /**
     * 添加抽奖记录
     * @param data
     * @returns {*}
     */
    addLuckDraw: (data) => {
        return new Promise((resolve, reject) => {
            luck_drawDao.findUserLuckDraw(data).then((res) => {
                if (res.length > 0) {
                    return {code: 1};
                } else {
                    data.luck_draw_id = uuid.createUUID();
                    return serviceMethod.addMethod(luck_drawDao, "addLuckDraw", data);
                }
            }).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 添加所有抽奖记录数量
     * @param data
     * @returns {*}
     */
    addAllLuckDrawCount: () => {
        return luck_drawDao.addAllLuckDrawCount().then((res)=>{
            // 清除所有用户抽奖金额阶段
           return luck_drawDao.deleteAllUserStage();
        });
    },

    /**
     * 清除所有用户抽奖金额阶段
     * @param data
     * @returns {*}
     */
    deleteAllUserStage: () => {
        return serviceMethod.addMethod(luck_drawDao, "deleteAllUserStage", {});
    },

    /**
     * 清除所有抽奖记录数量
     * @param data
     * @returns {*}
     */
    deleteAllLuckDrawCount: () => {
        return new Promise((resolve, reject) => {
            luck_drawDao.deleteAllLuckDrawCount().then((res) => {
                resolve({code: 1, msg: "清除成功"})
            }).catch((err) => {
                reject({code: 0, msg: err.message})
            });
        })
    },


    /**
     * 按下单价格判断添加抽奖记录数量
     * @param data
     * @returns {*}
     */
    addLuckDrawCount: (data) => {
        return new Promise((resolve, reject) => {
                data.order_amount = parseInt(data.order_amount);
                serviceMethod.searchMethod(userDao, 'seachUserAmountStage', data).then((result) => {
                    let user_amount = result.data[0].user_amount;
                    let user_stage = result.data[0].user_stage;
                    luck_drawDao.findUserLuckDraw(data).then((result) => {
                        let count = result[0].luck_draw_count;
                        let getCount = result[0].luck_draw_get_count;
                        data.count= result[0].luck_draw_count;
                        let msg='';
                        if (getCount >= 7 || count >= 7) {
                            resolve({code: 1, msg: "今日抽奖次数已达上限"})
                        } else {
                            if(user_stage == 0) {
                                if (data.order_amount + user_amount <= 50000) {
                                    count += 1;
                                    getCount +=1;
                                    msg = "获得一次抽奖机会";
                                    data.count = count;
                                    data.getCount = getCount;
                                    data.user_amount = 0;
                                    data.user_stage = 1;
                                } else if (data.order_amount + user_amount <= 150000 && data.order_amount + user_amount > 50000) {
                                    if(getCount + 2 > 7){
                                        count += 1;
                                        getCount +=1;
                                        msg = "获得一次抽奖机会";
                                    } else {
                                        count += 2;
                                        getCount +=2;
                                        msg = "获得两次次抽奖机会";
                                    }
                                    data.count = count;
                                    data.getCount = getCount;
                                    data.user_amount = 0;
                                    data.user_stage = 2;
                                } else if (data.order_amount + user_amount >= 150000) {
                                    if(getCount + 1 == 7){
                                        count += 1;
                                        getCount += 1;
                                        msg = "获得一次抽奖机会";
                                    } else if(getCount + 2 == 7){
                                        count += 2;
                                        getCount +=2;
                                        msg = "获得两次次抽奖机会";
                                    } else {
                                        count += 3;
                                        getCount += 3;
                                        msg = "获得三次抽奖机会";
                                    }
                                    data.count = count;
                                    data.getCount = getCount;
                                    data.user_amount = 0;
                                    data.user_stage = 0;
                                }
                            } else if(user_stage == 1){
                                if (data.order_amount + user_amount <= 50000) {
                                    msg = "消费金额小于500,没有抽奖机会";
                                    data.count = count;
                                    data.getCount = getCount;
                                    data.user_amount = data.order_amount + user_amount;
                                    data.user_stage = 1;
                                } else if (data.order_amount + user_amount <= 150000 && data.order_amount + user_amount > 50000) {
                                    if(getCount + 2 > 7){
                                        count += 1;
                                        getCount +=1;
                                        msg = "获得一次抽奖机会";
                                    } else {
                                        count += 2;
                                        getCount +=2;
                                        msg = "获得两次次抽奖机会";
                                    }
                                    data.count = count;
                                    data.getCount = getCount;
                                    data.user_amount = 0;
                                    data.user_stage = 2;
                                } else if (data.order_amount + user_amount >= 150000) {
                                    if(getCount + 1 == 7){
                                        count += 1;
                                        getCount += 1;
                                        msg = "获得一次抽奖机会";
                                    } else if(getCount + 2 == 7){
                                        count += 2;
                                        getCount +=2;
                                        msg = "获得两次次抽奖机会";
                                    } else {
                                        count += 3;
                                        getCount += 3;
                                        msg = "获得三次抽奖机会";
                                    }
                                    data.count = count;
                                    data.getCount = getCount;
                                    data.user_amount = 0;
                                    data.user_stage = 0;
                                }
                            } else if(user_stage == 2){
                                if (data.order_amount + user_amount <= 150000) {
                                    msg = "消费金额小于1500,没有抽奖机会";
                                    data.count = count;
                                    data.getCount = getCount;
                                    data.user_amount = data.order_amount + user_amount;
                                    data.user_stage = 2;
                                } else if (data.order_amount + user_amount >= 150000) {
                                    if(getCount + 1 == 7){
                                        count += 1;
                                        getCount += 1;
                                        msg = "获得一次抽奖机会";
                                    } else if(getCount + 2 == 7){
                                        count += 2;
                                        getCount +=2;
                                        msg = "获得两次次抽奖机会";
                                    } else {
                                        count += 3;
                                        getCount += 3;
                                        msg = "获得三次抽奖机会";
                                    }
                                    data.count = count;
                                    data.getCount = getCount;
                                    data.user_amount = 0;
                                    data.user_stage = 0;
                                }

                            }



                            /*if (user_stage == 0) {
                                if (user_amount == 0) {
                                    if (data.order_amount <= 500) {
                                        count += 1;
                                        msg="获得一次抽奖机会";
                                        data.count = count;
                                        data.user_amount = data.order_amount;
                                        data.user_stage = 1;
                                    } else if (data.order_amount <= 1000 && data.order_amount > 500) {
                                        count += 2;
                                        msg="获得两次次抽奖机会";
                                        data.count = count;
                                        data.user_amount = 0;
                                        data.user_stage = 2;
                                    } else if (data.order_amount >= 1500) {
                                        count += 3;
                                        msg="获得三次抽奖机会";
                                        data.count = count;
                                        data.user_amount = 0;
                                        data.user_stage = 0;
                                    } else {
                                        count += 2;
                                        msg="获得两次次抽奖机会";
                                        data.count = count;
                                        data.user_amount = data.order_amount;
                                        data.user_stage = 2;
                                    }
                                } else {
                                    if (data.order_amount + user_amount < 500) {
                                        count += 1;
                                        msg="获得一次抽奖机会";
                                        data.count = count;
                                        data.user_amount = data.order_amount + user_amount;
                                        data.user_stage = 1;
                                    } else if ((data.order_amount + user_amount) < 1000 && (data.order_amount + user_amount) > 500) {
                                        count += 2;
                                        msg="获得两次抽奖机会";
                                        data.count = count;
                                        data.user_amount = 0;
                                        data.user_stage = 2;
                                    } else if ((data.order_amount + user_amount) > 1500) {
                                        count += 3;
                                        msg="获得三次抽奖机会";
                                        data.count = count;
                                        data.user_amount = 0;
                                        data.user_stage = 0;
                                    } else {
                                        count += 2;
                                        msg="获得两次抽奖机会";
                                        data.count = count;
                                        data.user_amount = data.order_amount + user_amount;
                                        data.user_stage = 2;
                                    }
                                }
                            } else if (user_stage == 1) {
                                if (user_amount == 0) {
                                    if (data.order_amount < 1000 && data.order_amount >= 500) {
                                        count += 1;
                                        msg="获得一次抽奖机会";
                                        data.count = count;
                                        data.user_amount = 0;
                                        data.user_stage = 2;
                                    } else if (data.order_amount >= 1000 && data.order_amount < 1500) {
                                        count += 1;
                                        msg="获得一次抽奖机会";
                                        data.count = count;
                                        data.user_amount = data.order_amount;
                                        data.user_stage = 2;
                                    } else if (data.order_amount > 1500) {
                                        count += 2;
                                        msg="获得两次抽奖机会";
                                        data.count = count;
                                        data.user_amount = 0;
                                        data.user_stage = 0;
                                    } else {
                                        msg="消费金额不足500,,没有抽奖机会";
                                        data.user_amount = data.order_amount;
                                        data.user_stage = 1;
                                    }
                                } else {
                                    if ((data.order_amount + user_amount) < 1000 && (data.order_amount + user_amount) >= 500) {
                                        count += 1;
                                        msg="获得一次抽奖机会";
                                        data.count = count;
                                        data.user_amount = 0;
                                        data.user_stage = 2;
                                    } else if ((data.order_amount + user_amount) >= 1000 && (data.order_amount + user_amount) < 1500) {
                                        count += 1;
                                        msg="获得一次抽奖机会";
                                        data.count = count;
                                        data.user_amount = data.order_amount + user_amount;
                                        data.user_stage = 2;
                                    } else if ((data.order_amount + user_amount) > 1500) {
                                        count += 2;
                                        msg="获得两次抽奖机会";
                                        data.count = count;
                                        data.user_amount = 0;
                                        data.user_stage = 0;
                                    } else {
                                        msg="消费金额不足500,,没有抽奖机会";
                                        data.user_amount = data.order_amount + user_amount;
                                        data.user_stage = 1;
                                    }
                                }
                            } else if (user_stage == 2) {
                                if (user_amount == 0) {
                                    if (data.order_amount >= 1500) {
                                        count += 1;
                                        msg="获得一次抽奖机会";
                                        data.count = count;
                                        data.user_amount = 0;
                                        data.user_stage = 0;
                                    } else {
                                        msg="消费金额小于1500,没有抽奖机会";
                                        data.user_amount = data.order_amount;
                                        data.user_stage = 2;
                                    }
                                } else {
                                    if ((data.order_amount + user_amount) >= 1500) {
                                        count += 1;
                                        msg="获得一次抽奖机会";
                                        data.count = count;
                                        data.user_amount = 0;
                                        data.user_stage = 0;
                                    } else {
                                        msg="消费金额小于1500,没有抽奖机会";
                                        data.user_amount = data.order_amount + user_amount;
                                        data.user_stage = 2;
                                    }
                                }
                            }*/
                            serviceMethod.updateMethod(userDao, 'updateUserAmountStage', data).then(() => {
                                serviceMethod.addMethod(luck_drawDao,'addLuckDrawCount',data).then((res) => {
                                    resolve({
                                        code: 1,
                                        msg: msg,
                                        data: {user_amount: data.user_amount, user_stage: data.user_stage, count: data.count}
                                    })
                                }).catch((err) => {
                                    reject({code: 3, msg: err.message});
                                });
                            });

                        }

                    });
                });
        });
    },

    /**
     * 查找用户的抽奖记录数量
     * @param data
     * @returns {*|Promise}
     */
    findUserLuckDraw: (data) => {
        return serviceMethod.searchMethod(luck_drawDao, "findUserLuckDraw", data);
    },

};

module.exports = service;