/**
 * Created by Administrator on 2017/9/1.
 */
const daoMethod = require('../utils/daoCommon');

const dao = {
    /**
     * 添加游客信息
     * @param data
     * @returns {*}
     */
    addTourist: (data) => {
        let sql = `insert into tourist(tourist_id, user_id, tourist_name, tourist_gender, tourist_phone, tourist_birthday, tourist_identityType, tourist_identityNo, tourist_email, tourist_crowd_type) 
                value ($tourist_id, $user_id, $tourist_name, $tourist_gender, $tourist_phone, $tourist_birthday, $tourist_identityType, $tourist_identityNo, tourist_email, $tourist_crowd_type)`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 删除游客信息
     * @param data
     * @returns {*}
     */
    delTourist: (data) => {
        let sql = `update tourist set tourist_isable = '0' where tourist_id = $tourist_id`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 修改游客信息
     * @param data
     * @returns {*}
     */
    updateTourist: (data) => {
        let sql = `update tourist set tourist_name = $tourist_name, tourist_gender = $tourist_gender, tourist_phone = $tourist_phone, tourist_birthday = $tourist_birthday, 
        tourist_identityType = $tourist_identityType, tourist_identityNo = $tourist_identityNo, tourist_email = $tourist_email, tourist_crowd_type = $tourist_crowd_type 
        where tourist_id = $tourist_id`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 根据ID查找游客信息
     * @param data
     * @returns {*}
     */
    findTouristById: (data) => {
        let sql = `select t.tourist_id, t.tourist_name, t.tourist_gender, t.tourist_birthday, t.tourist_identityType, t.tourist_identityNo, t.tourist_phone,
         t.tourist_email, t.tourist_crowd_type, t.tourist_default from tourist as t where t.user_id = $user_id and t.tourist_id = $tourist_id and t.tourist_isable = '1'`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查找用户下所有的游客信息
     * @param data
     * @returns {*}
     */
    findTouristByUser: (data) => {
        let sql = `select t.tourist_id, t.tourist_name, t.tourist_gender, t.tourist_birthday, t.tourist_identityType, t.tourist_identityNo, t.tourist_phone,
         t.tourist_email, t.tourist_crowd_type, t.tourist_default from tourist as t where t.user_id = $user_id and t.tourist_isable = '1'`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 设置默认游客
     * @param data
     * @returns {*}
     */
    setDefaultTourist: (data)=>{
        let sql = `update tourist set tourist_default = $tourist_default 
                   where tourist_id = $tourist_id`;
        return daoMethod.oneMethod(sql, data);
    }
};
module.exports = dao;