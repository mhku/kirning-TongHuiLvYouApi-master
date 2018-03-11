const uuid = require('../../utils/uuid');
const serviceMethod = require('../../utils/serviceCommon');
const reward_userDao = require('../../houtai/dao/reward_userDao');
let tokenService = require('../../service/tokenService');
let rewardDao = require('../../houtai/dao/rewardDao');
let math = require('../util/eg');
let userDao = require('../dao/userDao');
let service =
    {

        /**
         * 中奖用户列表
         * @param data
         * @return
         */
        searchReward_user: (data) => {
            return new Promise((resolve, reject) => {
                if (data.search_type == 2) {
                    return tokenService.queryUserIdByToken(data).then((result) => {
                        data.user_id = result.user_id;
                        return serviceMethod.searchMethod(reward_userDao, "searchReward_user", data).then((result2) => {
                            return serviceMethod.searchMethod(reward_userDao, "searchReward_user", data).then((result3) => {
                                let count = result3.length;
                                result2.data.count = count;
                                resolve(result2);
                            }, err => {
                                reject(err);
                            })
                        }, err => {
                            reject(err);
                        })
                    }, err => {
                        reject(err);
                    }).catch((err) => {
                        reject(err);
                    })
                }
                return serviceMethod.searchMethod(reward_userDao, "searchReward_user", data).then((result) => {
                    data.counts = 1;
                    return serviceMethod.searchMethod(reward_userDao, "searchReward_user", data).then((result2) => {
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
         * 添加中奖纪录
         * 门票/旅游产品需要人工处理
         * @param data
         * @return {*}
         */
        addReward_user: (data) => {
            return new Promise((resolve, reject) => {
                data.reward_user_id = uuid.createUUID();
                if (data.reward_type == 5 || data.reward_type == 7) {
                    data.reward_user_state = 0;//未处理
                } else {
                    data.reward_user_state = 1;//已处理
                }
                return serviceMethod.addMethod(reward_userDao, "addReward_user", data).then((result) => {
                    resolve(result);
                }, err => {
                    reject(err);
                })
            })
        },

        /**
         * 处理用户中奖记录
         * @param data
         * @return {*}
         */
        handleReward: (data) => {
            return serviceMethod.updateMethod(reward_userDao, "handleReward", data);
        },
        /**
         * 用户抽奖
         * @param data
         * @return {*}
         */
        addReward: (data) => {
            return new Promise((resolve, reject) => {
                //验证token
                return tokenService.queryUserIdByToken(data).then((result) => {
                    let type_name;//奖品类型
                    data.user_id = result.user_id;
                    return userDao.searchUserDetailed(data).then((user)=>{
                        //查询用户抽奖次数
                        return serviceMethod.searchMethod(reward_userDao, "searchLuck_draw", data).then((result2) => {
                            if (result2.data[0].luck_draw_count == 0 || result2.data[0].luck_draw_count < 0) {
                                return Promise.reject({code: 2, msg: "抽奖次数已用完"});
                            }
                            data.count = result2.data[0].luck_draw_count;//用户抽奖次数
                            //生成0-100随机数
                            //  data.math = Math.floor(100 * Math.random());
                            data.math = Math.floor(100 * Math.random());
                            if(math >= 51 && math <= 55){
                                data.math = Math.floor(100 * Math.random());
                            }
                            data.type = 3;
                            data.reward_isuse = 0;//是否使用
                            return serviceMethod.searchMethod(rewardDao, "searchReward", data).then((result3) => {
                                data.reward_user_state = 1;
                                let tn = result3.data[0].reward_type;
                                if (tn == 1) {
                                    type_name = `元红包`;
                                    data.reward_user_state = 0;
                                }
                                if (tn == 2) {
                                    type_name = `元话费`;
                                }
                                if (tn == 4) {
                                    type_name = `谢谢参与`;
                                }
                                if (tn == 5) {
                                    type_name = `旅游产品`;
                                    data.reward_user_state = 0;
                                }
                                if (tn == 6) {
                                    type_name = `M流量`;
                                }
                                if (tn == 7) {
                                    type_name = `门票`;
                                    data.reward_user_state = 0;
                                }
                                if (tn == 10) {
                                    type_name = `元油卡`;
                                }
                                var number = ``;
                                // //判断该奖品是否有下级
                                if (tn == 1 || tn == 2 || tn == 6) {
                                    //生成随机数查询奖品下的值
                                    data.type = 4;
                                    data.math = Math.floor(100 * Math.random());
                                    data.reward_id = result3.data[0].reward_id;
                                    return serviceMethod.searchMethod(rewardDao, "searchReward", data).then((result4) => {
                                        //添加抽奖结果
                                        number = result4.data[0].reward_record;
                                        data.reward_user_id = uuid.createUUID();
                                        data.reward_type = result3.data[0].reward_type;
                                        data.reward_explain = number + type_name;
                                        data.reward_number = number;
                                        data.reward_user_name = user[0].user_name;
                                        return serviceMethod.addMethod(reward_userDao, "addReward_user", data).then(() => {
                                            //减轻用户的抽奖数量
                                            return serviceMethod.updateMethod(reward_userDao, "upLuck_draw", data).then(() => {
                                                let code = {code: 1, msg: "操作成功"};
                                                let jp = data.reward_type;
                                                let detailed = data.reward_explain;
                                                let number = data.reward_number;
                                                let values = {jp, detailed, number};
                                                let results = code;
                                                results.data = values;
                                                return resolve(results);
                                            }, err => {
                                                reject(err);
                                            })
                                        }, err => {
                                            reject(err);
                                        })
                                    }, err => {
                                        reject(err);
                                    })
                                }
                                if (tn == 4) {
                                    data.reward_isuse = 1;
                                }
                                data.reward_user_id = uuid.createUUID();
                                data.reward_type = result3.data[0].reward_type;
                                data.reward_id = result3.data[0].reward_id;
                                data.reward_number = number;
                                data.reward_explain = number + type_name;
                                data.reward_user_name = user[0].user_name;
                                //添加抽奖结果
                                return serviceMethod.addMethod(reward_userDao, "addReward_user", data).then(() => {
                                    //减轻用户的抽奖数量
                                    return serviceMethod.updateMethod(reward_userDao, "upLuck_draw", data).then(() => {
                                        let code = {code: 1, msg: "操作成功"};
                                        let jp = data.reward_type;
                                        let detailed = data.reward_explain;
                                        let number = data.reward_number;
                                        let values = {jp, detailed, number};
                                        let results = code;
                                        results.data = values;
                                        return resolve(results);
                                    }, err => {
                                        reject(err);
                                    })
                                }, err => {
                                    reject(err);
                                })
                            })
                        })
                    }).catch((err) => {
                        reject(err);
                    })
                })
            })
        }
    };
module.exports = service;