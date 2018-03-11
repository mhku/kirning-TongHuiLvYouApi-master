const serviceMethod = require('../../utils/serviceCommon');
const couponDao = require('../../houtai/dao/couponDao');
const uuid = require('../../utils/uuid');
let tokenService = require('../../service/tokenService');
let md5 = require('blueimp-md5');
let tokenUtil = require('../../utils/tokenUtil');


let service =
    {
        /**
         * 添加优惠劵
         *@param data
         * @return {*}
         */
        addCoupon: (data) => {
            return new Promise((resolve, reject) => {
                //通过token查询user_id
                tokenService.queryUserIdByToken(data).then((result) => {
                    data.coupon_creator = result.user_id;
                }).then(() => {
                    //查询广告位是否已经存在
                    return couponDao.findCoupon(data);
                }).then((result2) => {
                    if (result2.length > 0) {
                        return Promise.reject({code: 2, msg: "优惠劵已存在"});
                    }
                    data.coupon_id = uuid.createUUID();
                    return resolve(serviceMethod.addMethod(couponDao, "addCoupon", data));
                }).catch((err) => {
                    reject(err);
                })
            })
        },
        /**
         * 更改优惠劵状态
         * @param data
         * @return {*}
         */
        upCoupon: (data) => {
            return serviceMethod.updateMethod(couponDao, "upCoupon", data);
        },

        /**
         * 查询优惠劵
         * @param data
         * @return {*}
         */
        searchCoupon: (data) => {
            return serviceMethod.searchMethod(couponDao, "searchCoupon", data);
        }
    };
module.exports = service;