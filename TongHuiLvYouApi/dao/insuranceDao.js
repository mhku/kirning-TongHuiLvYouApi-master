const daoMethod = require('../utils/daoCommon');

const dao = {
    /**
     * 根据保险ID查询保险信息
     * @param data
     * @returns {*}
     */
    findInsuranceById: (data) => {
        let sql = `select i.insurance_code, i.insurance_name, i.insurance_business from insurance as i where i.insurance_id = $insurance_id and i.insurance_isable = '1'`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查询所有保险
     * @returns {*}
     */
    searchInsurances: () => {
        let sql = `select i.insurance_code, i.insurance_name, i.insurance_business from insurance as i where i.insurance_isable = '1'`;
        return daoMethod.oneMethod(sql, null);
    }
};
module.exports = dao;