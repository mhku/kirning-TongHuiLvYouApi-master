const md5 = require('blueimp-md5');
const moment = require('moment');
const schedule = require('node-schedule');
const requres = require('../utils/request');
const config = require('../utils/config').hotel;
const api = require('../utils/api').hotel;
const uuid = require('../utils/uuid');
const orderNo = require('../utils/orderNo');
const tokenService = require('./tokenService');
const collectionDao = require('../dao/collectionDao');
const order_recordDao = require('../dao/order_recordDao');
const order_recordService = require('./order_recordService');

const service = {

    /**
     * 发起酒店请求
     * @param data 请求参数
     * @param successMsg 成功返回信息
     * @returns {Promise}
     */
    post: (url, data, successMsg = "查询成功") => {
        return new Promise((resolve, reject) => {
            //发送请求
            requres.post(url, data, "UTF-8").then((res) => {
                res = JSON.parse(res);
                //成功
                if (res.successcode === 'T') {
                    resolve({code: 1, msg: successMsg, data: res});
                } else {
                    let info = res.info || res.Info;
                    reject({code: 2, msg: info});
                }
            }).catch((error) => {
                reject({code: 3, msg: error.message});
            });
        });
    },

    /**
     * 补全格式数据
     * @param data
     * @returns {*}
     */
    formatData: (data) => {
        let sign = '';
        for (let key in data) {
            sign += data[key];
        }
        data.sign = md5(sign);
        return data;
    },

    /**
     * 获取酒店列表接口
     * @param data
     * @returns {Promise}
     */
    searchHotelList: (data) => {
        return new Promise((resolve, reject) => {
            const params = {
                action: "gethotellist", //方法名
                companycode: config.companycode,    //公司代码
                key: config.key,    //安全码
                cityid: data.cityid,    //城市ID
                bdate: data.bdate,      //入住日期
                edate: data.edate,      //离店日期
                pagecurrent: parseInt(data.page), //查询页码
                pagesize: parseInt(data.size),    //每页查询行数
            };
            //酒店ID
            if (data.hotelid) params.hotelid = data.hotelid;
            //行政区ID
            if (data.regionid) params.regionid = data.regionid;
            //关键词
            if (data.kw) params.kw = data.kw;
            //坐标经纬度
            if (data.location) params.location = data.location;
            //价格区间
            if (data.price) params.price = data.price;
            //酒店星级
            if (data.starid) params.starid = data.starid;
            //品牌码
            if (data.brandcode) params.brandcode = data.brandcode;
            //城市名
            if (data.cityname) params.cityname = data.cityname;
            //查询全部结果
            params.contenttype = 'L';
            //距离范围
            if (data.distance) params.distance = data.distance;
            //排序字段
            if (data.orderby) params.orderby = data.orderby;
            //排序类型
            if (data.sort) params.sort = data.sort;
            //返回结果规则
            if (data.resultrules) params.resultrules = data.resultrules;
            let param = "param=" + JSON.stringify(service.formatData(params));
            //发起请求
            service.post(api.hotel, param).then((res) => {
                resolve(res);
            }).catch((error) => {
                reject(error);
            })
        });
    },

    /**
     * 获取城市信息接口
     * @param data
     * @returns {Promise}
     */
    getcitylist: (data) => {
        let params = {
            action: "getcitylist",  //方法名
            companycode: config.companycode,//公司代码
            key: config.key //安全码
        };
        //城市中文名
        if (data.cityname) params.cityname = data.cityname;
        //城市英文名
        if (data.cityename) params.cityename = data.cityename;
        //城市拼音简称
        if (data.citypy) params.citypy = data.citypy;
        //发起请求
        return service.post(api.getcitylist, service.formatData(params));
    },

    /**
     * 查询关键字返回地标和酒店名称
     * @param data
     * @returns {*|Promise}
     */
    queryhotelkw: (data) => {
        let params = {
            action: "queryhotelkw",  //方法名
            companycode: config.companycode,//公司代码
            key: config.key, //安全码
            cityid: data.cityid, //城市ID
            searcount1: data.searcount, //显示数量
            kw: data.kw //关键词
        };
        params = service.formatData(params);
        let param = "param=" + JSON.stringify(params);
        //发起请求
        return service.post(api.hotel, param);
    },

    /**
     * 获取城市地理位置
     * @param data
     * @returns {*|Promise}
     */
    getcitylankmark: (data) => {
        let params = {
            action: "getcitylankmark",  //方法名
            companycode: config.companycode,//公司代码
            key: config.key, //安全码
            cityid: data.cityid, //城市ID
            count: data.count, //显示数量
        };
        let param = "param=" + JSON.stringify(service.formatData(params));
        //发起请求
        return service.post(api.getcitylankmark, param);
    },

    /**
     * 获取酒店品牌码
     * @param data
     * @returns {*|Promise}
     */
    getbrandcode: (data) => {
        let params = {
            action: "getbrandcode",  //方法名
            companycode: config.companycode,//公司代码
            key: config.key, //安全码
        };
        let param = "param=" + JSON.stringify(service.formatData(params));
        //发起请求
        return service.post(api.hotel, param);
    },

    /**
     * 获取酒店评价接口
     * @param data
     * @returns {*|Promise}
     */
    gethotelcomment: (data) => {
        return new Promise((resolve, reject) => {
            let params = {
                action: "gethotelcomment",  //方法名
                companycode: config.companycode,//公司代码
                key: config.key, //安全码
                hid: data.hid, //酒店ID
                pagecurrent: parseInt(data.page), //查询页码
                pagesize: parseInt(data.size), //每页显示行数
            };
            //评论类型
            if (data.recommend) params.recommend = data.recommend;
            params = service.formatData(params);
            let param = "param=" + JSON.stringify(params);
            //发起请求
            service.post(api.hotel, param).then((res) => {
                resolve(res);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    /**
     * 获取城市标志地标和名称
     * @param data
     * @returns {Promise}
     */
    getmarkplace: (data) => {
        return new Promise((resolve, reject) => {
            let params = {
                action: "getmarkplace",  //方法名
                companycode: config.companycode,//公司代码
                key: config.key, //安全码
                cityid: data.cityid, //酒店ID
                count: parseInt(data.count), //查询数量
            };
            let param = "param=" + JSON.stringify(service.formatData(params));
            //发起请求
            service.post(api.hotel, param).then((res) => {
                resolve(res);
            }).catch((error) => {
                reject(error);
            })
        });
    },

    /**
     * 获取酒店详细信息接口
     * @param data
     * @returns {*|Promise}
     */
    gethoteldetail: (data) => {
        return new Promise((resolve, reject) => {
            const params = {
                action: "gethoteldetail", //方法名
                companycode: config.companycode,    //公司代码
                key: config.key,    //安全码
                hid: data.hid,    //酒店ID
                bdate: data.bdate,      //入住日期
                edate: data.edate,      //离店日期
                isdetails: '1',      //离店日期
            };
            let param = "param=" + JSON.stringify(service.formatData(params));
            //发起请求
            service.post(api.hotel, param).then((res) => {
                res.data.collection_id = null;
                if (data.token) {
                    tokenService.queryUserIdByToken(data).then((res1) => {
                        res1.id = data.hid;
                        res1.collection_classification = '1';
                        return collectionDao.findCollection(res1);
                    }).then((res1) => {
                        if (res1.length > 0) {
                            res.data.collection_id = res1[0].collection_id;
                        }
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
                } else {
                    resolve(res);
                }
            });
        });
    },

    searchorderdetail: (data) => {
        return new Promise((resolve, reject) => {
            const params = {
                action: "searchorderdetail", //方法名
                companycode: config.companycode,    //公司代码
                key: config.key,           //安全码
                orderid: data.order_target_id,   //订单号
            };
            console.log(JSON.stringify(params));
            let param = "param=" + JSON.stringify(service.formatData(params));
            //发起请求
            return service.post(api.hotel, param, "查询成功").then((res) => {
                resolve(res.data);
            }).catch((error) => {
                console.log(error.msg);
                reject(error);
            });
        });
    },

    /**
     * 获取酒店详细信息接口
     * @param data
     * @returns {*|Promise}
     */
    submitorder: (data) => {
        return new Promise((resolve, reject) => {
            let params = {
                action: "submitorder2", //方法名
                companycode: config.companycode,    //公司代码
                key: config.key,    //安全码
                bdate: data.bdate,      //入住日期
                edate: data.edate,      //离店日期
                hid: data.hid,    //酒店ID
                PT: parseInt(data.PT),    //支付类型
                inperson: parseInt(data.inperson),    //入住人数
                price: data.price,    //总价
                inpersonstr: data.inpersonstr,    //入住人员姓名字符串
                VendorCode: data.VendorCode,    //供应商代码
            }, order = {};
            //房型ID
            if (data.RoomTypeId) params.RoomTypeId = data.RoomTypeId;
            //套餐ID
            if (data.SetmealID) params.SetmealID = data.SetmealID;
            //酒店编码
            if (data.HotelCode) params.HotelCode = data.HotelCode;
            //房型编码
            if (data.RoomTypeCode) params.RoomTypeCode = data.RoomTypeCode;
            //套餐编码
            if (data.SetmealCode) params.SetmealCode = data.SetmealCode;
            //床型
            if (data.bedtype) params.bedtype = data.bedtype;
            //是否禁烟
            if (data.noSmoking) params.noSmoking = data.noSmoking;
            //其他信息
            if (data.otherInfo) params.otherInfo = data.otherInfo;
            //是否担保
            if (data.isgur) params.isgur = data.isgur;
            //联系人姓名
            if (data.lxrname) params.lxrname = data.lxrname;
            //联系人电话
            if (data.lxrtel) params.lxrtel = data.lxrtel;
            //联系人邮箱
            if (data.lxremail) params.lxremail = data.lxremail;
            //联系人手机
            if (data.lxrmobile) params.lxrmobile = data.lxrmobile;
            //最晚入住时间
            if (data.ArriveLateTime) params.ArriveLateTime = data.ArriveLateTime;
            //最早入住时间
            if (data.ArriveEarlyTime) params.ArriveEarlyTime = data.ArriveEarlyTime;
            //银行编码
            if (data.bankcode) params.bankcode = data.bankcode;
            //信用卡号
            if (data.cardnum) params.cardnum = data.cardnum;
            //过期时间
            if (data.expiredate) params.expiredate = data.expiredate;
            //信用卡安全码
            if (data.cvv2) params.cvv2 = data.cvv2;
            //信用卡用户姓名
            if (data.ownername) params.ownername = data.ownername;
            //信用卡用户电话
            if (data.ownertel) params.ownertel = data.ownertel;
            //证件类型
            if (data.creditcardusertype) params.creditcardusertype = data.creditcardusertype;
            //证件号码
            if (data.creditcarduseridnum) params.creditcarduseridnum = data.creditcarduseridnum;
            let param = "param=" + JSON.stringify(service.formatData(params));
            //发起请求
            service.post(api.hotel, param).then((res) => {
                let order_amount = parseInt(parseFloat(res.data.price) * 100);
                let order_count = parseInt(data.inperson);
                order = {
                    order_id: uuid.createUUID(),
                    order_no: orderNo.createOrderNo(),
                    user_id: data.user_id,
                    order_target_id: res.data.Id,
                    product_id: '17',
                    order_amount: order_amount,
                    order_price: order_amount / order_count,
                    order_telephone: data.lxrmobile,
                    order_mailbox: data.lxremail,
                    order_user: data.inpersonstr,
                    order_destination: data.cityName,
                    order_departure_datetime: moment(data.bdate).format("YYYY-MM-DD HH:mm:ss"),
                    order_end_time: moment(data.edate).format("YYYY-MM-DD HH:mm:ss"),
                    order_count: order_count,
                    order_title: data.CnName,
                    order_tickettype: data.room_property,
                    order_company_name: data.CnName,
                    order_remark: data.order_remark,
                };
                return require('./orderService').addOrder([order]);
            }).then((res) => {
                let params = {
                    user_id: order.user_id,
                    order_id: order.order_id
                };
                require('./orderService').autoCancelOrder(params, () => {
                    service.cancelOrder(params);
                });
                resolve(res);
            }).catch((error) => {
                order_recordDao.addRecord({
                    order_record_type: '6',
                    order_id: order.order_id,
                    order_record_fail: error.msg
                });
                reject(error);
            });
        });
    },

    /**
     * 酒店支付接口
     * @param data
     * @returns {*|Promise}
     */
    hotelordervmpay: (order) => {
        return new Promise((resolve, reject) => {
            const params = {
                action: "hotelordervmpay", //方法名
                companycode: config.companycode,    //公司代码
                key: config.key,           //安全码
                paypwd: md5(config.paypwd),    //支付密码
                orderno: order.order_target_id,   //订单号
                price: order.order_amount,      //支付金额
            };
            console.log(JSON.stringify(params));
            let param = "param=" + JSON.stringify(service.formatData(params));
            //发起请求
            return service.post(api.hotel, param).then((res) => {
                resolve(res);
            }).catch((error) => {
                console.log(error.msg);
                order_recordDao.addRecord({
                    order_record_type: '6',
                    order_id: order.order_id,
                    order_record_fail: error.msg
                });
                reject(error);
            });
        });
    },

    timingUpdateState: () => {
        console.log("开启酒店定时查单任务");
        const auto = schedule.scheduleJob('*/1 * * * *', () => {
            require('./orderService').searchOrderByState({product_id: '17,18,19', order_state: '7'}).then((res) => {
                const orders = res.data;
                return Promise.all(orders.map((order) => {
                    return service.searchorderdetail(order);
                }));
            }).then((res) => {
                res.forEach((result) => {
                    console.log(result);
                    const status = result.OrderStatus,
                        param = {product_id: '17', order_target_id: result.ID};
                    return require('./orderService').findOrderByTarget(param).then((rs) => {
                        const order = rs.data[0];
                        if (status == 2) {
                            param.order_state = '5';
                            order_recordService.addRecord({
                                order_record_type: '4',
                                order_id: order.order_id
                            });
                            return require('./orderService').updateOrderStateByTargetNo(param);
                        } else if (status == 3) {
                            param.order_state = '4';
                            param.order_no = order.order_no;
                            return require('./orderService').updateOrderStateByNo(param);
                        } else if (status == 6) {
                            order_recordService.addRecord({
                                order_record_type: '4',
                                order_id: order.order_id,
                                order_record_fail: result.Info || '失败'
                            });
                            return require('./payService').refundMethod(order);
                        } else if (status == 7) {
                            param.order_state = '8';
                            param.order_no = order.order_no;
                            return require('./orderService').updateOrderStateByNo(param);
                        }
                    });
                })
            }).catch((err) => {
                console.log(err)
            });
        });
    },

};
module.exports = service;