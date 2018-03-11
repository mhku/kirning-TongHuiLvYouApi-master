var reward_explainDao = require('../../houtai/dao/reward_explainDao');
var uuid = require('../../utils/uuid');
var serviceMethod = require('../../utils/serviceCommon');


let service =
    {
        /**
         * 添加抽奖说明
         * @param data
         * @return
         */
        addReward_explain: (data) => {
            return new Promise((resolve, reject) => {
                //查询是否存在记录
                reward_explainDao.searchReward_explain().then((result) => {
                    if (result.length > 0) {
                        //修改记录
                        return serviceMethod.updateMethod(reward_explainDao, "upReward_explain", data).then((result2) => {
                            resolve(result2);
                        }, err => {
                            reject(err);
                        })
                    }
                    return serviceMethod.addMethod(reward_explainDao, "addReward_explain", data).then((result3) => {
                        resolve(result3);
                    }, err => {
                        reject(err);
                    })
                }).catch((err) => {
                    return err;
                })
            })
        },
        /**
         * 查询抽奖说明记录
         * @return
         */
        searchReward_explain: () => {
            return serviceMethod.searchMethod(reward_explainDao, "searchReward_explain");
        }


    };
module.exports = service;





