/**
 * Created by Administrator on 2017/9/2.
 */
const md5 = require('blueimp-md5');
const moment = require('moment');
const urlencode = require('urlencode');
const convert = require('iconv-lite');
const crypto = require('crypto');
const schedule = require('node-schedule');
const config = require('../utils/config');
const api = require('../utils/api').recharge;
const request = require('../utils/request');
const returnUtil = require('../utils/returnUtil');
const orderNo = require('../utils/orderNo');
const uuid = require('../utils/uuid');
const payUtil = require('../utils/payConfig');
const serviceMethod = require('../utils/serviceCommon');
const signUtil = require('../utils/signUtil');
const payService = require('./payService');
const electri_companyDao = require('../dao/electri_companyDao');
const flowDao = require('../dao/flowDao');
const order_recordDao = require('../dao/order_recordDao');
const order_recordService = require('./order_recordService');
const userid = config.rechargeUserId;
const userpws = md5(config.rechargeUserPassword);
const version = config.rechargeVersion;
const KeyStr = config.rechargeKeyStr;
const reqUrl = config.url;
const ofReturl = reqUrl + '/api/recharge/retonline';
const shyReturl = reqUrl + '/api/recharge/shyNotifyurl';

/**
 * 字符串转JSON
 */
function strToJson(str) {
    let result = {};
    if (!str) return result;
    let params = str.split('&');
    params.forEach((item) => {
        let param = item.split('=');
        result[param[0]] = param[1];
    });
    return result;
}

const service = {

    /**
     * 充值接口访问
     * @param url api路径
     * @param data 参数
     * @returns {Promise}
     */
    req: (url, data, valueName) => {
        return new Promise((resolve, reject) => {
            data.userid = userid;
            data.userpws = userpws;
            data.version = version;
            return request.post(url, data, 'GB2312').then(val => {
                return returnUtil.toJson(val);
            }).then(val => {
                let value = val[valueName];
                if (value) {
                    if (value.retcode == '1') {
                        resolve({
                            code: 1,
                            data: value,
                            msg: '成功'
                        });
                    } else {
                        reject({
                            code: 2,
                            msg: value.err_msg
                        });
                    }
                } else {
                    reject({code: 2, msg: '返回值对象不存在'});
                }
            }).catch((error) => {
                reject(error);
            });
        });
    },

    /**
     * 统一充值接口
     * @param data
     * @param url 请求接口url
     * @param product_id 商品ID
     * @param telephone 联系电话
     * @param count 数量
     * @returns {Promise}
     */
    onlineorder: (data, url, other_retUrl) => {
        return new Promise((resolve, reject) => {
            data.ret_url = other_retUrl ? other_retUrl : ofReturl;
            service.req(url, data, 'orderinfo').then(val => {
                return resolve(val);
            }).catch(err => {
                return reject(err);
            });
        });
    },

    /**
     * 创建手机话费充值订单
     * @param data
     * @returns {*|Promise}
     */
    createPhoneOrder: (data) => {
        return new Promise((resolve, reject) => {
            let cardinfo = {};
            service.telquery(data).then((res) => {
                cardinfo = res.data;
                const pervalue = parseInt(data.pervalue);
                let price = pervalue;
                if (pervalue < 50) {
                    price += 1;
                }
                let data1 = {
                    order_id: uuid.createUUID(),
                    order_no: orderNo.createOrderNo(),
                    order_amount: price * 100,
                    order_price: price * 100,
                    order_telephone: data.phoneno,
                    order_title: cardinfo.cardname,
                    order_count: 1,
                    user_id: data.user_id,
                    product_id: '5',
                    order_target_id: '',
                    order_original_price: pervalue,
                    order_company_name: cardinfo.game_area
                };
                //添加订单
                return require('./orderService').addOrder([data1]);
            }).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 手机话费充值
     * @param data
     * @returns {*|Promise}
     */
    phoneRecharge: (order) => {
        let sporder_id = order.order_no,
            sporder_time = moment().format("YYYYMMDDHHmmss"),
            cardid = '140101',
            phoneNo = order.order_telephone,
            cardnum = order.order_original_price;

        let md5_str = (md5(userid + userpws + cardid + cardnum + sporder_id + sporder_time + phoneNo + KeyStr) + "").toUpperCase();
        let data1 = {
            sporder_id: sporder_id,
            sporder_time: sporder_time,
            cardid: cardid,
            cardnum: cardnum,
            game_userid: phoneNo,
            md5_str: md5_str
        };
        return service.onlineorder(data1, api.onlineorder, order.other_retUrl);
    },

    /**
     * 查询手机号当时是否可以充值
     * @param data
     * @returns {*|Promise}
     */
    telcheck: (data) => {
        return new Promise((resolve, reject) => {
            let data1 = {
                phoneno: data.phoneno,
                price: data.price
            };
            request.post(api.telcheck, data1, 'GB2312').then(res => {
                let value = res.split('#');
                if (value[0] == '1') {
                    let result = {
                        code: 1,
                        msg: "成功",
                        address: value[2]
                    };
                    resolve(result);
                } else {
                    reject({
                        code: 2,
                        msg: value[1]

                    });
                }
            }).catch((error) => {
                reject(error);
            });
        });
    },

    /**
     * 根据手机号和面值查询商品信息
     * @param data
     * @returns {*|Promise}
     */
    telquery: (data) => {
        let data1 = {
            userid: userid,
            userpws: userpws,
            phoneno: data.phoneno,
            pervalue: data.pervalue,
            version: version
        };
        return service.req(api.telquery, data1, 'cardinfo');
    },

    /**
     * 查询指定运营商与地区的流量值
     * @param data
     * @returns {*|Promise}
     */
    searchFlowValue: (data) => {
        return serviceMethod.searchMethod(flowDao, 'searchFlowValue', data);
    },

    /**
     * 查询指定运营商及地区及流量面值查询流量信息
     * @param data
     * @returns {*|Promise}
     */
    searchFlowInfo: (data) => {
        return serviceMethod.searchMethod(flowDao, 'searchFlowInfo', data);
    },

    /**
     * 手机流量充值
     * @param data
     * @returns {*|Promise}
     */
    flowRecharge: (order) => {
        let other_info = JSON.parse(order.order_otherInfo);
        let range = other_info.range,
            effectStartTime = other_info.effectStartTime,
            effectTime = other_info.effectTime,
            sporderId = order.order_no,
            phoneno = order.order_telephone,
            perValue = order.order_original_price,
            flowValue = other_info.flowValue;
        let md5Str = (md5(userid + userpws + phoneno + perValue + flowValue + range + effectStartTime + effectTime + sporderId + KeyStr) + "").toUpperCase();
        let data1 = {phoneno, perValue, flowValue, range, effectStartTime, effectTime, sporderId, md5Str};
        return service.onlineorder(data1, api.flowOrder, order.other_retUrl);
    },

    /**
     * 创建手机流量充值订单
     * @param data
     * @returns {*|Promise}
     */
    createFlowOrder: (data) => {
        return new Promise((resolve, reject) => {
            let cardinfo = {};
            service.flowCheck(data).then((res) => {
                cardinfo = res.data;
                let order_otherInfo = JSON.stringify({
                    flowValue: data.flowValue,
                    range: data.range,
                    effectStartTime: data.effectStartTime,
                    effectTime: data.effectTime
                });
                let data1 = {
                    order_id: uuid.createUUID(),
                    order_no: orderNo.createOrderNo(),
                    order_amount: parseInt(parseFloat(cardinfo.saleprice) * 100),
                    order_price: parseInt(parseFloat(cardinfo.saleprice) * 100),
                    order_telephone: data.phoneNo,
                    order_title: cardinfo.productname,
                    order_count: 1,
                    user_id: data.user_id,
                    product_id: '6',
                    order_target_id: '',
                    order_company_name: cardinfo.productname,
                    order_original_price: data.perValue,
                    order_otherInfo: order_otherInfo
                };
                //添加订单
                return require('./orderService').addOrder([data1]);
            }).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 固话/宽带充值
     * @param data
     * @returns {*|Promise}
     */
    telephoneRecharge: (order) => {
        let cardnum = order.order_original_price,
            teltype = order.teltype,
            chargeType = order.product_id == '14' ? '1' : '2',
            sporder_id = order.order_no,
            sporder_time = moment().format("YYYYMMDDHHmmss"),
            game_userid = order.order_telephone;
        let md5_str = (md5(userid + userpws + cardnum + sporder_id + sporder_time + game_userid + KeyStr) + "").toUpperCase();
        let data1 = {cardnum, teltype, chargeType, sporder_id, sporder_time, game_userid, md5_str};
        return service.onlineorder(data1, api.fixtelorder);
    },

    /**
     * 创建固话/宽带充值订单
     * @param data
     * @returns {*|Promise}
     */
    createTelephoneOrder: (data) => {
        return new Promise((resolve, reject) => {
            service.fixtelquery(data).then((res) => {
                let cardinfo = res.data;
                let product_id = data.chargeType == '1' ? '14' : '15';
                let data1 = {
                    order_id: uuid.createUUID(),
                    order_no: orderNo.createOrderNo(),
                    order_amount: parseInt(parseFloat(cardinfo.inprice) * 100),
                    order_price: parseInt(parseFloat(cardinfo.inprice) * 100),
                    order_telephone: data.telephone,
                    order_title: cardinfo.cardname,
                    order_count: 1,
                    user_id: data.user_id,
                    product_id: product_id,
                    order_company_name: cardinfo.game_area,
                    order_original_price: data.cardnum
                };
                //添加订单
                return require('./orderService').addOrder([data1]);
            }).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 根据固话/宽带号码和面值查询商品信息
     * @param data
     * @returns {*|Promise}
     */
    fixtelquery: (data) => {
        let teltype = data.teltype,
            phoneno = data.telephone,
            pervalue = data.cardnum,
            chargeType = data.chargeType;
        let data1 = {teltype, phoneno, pervalue, chargeType};
        return service.req(api.fixtelquery, data1, "cardinfo");
    },

    /**
     * 游戏充值
     * @param data
     * @returns {*|Promise}
     */
    gameRecharge: (order) => {
        let other_info = JSON.parse(order.order_otherInfo);
        let cardid = other_info.cardid,
            cardnum = order.order_original_price,
            sporder_id = order.order_no,
            sporder_time = moment().format("YYYYMMDDHHmmss"),
            game_userid = order.order_telephone,
            game_area = other_info.game_area,
            game_srv = other_info.game_srv;
        let md5_str = (md5(userid + userpws + cardid + cardnum + sporder_id + sporder_time + game_userid + game_area + game_srv + KeyStr) + "").toUpperCase();
        let data1 = {cardid, cardnum, sporder_id, sporder_time, game_userid, game_area, game_srv, md5_str};
        return service.onlineorder(data1, api.onlineorder);
    },

    /**
     * 创建游戏充值订单
     * @param data
     * @returns {*|Promise}
     */
    createGameOrder: (data) => {
        return new Promise((resolve, reject) => {
            service.querycardinfo(data).then((res) => {
                let cardinfo = res.data.ret_cardinfos.card;
                let order_otherInfo = JSON.stringify({
                    cardid: data.cardid,
                    game_area: data.game_area ? urlencode(data.game_area, "gbk") : "",
                    game_srv: data.game_srv ? urlencode(data.game_srv, "gbk") : ""
                }), product_id = data.cardid == '220612' ? '7' : '22', cardnum = parseInt(data.cardnum);
                let data1 = {
                    order_id: uuid.createUUID(),
                    order_no: orderNo.createOrderNo(),
                    order_amount: parseInt((parseFloat(cardinfo.inprice) * cardnum) * 100),
                    order_price: parseInt(parseFloat(cardinfo.inprice) * 100),
                    order_telephone: data.game_userid,
                    order_title: cardinfo.cardname,
                    order_count: cardnum,
                    user_id: data.user_id,
                    product_id: product_id,
                    order_otherInfo: order_otherInfo,
                    order_original_price: cardnum
                };
                //添加订单
                return require('./orderService').addOrder([data1]);
            }).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 创建生活缴费充值订单
     * @param data
     * @returns {*|Promise}
     */
    // createLifePaymentRecharge: (data) => {
    //     let token = data.token, provId = data.provId, cityId = data.cityId, type = data.type,
    //         chargeCompanyCode = data.chargeCompanyCode,
    //         payModeId = data.payModeId, payMentDay = data.payMentDay, contractNo = data.contractNo, cardId = "64376601",
    //         cardnum = 1,
    //         account = data.account, sporderId = orderNo.createOrderNo(), actPrice = data.actPrice, param1 = data.param1,
    //         contentId = data.contentId;
    //     let md5_str = (md5(userid + userpws + cardid + cardnum + sporderId + provId + cityId + type + chargeCompanyCode + account + KeyStr) + "").toUpperCase();
    //     let data1 = {
    //         token,
    //         provId,
    //         cityId,
    //         type,
    //         chargeCompanyCode,
    //         payModeId,
    //         payMentDay,
    //         contractNo,
    //         cardId,
    //         cardnum,
    //         account,
    //         sporderId,
    //         actPrice,
    //         md5_str
    //     };
    //     if (payModeId) data1.payModeId = payModeId;
    //     if (payMentDay) data1.payMentDay = payMentDay;
    //     if (contractNo) data1.contractNo = urlencode(contractNo, 'GBK');
    //     if (param1) data1.param1 = param1;
    //     if (contentId) data1.contentId = contentId;
    //     return service.onlineorder(data1, api.utilityOrder, '5', account, 1);
    // },

    /**
     * 石油加油卡充值
     * @param data
     * @returns {*|Promise}
     */
    fuelCardRecharge: (order) => {
        let other_info = JSON.parse(order.other_info);
        let cardid = '64127500',
            cardnum = order.order_original_price,
            sporder_id = order.order_no,
            sporder_time = moment().format("YYYYMMDDHHmmss"),
            game_userid = order.order_telephone,
            chargeType = 2,
            gasCardTel = other_info.gasCardTel;
        let md5_str = (md5(userid + userpws + cardid + cardnum + sporder_id + sporder_time + game_userid + KeyStr) + "").toUpperCase();
        let data1 = {cardid, cardnum, sporder_id, sporder_time, game_userid, chargeType, gasCardTel, md5_str};
        return service.onlineorder(data1, api.onlineorder, order.other_retUrl);
    },

    /**
     * 创建石油加油卡充值订单
     * @param data
     * @returns {*|Promise}
     */
    createFuelCardOrder: (data) => {
        return new Promise((resolve, reject) => {
            let cardnum = parseInt(data.cardnum);
            let data1 = {
                order_id: uuid.createUUID(),
                order_no: orderNo.createOrderNo(),
                order_amount: cardnum * 100,
                order_price: cardnum * 100,
                order_telephone: data.fuel_card,
                order_title: '石油加油卡充值',
                order_count: 1,
                user_id: data.user_id,
                product_id: '8',
                order_company_name: '中国石油',
                order_original_price: cardnum,
                other_info: {gasCardTel: data.gasCardTel}
            };
            //添加订单
            return require('./orderService').addOrder([data1]).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 石化加油卡充值
     * @param data
     * @returns {*|Promise}
     */
    SINOPECRecahrge: (order) => {
        return new Promise((resolve, reject) => {
            let timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
            let data1 = {
                partnerid: config.shyPartnerid,
                ordernumber: order.order_no,
                oilnumber: order.order_telephone,
                pid: 0,
                cid: 0,
                coid: 10,
                productarea: 0,
                denomination: order.order_original_price,
                timestamp: timestamp,
                format: "json",
                notifyurl: order.other_retUrl ? order.other_retUrl : shyReturl,
                timelimit: 1200
            };
            data1.sign = signUtil.sortSign(data1, config.shySignkey);
            //发送请求
            request.post(api.jykRecharge, data1, "gb18030").then((res) => {
                res = JSON.parse(res);
                if (res.result == 't') {
                    resolve({code: 1, msg: "成功"});
                } else {
                    reject({code: 2, msg: res.errmsg});
                }
            }).catch((err) => {
                reject({code: 3, msg: err.message});

            });
        });
    },

    /**
     * 创建石化加油卡充值
     * @param data
     * @returns {*|Promise}
     */
    createSINOPECOrder: (data) => {
        return new Promise((resolve, reject) => {
            let denomination = parseInt(data.denomination);
            let data1 = {
                order_id: uuid.createUUID(),
                order_no: orderNo.createOrderNo(),
                order_amount: denomination * 100,
                order_price: denomination * 100,
                order_telephone: data.oilnumber,
                order_title: '石化加油卡充值',
                order_count: 1,
                user_id: data.user_id,
                product_id: '9',
                order_company_name: '中国石化',
                order_original_price: denomination
            };
            //添加订单
            return require('./orderService').addOrder([data1]).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 获取所有水电煤支持城市
     * @param data
     * @returns {Promise}
     */
    searchCitys: () => {
        return serviceMethod.searchMethod(electri_companyDao, "searchCitys", {});
    },

    /**
     * 获取指定公司水电煤支持城市
     * @param data
     * @returns {Promise}
     */
    searchCompanyByCity: (data) => {
        return serviceMethod.searchMethod(electri_companyDao, "searchCompanyByCity", data);
    },

    /**
     * 查询指定城市所支持的类型
     * @param data
     * @returns {*}
     */
    searchProtypeByCity: (data) => {
        return serviceMethod.searchMethod(electri_companyDao, "searchProtypeByCity", data);
    },

    /**
     * 查询指定城市的类型供应商公司
     * @param data
     * @returns {*}
     */
    searchCompanyByProtype: (data) => {
        return serviceMethod.searchMethod(electri_companyDao, "searchCompanyByProtype", data);
    },

    /**
     * 查询指定中文名城市及类型的供应商公司
     * @param data
     * @returns {*}
     */
    searchCompanyByProtypeAndCity: (data) => {
        return serviceMethod.searchMethod(electri_companyDao, "searchCompanyByProtypeAndCity", data);
    },

    /**
     * 查询指定的供应商公司
     * @param data
     * @returns {*}
     */
    searchCompanyById: (data) => {
        return serviceMethod.searchMethod(electri_companyDao, "searchCompanyById", data);
    },

    /**
     * 水电煤账单查询接口
     * @param data
     * @returns {*|Promise}
     */
    bills: (data) => {
        return new Promise((resolve, reject) => {
            serviceMethod.searchMethod(electri_companyDao, "searchCompanyById", data).then((res) => {
                let electri = res[0];
                let data1 = {
                    partnerid: config.shyPartnerid,
                    pid: electri.province_id,
                    cid: electri.city_id,
                    picoid: electri.electri_company_id,
                    protype: electri.electri_company_protype,
                    account: data.account,
                    timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
                    format: "json"
                };
                //按顺序签名
                data1.sign = signUtil.sortSign(data1, config.shySignkey);
                //调用第三方接口
                request.post(api.bills, data1, "gb18030").then(val => {
                        val = JSON.parse(val);
                        if (val.result == 't') {
                            return resolve({
                                code: 1,
                                data: val
                            });
                        } else {
                            return reject({
                                code: 2,
                                msg: val.errmsg
                            });
                        }
                    }
                )
                ;
            }).catch((error) => {
                return reject(error);
            });
        });
    },

    /**
     * 水电煤充值接口
     * @param data
     * @returns {*|Promise}
     */
    recharge: (order) => {
        return new Promise((resolve, reject) => {
            let order_info = JSON.parse(order.order_otherInfo),
                data1 = {
                    partnerid: config.shyPartnerid,
                    ordernumber: order.order_no,
                    pid: order_info.pid,
                    cid: order_info.cid,
                    picoid: order_info.picoid,
                    protype: order_info.protype,
                    account: order.order_telephone,
                    value: order.order_amount,
                    timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
                    format: "json",
                    notifyurl: shyReturl,
                    timelimit: 1200
                };
            //签名加密
            data1.sign = signUtil.sortSign(data1, config.shySignkey);
            //调用充值接口
            return request.post(api.sdmRecharge, data1, "gb18030").then((res) => {
                res = JSON.parse(res);
                if (res.result == 't') {
                    resolve({code: 1, msg: "成功"});
                } else {
                    reject({code: 2, msg: res.errmsg});
                }
            }).catch((err) => {
                reject({code: 3, msg: err.message});
            });
        });
    },

    /**
     * 水电煤充值接口
     * @param data
     * @returns {*|Promise}
     */
    createRechargeOrder: (data) => {
        return new Promise((resolve, reject) => {
            serviceMethod.searchMethod(electri_companyDao, "searchCompanyById", data).then((res) => {
                let electri = res.data[0], order_otherInfo = JSON.stringify({
                    picoid: parseInt(electri.electri_company_id),
                    protype: parseInt(electri.electri_company_protype),
                    pid: parseInt(electri.province_id),
                    cid: parseInt(electri.city_id),
                });
                let type = "水费", product_id = '10';
                if (electri.electri_company_protype === 200) {
                    type = "电费";
                    product_id = "11";
                } else if (electri.electri_company_protype === 300) {
                    type = "燃气费";
                    product_id = "12";
                }
                let data2 = {
                    order_id: uuid.createUUID(),
                    order_no: orderNo.createOrderNo(),
                    order_amount: parseInt(parseFloat(data.money) * 100),
                    order_price: parseInt(parseFloat(data.money) * 100),
                    order_telephone: data.account,
                    order_title: `生活缴费（${type}）${data.money}元`,
                    order_count: 1,
                    user_id: data.user_id,
                    product_id: product_id,
                    order_company_name: electri.electri_company_name,
                    order_otherInfo: order_otherInfo,
                };
                //添加订单
                return require('./orderService').addOrder([data2]);
            }).then(val => {
                return resolve(val);
            }).catch(error => {
                return reject(error);
            });
        });
    },

    /**
     * 公共事业缴费类型查询接口
     * @param data
     * @returns {*|Promise}
     */
    queryBalance: (data) => {
        let data1 = {
            cardId: '64376601',
            provName: urlencode(data.provName, 'GBK'),
            cityName: urlencode(data.cityName, 'GBK'),
            type: data.type,
            chargeCompanyCode: data.chargeCompanyCode,
            chargeCompanyName: urlencode(data.chargeCompanyName, 'GBK'),
            account: data.account,
            payModeId: data.payModeId,
            amount: data.amount,
            counts: data.counts,
        };
        if (data.amount) data1.amount = data.amount;
        if (data.counts) data1.counts = data.counts;
        return service.req(api.queryBalance, data1, "queryBalance");
    },

    /**
     * 公共事业缴费单位查询接口
     * @param data
     * @returns {*|Promise}
     */
    getPayUnitList: (data) => {
        return service.req(api.getPayUnitList, data, "payUnitinfo");
    },

    /**
     * 公共事业缴费方式查询接口
     * @param data
     * @returns {*|Promise}
     */
    getPayModeList: (data) => {
        return service.req(api.getPayModeList, data, "payModeinfo");
    },

    /**
     * 充值结果返回通知处理
     * @param data
     * @returns {Promise}
     */
    // retonline: (data) => {
    //     let data1 = {
    //         order_no: data.sporder_id
    //     };
    //     if (data.ret_code == 1) {
    //         data1.order_state = 5;
    //     } else {
    //         data1.order_state = 7;
    //     }
    //     return require('./orderService').updateOrderStateByNo(data1).catch(console.log.bind(console));
    // },

    /**
     * 手机号码归属地查询
     * @param data
     */
    mobinfo: (data) => {
        return new Promise((resolve, reject) => {
            request.post(api.mobinfo, data, 'GB2312').then(val => {
                let value = val.split('|');
                if (value.length > 1) {
                    let data1 = {
                        mobilenum: value[0],
                        Dependency: value[1],
                        operators: value[2]
                    };
                    resolve({code: 1, data: data1, msg: "成功"});
                } else {
                    reject({
                        code: 2,
                        msg: value[0]
                    });
                }
            }).catch((error) => {
                reject(error);
            });
        });
    },

    /**
     * 检查流量商品是否可用
     * @param data
     * @returns {Promise}
     */
    flowCheck: (data) => {
        let data1 = {
            phoneno: data.phoneNo,
            perValue: data.perValue,
            flowValue: data.flowValue,
            range: data.range,
            effectStartTime: 1,
            effectTime: 1
        };
        return service.req(api.flowCheck, data1, 'queryinfo')
    },

    /**
     * 商品小类信息同步接口
     * @param data
     * @param data.cardid 商品编码
     * @returns {Promise.<*|Promise>}
     */
    queryList: (data) => {
        let data1 = {
            cardid: data.cardid
        };
        return service.req(api.querylist, data1, 'cardinfo');
    },

    /**
     * 游戏直充区服查询接口
     * @param data
     * @param data.gameid 游戏ID
     * @returns {Promise.<*|Promise>}
     */
    getareaserver: (data) => {
        let data1 = {
            gameid: data.gameid
        };
        return service.req(api.getareaserver, data1, 'ROWDATA');
    },

    /**
     * 具体商品信息同步接口
     * @param data
     * @param data.gameid 游戏ID
     * @returns {Promise.<*|Promise>}
     */
    querycardinfo: (data) => {
        let data1 = {
            cardid: data.cardid
        };
        return service.req(api.querycardinfo, data1, 'cardinfo');
    },

    /**
     * 交罚违章支持城市查询接口
     * @param data
     * @returns {*|Promise}
     */
    queryTrafficCity: () => {
        let param = {
            md5Str: (md5(userid + userpws + KeyStr) + "").toUpperCase(),
        };
        return service.req(api.queryTrafficCity, param, 'result');
    },

    /**
     * 交罚违章查询接口
     * @param data
     * @returns {*|Promise}
     */
    queryTrafficFines: (data) => {
        let plateNumber = urlencode.encode(data.plateNumber, 'gbk'), areas = urlencode.encode(data.areas, 'gbk'),
            sporderId = '20171214045542200';
        let data1 = {
            plateNumber: plateNumber,
            ownerMobile: data.ownerMobile,
            areas: areas,
            engineNumber: data.engineNumber,
            frameNumber: data.frameNumber,
            sporderId: sporderId,
            retUrl: ofReturl,
            md5Str: '',
        };
        let sign = userid + userpws + data.plateNumber + data.ownerMobile + data.areas + data.engineNumber + data.frameNumber + sporderId + KeyStr;
        // let sign = userid + userpws + plateNumber + data.ownerMobile + areas + data.engineNumber + data.frameNumber + sporderId + KeyStr;
        // sign = urlencode(sign, 'gbk');
        const buf = convert.encode(sign, "gbk");

        data1.md5Str = crypto.createHash('md5').update(buf).digest('hex').toUpperCase();
        // data1.md5Str = (md5(sign) + "").toUpperCase();
        return service.req(api.queryTrafficFines, data1, 'orderinfo');
    },

    /**
     * 创建交罚违章缴费订单
     * @param data
     * @returns {*|Promise}
     */
    createTrafficFinesOrder: (data) => {
        return new Promise((resolve, reject) => {
            service.queryTrafficFines(data).then((res) => {
                let orderinfo = res.data, trafficviolation = {};
                orderinfo.trafficQueryResult.trafficViolationList.forEach((traff) => {
                    if (traff.rechargeNo == data.rechargeNo) {
                        trafficviolation = traff;
                    }
                });
                let price = parseInt(parseFloat(trafficviolation.fine) * 100);
                let data1 = {
                    order_id: uuid.createUUID(),
                    order_no: orderNo.createOrderNo(),
                    order_amount: price,
                    order_price: price,
                    order_telephone: data.ownerMobile,
                    order_title: `违章交罚${trafficviolation.fine}元`,
                    order_count: 1,
                    user_id: data.user_id,
                    product_id: '23',
                    order_departure_datetime: moment(trafficviolation.time).format("YYYY-MM-DD HH:mm:ss"),
                    order_remark: trafficviolation.reason,
                    order_destination: trafficviolation.province + trafficviolation.city + trafficviolation.address,
                    order_target_id: trafficviolation.rechargeNo
                };
                //添加订单
                return require('./orderService').addOrder([data1]).then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    },

    /**
     * 交罚违章缴费
     * @param data
     * @returns {*|Promise}
     */
    orderTrafficFines: (order) => {
        let rechargeNo = order.order_target_id,
            sporderId = order.order_no,
            data1 = {
                rechargeNo: rechargeNo,
                sporderId: sporderId,
                md5Str: (md5(userid + userpws + rechargeNo + sporderId + KeyStr) + "").toUpperCase(),
                retUrl: retUrl
            };
        return service.req(api.orderTrafficFines, data1, 'orderinfo');
    },

    /**
     * 欧飞充值回调
     * @param data
     */
    retonline: (data) => {
        return new Promise((resolve, reject) => {
            data = strToJson(data);
            let order = {
                order_no: data.sporder_id,
            };
            require('./orderService').findOrderByNoOfPay(order).then((res) => {
                order = res.data[0];
                if (data.ret_code == 1) {
                    order.order_state = '5';
                    order_recordDao.addRecord({order_record_type: '4', order_id: order.order_id});
                    return require('./orderService').updateOrderStateByNo(order);
                } else {
                    order_recordDao.addRecord({
                        order_record_type: '6',
                        order_id: order.order_id,
                        order_record_fail: data.err_msg
                    });
                    order.order_reason = data.err_msg || "";//urlencode.decode(data.err_msg, 'gbk');
                    return require('./payService').refundMethod(order);
                }
            }).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 赛合一充值结果查询
     * @param data
     * @returns {Promise}
     */
    querysingle: ({order_no, order_createtime}) => {
        return new Promise((resolve, reject) => {
            let data1 = {
                partnerid: config.shyPartnerid,
                ordernumber: order_no,
                ordertime: order_createtime,
                timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
                format: "json"
            };
            //签名加密
            data1.sign = signUtil.sortSign(data1, config.shySignkey);
            //调用充值接口
            return request.post(api.querysingle, data1, "gb18030").then((res) => {
                res = JSON.parse(res);
                if (res.result != 't') {
                    res.ordernumber = order_no;
                }
                resolve(res);
            });
        });
    },

    /**
     * 赛合一充值回调
     * @param data
     */
    shyNotifyurl: (data) => {
        return new Promise((resolve, reject) => {
            let order = {
                order_no: data.ordernumber
            };
            require('./orderService').findOrderByNoOfPay(order).then((res) => {
                order = res.data[0];
                if (data.status == 4) {
                    order.order_state = '5';
                    order_recordDao.addRecord({order_record_type: '4', order_id: order.order_id})
                    return require('./orderService').updateOrderStateByNo(order);
                } else {
                    order_recordDao.addRecord({
                        order_record_type: '6',
                        order_id: order.order_id,
                        order_record_fail: ""
                    });
                    return payService.refundMethod(order);
                }
            }).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    timingUpdateState: () => {
        console.log("开启赛合一定时查单任务");
        const auto = schedule.scheduleJob('*/5 * * * *', () => {
            console.log("赛合一定时任务")
            require('./orderService').searchOrderByState({product_id: '10,11,12', order_state: '7'}).then((res) => {
                const orders = res.data;
                return Promise.all(orders.map((order) => {
                    return service.querysingle(order);
                }));
            }).then((res) => {
                res.forEach((result) => {
                    const param = {order_no: result.ordernumber};
                    return require('./orderService').findOrderByNoOfPay(param).then((rs) => {
                        const order = rs.data[0];
                        if (result.result == 't') {
                            const status = result.status;
                            switch (status) {
                                case "4":
                                    param.order_state = '5';
                                    param.order_target_id = order.order_target_id;
                                    param.product_id = order.product_id;
                                    order_recordService.addRecord({
                                        order_record_type: '4',
                                        order_id: order.order_id
                                    });
                                    return require('./orderService').updateOrderStateByTargetNo(param);
                                    break;
                                case "5":
                                    order_recordService.addRecord({
                                        order_record_type: '4',
                                        order_id: order.order_id,
                                        order_record_fail: result.errmsg
                                    });
                                    return require('./payService').refundMethod(order);
                                    break;
                            }
                        } else {
                            order_recordService.addRecord({
                                order_record_type: '4',
                                order_id: order.order_id,
                                order_record_fail: '充值失败，无可充资源'
                            });
                            order.order_reason = result.errmsg;
                            order.order_refund_amount = order.order_amount;
                            return require('./payService').refundMethod(order);
                        }
                    });
                })
            }).then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err)
            });
        });
    },
};

module.exports = service;