/**
 * Created by Administrator on 2017/9/28.
 */
const daoMethod = require('../utils/daoCommon');

const dao = {
    /**
     * 查询所有机场城市
     * @param data
     * @returns {*}
     */
    queryAircrafts: ()=>{
        let sql = `select a.airport_id, a.city_name, a.airport_code, a.airport_name from aircraft_code as a 
                   where a.airport_isable = 1 group by a.city_name order by a.airport_id`;
        return daoMethod.oneMethod(sql, null);
    },

    /**
     * 查询指定城市机场三字码
     * @param data
     * @returns {*}
     */
    queryAircraftsByCity: (data)=>{
        let sql =`select a.airport_id, a.city_name, a.airport_code, a.airport_name from aircraft_code as a 
        where a.airport_isable = 1 and a.city_name = $city_name limit 1`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查询指定三字码的城市
     * @param data
     * @returns {*}
     */
    queryAircraftsByCode: (data)=>{
        let sql =`select a.airport_id, a.city_name, a.airport_code, a.airport_name from aircraft_code as a 
                  where a.airport_isable = 1 and a.airport_code = $airport_code`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查询指定三字码的城市
     * @param data
     * @param data.depCode 出发机场/城市
     * @param data.arrCode 抵达机场/城市
     * @returns {*}
     */
    findAirportInfo: (data) => {
        let sql = `select ac1.city_name as depCity_name, ac1.airport_name as depAirport_name, ac2.city_name as arrCity_name, ac2.airport_name as arrAirport_name from aircraft_code as ac1, aircraft_code as ac2
                   where ac1.airport_code = $depCode and ac2.airport_code = $arrCode`;
        return daoMethod.oneMethod(sql, data);
    }
};
module.exports = dao;