/**
 * Created by Administrator on 2017/8/25.
 */
const daoMethod = require('../utils/daoCommon');

const dao = {
    /**
     * 添加Token值
     * @param data
     * @returns {*}
     */
    addToken: (data) => {
        let sql = `insert into token value($token, $user_id, now(), 1)`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 修改Token值
     * @param data
     * @returns {*}
     */
    updateToken: (data) => {
        let sql = `update token set token = $token where user_id = $user_id`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查询指定用户Token值
     * @param data
     * @returns {*}
     */
    queryTokenByUser: (data) => {
        let sql = `select token from token where user_id = $user_id`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查询用户的Token值
     * @param data
     * @returns {*}
     */
    queryUserIdByToken: (data) => {
        let sql = `select user_id from token where token = $token`;
        return daoMethod.oneMethod(sql, data);
    }
};

module.exports = dao;