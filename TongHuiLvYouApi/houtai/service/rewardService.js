const uuid = require('../../utils/uuid');
const serviceMethod = require('../../utils/serviceCommon');
const rewardDao = require('../../houtai/dao/rewardDao');

let service =
    {

        /**
         * 奖品列表
         * @param data
         * @return {*}
         */
        searchReward: (data) => {
            return new Promise((resolve, reject) => {
                //查询一级奖品列表
                if (data.type == 1) {
                    data.type = 5;
                    return serviceMethod.searchMethod(rewardDao, "searchReward", data).then((result) => {
                        resolve(result);
                    }, err => {
                        reject(err);
                    })
                }
                //二级
                if (data.type == 2) {
                    return serviceMethod.searchMethod(rewardDao, "searchReward", data).then((result2) => {
                        resolve(result2);
                    }, err => {
                        reject(err);
                    })
                }
            })
        },
        /**
         * 更改奖品图标
         * @param data
         * @return {*}
         */
        upReward_picture: (data) => {
            return serviceMethod.updateMethod(rewardDao, "upReward_picture", data);
        }

    };
module.exports = service;