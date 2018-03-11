const daoMethod = require('../utils/daoCommon');
const dao = {
    /**
     * 根据首字母查询火车站信息
     * @param data
     * @returns {*}
     */
    searchTrainCodeByInitial: (data) =>{
        let sql = `select * from train_code as tc where tc.indexed = $initial order by tc.city_initials;`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 根据城市名查询火车站信息
     * @param data
     * @returns {*}
     */
    searchTrainCodeByName: (data) =>{
        let sql = `select * from train_code as tc where tc.city_name = $city_name`;
        return daoMethod.oneMethod(sql, data);
    }
};
module.exports = dao;