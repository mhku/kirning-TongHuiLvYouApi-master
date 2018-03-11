/**
 * Created by Administrator on 2017/8/25.
 */
const daoMethod = require('../utils/daoCommon');

const dao = {
    /**
     * 通过三字码获取机场信息
     * @param data
     * @returns {*}
     */
    findAirportByCode: (data) => {
        let sql = `select * from aircraft_code where ac_code = $code`;
        return daoMethod.oneMethod(sql, data);
    },
};
module.exports = dao;