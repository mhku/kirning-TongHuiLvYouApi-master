let daoMethod = require("../../utils/daoCommon");


let dao =
    {
        /**
         * 添加抽奖说明
         * @param data
         * @return
         */
        addReward_explain: (data) => {
            let sql = ` insert into reward_explain values ($reward_explain_text) `;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 添加抽奖说明
         * @param data
         * @return
         */
        upReward_explain: (data) => {
            let sql = ` update  reward_explain set reward_explain_text=$reward_explain_text `;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 查询抽奖说明记录
         * @return
         */
        searchReward_explain: () => {
            let sql = ` select * from reward_explain `;
            return daoMethod.oneMethod(sql);
        }

    };
module.exports = dao;