const uuid = require('../../utils/uuid');
const serviceMethod = require('../../utils/serviceCommon');
const adsenseDao = require('../../houtai/dao/adsenseDao');
let tokenService = require('../../service/tokenService');

let service =
    {
        /**
         * 增加广告位
         * @param data
         * @return {*}
         */
        addAdsense: (data) => {
            return new Promise((resolve, reject) => {
                //通过token查询user_id
                tokenService.queryUserIdByToken(data).then((result) => {
                    data.adsense_creator = result.user_id;
                    data.adsense_id = uuid.createUUID();
                }).then(() => {
                    //查询广告位是否已经存在
                    return adsenseDao.findAdsense(data);
                }).then((result2) => {
                    if (result2.length > 0) {
                        return Promise.reject({code: 2, msg: "广告位已存在"});
                    }
                    return resolve(serviceMethod.addMethod(adsenseDao, "addAdsense", data));
                }).catch((err) => {
                    reject(err);
                })
            })
        },
        /**
         * 停用广告位
         *@param data
         * @return {*}
         */
        delAdsense: (data) => {
            return serviceMethod.updateMethod(adsenseDao, "delAdsense", data);
        },
        /**
         * 广告位列表
         *@param data
         * @return {*}
         */
        searchAdsense: (data) => {
            return new Promise((resolve, reject) => {
                return serviceMethod.searchMethod(adsenseDao, "searchAdsense", data).then((result) => {
                    data.counts = 1;
                    return serviceMethod.searchMethod(adsenseDao, "searchAdsense", data).then((result2) => {
                        result.count = result2.data.length;
                        resolve(result);
                    }, err => {
                        reject(err);
                    })
                }, err => {
                    reject(err);
                })
            })
        },
        /**
         * 添加广告
         *@param data
         * @return {*}
         */
        addAdvertisement: (data) => {
            return new Promise((resolve, reject) => {
                //通过token查询user_id
                tokenService.queryUserIdByToken(data).then((result) => {
                    data.advertisement_creator = result.user_id;
                }).then(() => {
                    //查询广告位是否已经存在
                    return adsenseDao.findAdvertisement(data);
                }).then((result2) => {
                    if (result2.length > 0) {
                        return Promise.reject({code: 2, msg: "广告已存在"});
                    }
                    data.advertisement_id = uuid.createUUID();
                    return resolve(serviceMethod.addMethod(adsenseDao, "addAdvertisement", data));
                }).catch((err) => {
                    reject(err);
                })
            })
        },
        /**
         * 广告列表
         *@param data
         * @return {*}
         */
        searchAdvertisement: (data) => {
            return serviceMethod.searchMethod(adsenseDao, "searchAdvertisement", data);
        },
        /**
         * 停用广告
         *@param data
         * @return {*}
         */
        delAdvertisement: (data) => {
            return serviceMethod.updateMethod(adsenseDao, "delAdvertisement", data);
        }
    };
module.exports = service;