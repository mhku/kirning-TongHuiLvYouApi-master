/**
 * Created by Administrator on 2017/8/25.
 */
const cityDao = require('../dao/cityDao');
const serviceMethod = require('../utils/serviceCommon');

const service = {

    /**
     * 查询指定地区下的子地区
     * @param data
     * @returns {Promise}
     */
    queryCitysByPid: (data)=>{
        return serviceMethod.searchMethod(cityDao, 'queryCitysByPid', data);
    },

    /**
     * 查询指定等级的地区
     * @param data
     * @returns {*|Promise}
     */
    queryCityByLevel: (data)=>{
        return serviceMethod.searchMethod(cityDao, 'queryCityByLevel', data);
    },

    /**
     * 添加城市三字码
     * @param data
     */
    addCity: (data)=>{
        return serviceMethod.addMethod(cityDao, 'addCity', data);
    }
}
module.exports = service;