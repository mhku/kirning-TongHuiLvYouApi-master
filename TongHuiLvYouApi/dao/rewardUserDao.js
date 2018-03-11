const daoMethod = require('../utils/daoCommon');

const dao = {
    /**
     * 按下单价格判断添加抽奖记录数量
     * @param data
     * @returns {*}
     */
    getRewardUserDao: (data) => {
        let sql = `select * from reward_user where reward_user_id = $reward_user_id`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 把使用状态改为1
     * @param reward_user_id
     * @returns {*}
     */
    updateRewardUserState: (data) => {
        let sql = `update reward_user set reward_isuse = $reward_isuse `;
        if (data.reward_order_no) {
            sql += ` ,reward_order_no = $reward_order_no `;
        }
        sql += ` where reward_user_id = $reward_user_id`
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 通过第三方订单号获取用户中奖纪录
     * @param data
     * @returns {*}
     */
    findRewardUserByOrderNo: (data)=>{
        let sql = `select r.reward_user_id from reward_user as r where r.reward_order_no = $reward_order_no`;
        return daoMethod.oneMethod(sql, data);
    }
};

module.exports = dao;