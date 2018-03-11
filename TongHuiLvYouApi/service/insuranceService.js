const fs = require('fs');
const config = require('../utils/config').insura;
const api = require('../utils/api').insurance;
const soapUtil = require('../utils/soapUtil');
const uuid = require('../utils/uuid');
const request = require('../utils/request');
const insuranceDao = require('../dao/insuranceDao');
const service = {

    /**
     * 统一请求接口
     * @param data
     * @param data 请求参数
     * @param funName 方法名
     * @returns {Promise}
     */
    post: (data, funName) => {
        return new Promise((resolve, reject) => {
            soapUtil.request(api.insurance, data, funName).then((res) => {

            });
        });
    },

    unifiedParams: () => {
        const params = {
            username: config.username,
            content: '',
            format: 'json',
            signature: '',
        };
    },

    /**
     * 获取产品信息
     * @param data
     */
    searchProducts: () => {
        return new Promise((resolve, reject) => {
            let param = {
                BatchNum: uuid.createUUID(),
                UserName: 'rmth'
            };
            request.post(api.products, param, 'UTF-8').then((res) => {
                console.log(res);
                resolve(res);
            }).catch((err) => {
                reject({code: 3, msg: err});
            });
        });
    },

    /**
     * 获取产品费率
     * @param data
     */
    searchPlanRate: (data) => {
        return new Promise((resolve, reject) => {
            let param = {
                BatchNum: uuid.createUUID(),
                UserName: 'rmth',
                PlanNum: data.PlanNum
            };
            request.post(api.planRate, param, 'UTF-8').then((res) => {
                console.log(res);
                resolve(res);
            }).catch((err) => {
                reject({code: 3, msg: err});
            });
        });
    },

    /**
     * 获取产品保障内容
     * @param data
     */
    searchPlanCoverage: (data) => {
        return new Promise((resolve, reject) => {
            let param = {
                BatchNum: uuid.createUUID(),
                UserName: 'rmth',
                PlanNum: data.PlanNum
            };
            request.post(api.planCoverage, param, 'UTF-8').then((res) => {
                console.log(res);
                resolve(res);
            }).catch((err) => {
                reject({code: 3, msg: err});
            });
        });
    },

    /**
     * 购买保险
     * @param[] data.tourists
     * @returns {Promise}
     */
    insuranceBuying: (data) => {
        return new Promise((resolve, reject) => {
            insuranceDao.findInsuranceById(data).then((res) => {
                const param = {
                    BatchNum: '', //批次号
                    UserName: '', //用户名
                    Signature: '', //加密签名
                    ProductNum: '', //产品代码
                    HolderTp: '', //投保人类型
                    BeginDate: '', //保单生效日期
                    Period: '', //保险期限
                    EndDate: '', //保单截止日期
                    TourName: '', //目的地
                    TourNum: '', //团号
                    Withstamp: '', //是否带章
                    PolTp: '', //保单类型
                    ApplyUnit: [],//投保单元
                };
                //获取
                data.tourists.forEach((tourist) => {
                    let applyUnit = {
                        PolicyHolder: {     //投保人
                            HolderTp: '',   //投保人类型
                            Name: '',       //投保人姓名
                            Gender: '',     //投保人性别
                            IDTp: '',       //投保人证件类型
                            IDNum: '',      //投保人证件号码
                            Birthday: '',   //投保人生日
                        },
                        Insurant: {         //被保险人
                            Num: '',        //被保险人序号
                            Name: '',       //被保险人姓名
                            Gender: '',     //被保险人性别
                            IDTp: '',       //被保险人证件类型
                            IDNum: '',      //被保险人证件号码
                            Birthday: '',   //被保险人出生日期
                            Age: '',        //被保险人年龄
                        }
                    };
                })
            })
        })
    }
};
module.exports = service;