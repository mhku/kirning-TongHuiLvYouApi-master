let daoMethod = require("../../utils/daoCommon");

const dao = {

    /**
     * 查找版本号
     * @param data
     * @returns {*}
     */
    searchVersion: (data) => {
        const sql = `select version_number,version_path,version_name from version order by version_creatime desc limit 1`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 添加版本号
     * @param data
     * @returns {*}
     */
    addVersion: (data) => {
        const sql = `insert into version (version_id,version_number,version_path,version_name,version_creatime)
                       VALUES($version_id,$version_number,$version_path,$version_name,now())`;
        return daoMethod.oneMethod(sql,data);
    },


};

module.exports = dao;