/**
 * Created by Administrator on 2017/8/25.
 */
const aircraftDao = require('../dao/aircraftDao');
const serviceMethod = require('../utils/serviceCommon');

const service = {
    /**
     * 查询所有机场城市
     * @param data
     * @returns {*}
     */
    queryAircrafts: () => {
        return serviceMethod.searchMethod(aircraftDao, "queryAircrafts", null);
    },

    /**
     * 查询指定城市机场三字码
     * @param data
     * @returns {*}
     */
    queryAircraftsByCity: (data) => {
        return serviceMethod.searchMethod(aircraftDao, "queryAircraftsByCity", data);
    },

    /**
     * 查询指定城市机场三字码
     * @param data
     * @returns {*}
     */
    queryAircraftsByCode: (data) => {
        return serviceMethod.searchMethod(aircraftDao, "queryAircraftsByCode", data);
    },

    /**
     * 查询指定城市机场三字码
     * @param data
     * @returns {*}
     */
    findAirportInfo: (data) => {
        return new Promise((resolve, reject) => {
            aircraftDao.findAirportInfo(data).then((res)=>{
                resolve(res[0]);
            }).catch((error)=>{
                reject(error);
            });
        });
    }
}
module.exports = service;