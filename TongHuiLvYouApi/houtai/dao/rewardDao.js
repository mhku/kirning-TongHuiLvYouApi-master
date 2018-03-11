let daoMethod = require("../../utils/daoCommon");
let dao =
    {
        /**
         * 奖品列表
         * @param data
         * @return {*}
         */
        searchReward: (data) => {
            if (data.type == 1) {
                let sql = ` select * from reward where reward_targetId is null and reward_probability!=0 order by reward_ordinal asc  `;//一级奖品
                return daoMethod.oneMethod(sql, data);
            }
            if (data.type == 2) {
                let sql = ` select reward_id,reward_record,reward_probability  from reward where reward_targetId=$reward_id order by reward_ordinal asc `;//查询奖励起始值
                return daoMethod.oneMethod(sql, data);
            }
            if (data.type == 3) {
                let sql = ` select * from reward where reward_targetId is null and reward_probability!=0 and $math between reward_from and reward_reach `;//
                return daoMethod.oneMethod(sql, data);
            }
            if (data.type == 4) {
                let sql = ` select * from reward where reward_targetId=$reward_id and  $math between reward_from and reward_reach `;
                return daoMethod.oneMethod(sql, data);
            }
            if (data.type == 5) {
                let sql = ` select * from reward where reward_targetId is null  order by reward_ordinal asc  `;//一级奖品
                return daoMethod.oneMethod(sql, data);
            }
            return Promise.reject({code: 2, msg: "参数错误"});
        },
        /**
         * 更改奖品图标
         * @param data
         * @return {*}
         */
        upReward_picture: (data) => {
            let sql = ` update reward set reward_picture =$reward_picture where reward_id =$reward_id `;
            return daoMethod.oneMethod(sql, data);
        }


    };

module.exports = dao;
