/**
 * Created by Administrator on 2017/9/7.
 */
const daoMethod = require('../utils/daoCommon');

const dao = {
    /**
     * 添加城市
     * @param data
     */
    addElectri_city: (data)=>{
        let sql = `insert into electri_company(province_id, city_id, city_name, electri_company_protype, electri_company_name) 
        value ($province_id, $city_id, $city_name, $electri_company_protype, $electri_company_name)`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查询所有支持城市
     * @param data
     * @returns {*}
     */
    searchCitys: (data)=>{
        let sql = `select * from electri_company group by city_id`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查询指定城市所支持的类型
     * @param data
     * @returns {*}
     */
    searchProtypeByCity: (data)=>{
        let sql =`select electri_company_protype from electri_company where province_id = $province_id and city_id = $city_id group by electri_company_protype`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查询指定城市的类型供应商公司
     * @param data
     * @returns {*}
     */
    searchCompanyByProtype: (data)=>{
        let sql =`select * from electri_company where province_id = $province_id and city_id = $city_id and electri_company_protype = $electri_company_protype`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查询指定城市的类型供应商公司
     * @param data
     * @returns {*}
     */
    searchCompanyByProtypeAndCity: (data)=>{
        let sql =`select * from electri_company as c where c.city_name = $city_name`;
        if (data.electri_company_protype) sql += ` and electri_company_protype = $electri_company_protype`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查询指定的供应商公司
     * @param data
     * @returns {*}
     */
    searchCompanyById: (data)=>{
        let sql =`select * from electri_company where electri_company_id = $electri_company_id`;
        return daoMethod.oneMethod(sql, data);
    },
};

module.exports = dao;