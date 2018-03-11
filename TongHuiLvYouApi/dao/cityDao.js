/**
 * Created by Administrator on 2017/8/25.
 */
const daoMethod = require('../utils/daoCommon');

const dao = {
    /**
     * 添加城市
     * @param data
     */
    addCity: (data)=>{
        let sql = `insert into city_code value ($name, $code)`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查询指定地区下的子地区
     * @param data
     * @returns {*}
     */
    queryCitysByPid: (data)=>{
        let sql = `select * from china as a where a.pid = $id`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查询指定等级的地区
     * @param data
     * @returns {*}
     */
    queryCityByLevel: (data)=>{
        let sql =`select * from china as a where a.\`level\` = $level`;
        return daoMethod.oneMethod(sql, data);
    }

}

module.exports = dao;