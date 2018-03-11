/**
 * Created by Administrator on 2017/9/1.
 */
const moment = require('moment');
const touristDao = require('../dao/touristDao');
const tokenService = require('./tokenService');
const uuid = require('../utils/uuid');
const serviceMethod = require('../utils/serviceCommon');

const service = {

    /**
     * 添加游客信息
     * @param data
     * @returns {*}
     */
    addTourist: (data) => {
        data.tourist_id = uuid.createUUID();
        return serviceMethod.addMethod(touristDao, "addTourist", data);
    },

    /**
     * 删除游客信息
     * @param data
     * @returns {*}
     */
    delTourist: (data) => {
        return serviceMethod.delMethod(touristDao, "delTourist", data);
    },

    /**
     * 修改游客信息
     * @param data
     * @returns {*}
     */
    updateTourist: (data) => {
        data.tourist_birthday = moment(data.tourist_birthday).format("YYYY-MM-DD");
        return serviceMethod.updateMethod(touristDao, "updateTourist", data);
    },

    /**
     * 根据ID查找游客信息
     * @param data
     * @returns {*}
     */
    findTouristById: (data) => {
        return serviceMethod.searchMethod(touristDao, "findTouristById", data);
    },

    /**
     * 查找用户下所有的游客信息
     * @param data
     * @returns {*}
     */
    findTouristByUser: (data) => {
        return serviceMethod.searchMethod(touristDao, "findTouristByUser", data);
    },

    /**
     * 设置默认游客
     * @param data
     * @returns {Promise}
     */
    setDefaultTourist: (data) => {
        return new Promise((resolve, reject) => {
            Promise.all(data.tourist.map((tourist) => {
                // if (tourist.tourist_default != 0 && tourist.tourist_default != 1) tourist.tourist_default = 0;
                return touristDao.setDefaultTourist(tourist)
            })).then((res) => {
                resolve({code: 1, msg: "设置成功"});
            }).catch((error) => {
                reject({code: 3, msg: error.message});
            });
        });
    }
};
module.exports = service;