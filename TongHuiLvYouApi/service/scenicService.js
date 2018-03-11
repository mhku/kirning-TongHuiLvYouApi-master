const xml2js = require('xml2js');
const builder = new xml2js.Builder();
const parseString = xml2js.parseString;
const schedule = require('node-schedule');
const moment = require('moment');
const md5 = require('blueimp-md5');
const urlencode = require('urlencode');
const config = require('../utils/config').scenic;
const api = require('../utils/api').scenic;
const request = require('../utils/request');
const returnUtil = require('../utils/returnUtil');
const serviceCommon = require('../utils/serviceCommon');
const orderNo = require('../utils/orderNo');
const uuid = require('../utils/uuid');
const orderService = require('./orderService');
const touristService = require('./touristService');
const tokenService = require('./tokenService');
const scenicDao = require('../dao/scenicDao');
const collectionDao = require('../dao/collectionDao');
const order_recordDao = require('../dao/order_recordDao');

/**
 * 去除xml规范
 * @param param
 */
const replaceXmlStandard = (param) => {
    //<![CDATA[北京]]>
    const reg = /\!\[CDATA\[.*|\\n*\]\]/;
    //数组
    if (param instanceof Array) {
        let params = param;
        params.forEach((item, i) => {
            param[i] = replaceXmlStandard(item);
        });
    } else if (typeof param == 'object') {  //对象/JSON
        for (let key in param) {
            param[key] = replaceXmlStandard(param[key]);
        }
    } else if (typeof param == 'string') {    //字符串
        if (reg.test(param)) {
            param = param.substring(9, param.length - 3);
        }
    }
    return param;
};

const service = {

    /**
     * 统一请求
     * @param uri
     * @param data
     * @param fun
     * @returns {Promise}
     */
    post: (uri, data, format) => {
        return new Promise((resolve, reject) => {
            //分销商 code
            data.appKey = config.appKey;
            //请求格式 JSON
            data.messageFormat = format ? format : 'json';
            //时间戳
            const timestamp = new Date().getTime();
            data.timestamp = timestamp;
            // config.secret = 'fc50ffee10a40321891a1e006e5931cb';
            //验签
            data.sign = md5(config.secret + timestamp + config.secret);
            let params = {
                url: uri,
                param: JSON.stringify(data)
            };
            request.post(uri, data, 'utf-8', "form").then((res) => {
                if (format == 'xml') {
                    return parseString(res, {explicitArray: false}, (err, result) => {
                        let state = result.response.state;
                        if (state.code === "1000") {
                            resolve(result.response);
                            console.log(result.response);
                            return;
                        }
                        reject({code: 2, msg: state.message});
                        return;
                    });
                } else {
                    res = JSON.parse(res);
                    console.log(res);
                }
                if (res.state.code === "1000") {
                    return resolve(res);
                }
                reject({code: 2, msg: res.state.message});
                console.log(res);
            }).catch((err) => {
                reject({code: 3, msg: err.message});
            });
        });
    },

    plPost: (uri, data, param) => {
        return new Promise((resolve, reject) => {
            //分销商 code
            data.appKey = config.appKey;
            //请求格式 JSON
            data.messageFormat = 'json';
            //时间戳
            const timestamp = new Date().getTime();
            data.timestamp = timestamp;
            //验签
            data.sign = md5(config.secret + timestamp + config.secret);
            let params = {
                url: uri,
                param: JSON.stringify(data)
            };
            console.log("访问参数", JSON.stringify(data));
            //"http://116.62.129.226:3001/api/test/a"
            request.post(uri, data, 'utf-8', "form").then((res) => {
                res = JSON.parse(res);
                // console.log("第", data.currentPage, "页");
                // console.log(res);
                console.log("结果：", res);
                let result = {
                    data: [],
                    totalPage: 1
                };
                if (res.state.code === "1000") {
                    result.data = replaceXmlStandard(res[param]);
                    result.totalPage = res.totalPage;
                }
                resolve(result);
            }).catch((err) => {
                console.log(err);
            });
        });
    },

    /**
     * 批量景区基本信息接口
     * @param data
     * @param data.page 当前页
     * @returns {*}
     */
    scenicInfoListByPage(page) {
        return new Promise((resolve) => {
            service.plPost(api.scenicInfoListByPage, {currentPage: page}, "scenicNameList").then(re => {
                const totalPage = parseInt(re.totalPage);
                scenicDao.addScenicInfo(re.data).then(() => {
                    console.log(page);
                    if (page < totalPage) {
                        page++;
                        service.scenicInfoListByPage(page);
                    } else {
                        resolve({code: 1, msg: "成功"});
                    }
                });
            });
        });
    },

    /**
     * 批量产品/商品信息接口
     * @param data
     * @param data.page 当前页
     * @returns {*}
     */
    productInfoListByPage: (page) => {
        return new Promise((resolve) => {
            service.plPost(api.productInfoListByPage, {currentPage: page}, "productList").then(re => {
                const totalPage = parseInt(re.totalPage);
                scenicDao.addScenicProductInfo(re.data).then(() => {
                    console.log(page);
                    if (page < totalPage) {
                        page++;
                        service.productInfoListByPage(page);
                    } else {
                        resolve({code: 1, msg: "成功"});
                    }
                });
            });
        });
        // return new Promise((resolve, reject) => {
        //     const params = {
        //         //当前页数
        //         currentPage: 1,
        //     }, results = [];
        //     service.post(api.productInfoListByPage, params).then((res) => {
        //         results.push(scenicDao.addScenicProductInfo(replaceXmlStandard(res.productList)));
        //         let funArray = [];
        //         for (let i = 2; i <= parseInt(res.totalPage); i++) {
        //             funArray.push(service.post(api.productInfoListByPage, {currentPage: i}));
        //         }
        //         return Promise.all(funArray);
        //         return scenicDao.addScenicProductInfo(res.productList);
        //     }).then((res) => {
        //         res.forEach((info) => {
        //             let val = replaceXmlStandard(info.productList);
        //             results.push(scenicDao.addScenicProductInfo(val));
        //         });
        //         return Promise.all(results);
        //     }).then((res) => {
        //         resolve({code: 1, msg: "成功"});
        //     }).catch((err) => {
        //         reject(err);
        //     });
        // });
    },

    /**
     * 批量价格/库存信息接口
     * @param data
     * @param data.page 当前页
     * @returns {*}
     */
    productPriceListByPage: (page) => {
        console.log("接口到了");
        return service.priceList(page);
        // return new Promise((resolve) => {
        //     const now = moment(), params = {
        //         //当前页数
        //         currentPage: page,
        //         //开始时间
        //         beginDate: now.format("YYYY-MM-DD"),
        //         //结束时间
        //         endDate: now.month(now.get('month') + 1).format("YYYY-MM-DD")
        //     };
        //     return service.plPost(api.productPriceListByPage, params, "priceList").then(re => {
        //         const totalPage = parseInt(re.totalPage);
        //         if (page < totalPage) {
        //             page++;
        //             if (re.data && re.data.length > 0) {
        //                 re.data.forEach((re1) => {
        //                     re1.goodsList.goods.forEach((re2) => {
        //                         service.goodPriceList(re2);
        //                     });
        //                 });
        //                 return service.productPriceListByPage(page);
        //             }
        //         }else {
        //             resolve({code: 1, msg: "成功"});
        //         }
        //         // return scenicDao.addScenicGood(re.data).then(() => {
        //         //     console.log(page);
        //         //     if (page < totalPage) {
        //         //         page++;
        //         //     } else {
        //         //         resolve({code: 1, msg: "成功"});
        //         //     }
        //         // }).catch((err) => {
        //         //     console.log(err);
        //         // });
        //     });
        // });
        // return new Promise((resolve, reject) => {
        //     const params = {
        //         //当前页数
        //         currentPage: 1,
        //         //开始时间
        //         beginDate: moment().format("YYYY-MM-DD"),
        //         //结束时间
        //         endDate: moment().add('d', 1).format("YYYY-MM-DD")
        //     }, results = [];
        //     service.post(api.productPriceListByPage, params).then((res) => {
        //         results.push(scenicDao.addScenicGood(replaceXmlStandard(res.priceList)));
        //         let funArray = [];
        //         for (let i = 2; i <= parseInt(res.totalPage); i++) {
        //             params.currentPage = i;
        //             funArray.push(service.post(api.productPriceListByPage, params));
        //         }
        //         return Promise.all(funArray);
        //     }).then((res) => {
        //         res.forEach((info) => {
        //             let val = replaceXmlStandard(info.priceList);
        //             results.push(scenicDao.addScenicGood(val));
        //         });
        //         return Promise.all(results);
        //     }).then((res) => {
        //         resolve({code: 1, msg: "成功"});
        //     }).catch((err) => {
        //         reject(err);
        //     });
        // });
    },

    /**
     * 批量价格集合
     * @param page
     * @returns {Promise}
     */
    priceList: (page = 1) => {
        let total_page = 0;
        return new Promise((resolve, reject) => {
            scenicDao.searchAllGoods({count: 1}).then((res) => {
                total_page = res[0].good_count % 50 == 0 ? res[0].good_count / 50 : parseInt(res[0].good_count / 50) + 1;
                if (page <= total_page) {

                    return scenicDao.searchAllGoods({page: page});
                } else {
                    return Promise.resolve({code: 1, msg: "成功"});
                }
            }).then((goods) => {
                if (!goods) {
                    resolve({code: 1, msg: "成功"});
                } else {
                    const begin = moment();
                    const params = {
                        //产品ID
                        goodsIds: '',
                        //产品开始时间
                        beginDate: begin.format('YYYY-MM-DD'),
                        //产品结束时间
                        endDate: begin.add('month', 1).format('YYYY-MM-DD'),
                    };
                    let prices = [];
                    return Promise.all(goods.map((good) => {
                        params.goodsIds = good.goodsIds;
                        return service.findPrice(params);
                    })).then((res) => {
                        res.forEach((price) => {
                            prices = prices.concat(price);
                        });
                        return scenicDao.addGoodPrice2(prices);
                    }).then((res) => {
                        service.priceList(page + 1);
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            })
        })
    },

    /**
     * 调用第三发获取价格集合
     * @param params
     * @returns {Promise}
     */
    findPrice: (params) => {
        return new Promise((resolve, reject) => {
            service.post(api.goodPriceList, params).then((res) => {
                const priceList = replaceXmlStandard(res.priceList), prices = [];
                if (priceList) {
                    priceList.forEach((item) => {
                        if (item.goodsList && item.goodsList.goods) {
                            item.goodsList.goods.forEach((good1) => {
                                if (good1.prices && good1.prices.price) {
                                    good1.prices.price.forEach((price) => {
                                        price.goodsId = good1.goodsId;
                                        prices.push(price);
                                    });
                                }
                            })
                        }
                    })
                }
                resolve(prices)
            }).then((res) => {
                resolve({code: 1, msg: "成功"});
            }).catch((err) => {
                console.log(err);
                resolve({code: 1, msg: "成功"});
            })
        })
    },

    /**
     * 按 ID 获取产品信息接口
     * @param data
     * @param data.productIds 产品ID
     * @returns {*}
     */
    productInfoList: (data) => {
        return new Promise((resolve, reject) => {
            service.post(api.productInfoList, data).then((res) => {
                res.productList = replaceXmlStandard(res.productList);
                if (data.type === 2) {
                    return scenicDao.updateScenicProductInfo(res.productList);
                } else {
                    return scenicDao.addScenicProductInfo(res.productList);
                }
            }).then((res) => {
                const result = {
                    code: 1,
                    msg: "成功"
                };
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 按 ID 获取商品信息接口
     * @param data
     * @param data.goodsIds 商品ID
     * @returns {*}
     */
    goodInfoList: (data) => {
        return new Promise((resolve, reject) => {
            service.post(api.goodInfoList, data).then((res) => {
                res.goodsList = replaceXmlStandard(res.goodsList);
                if (data.type === 2) {
                    return scenicDao.updateScenicGood(res.goodsList);
                } else {
                    return scenicDao.addScenicGood(res.goodsList);
                }
                const result = {
                    code: 1,
                    data: res,
                    msg: "成功"
                };
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 按 ID 获取价格库存接口
     * @param data
     * @param data.goodsIds 商品ID
     * @param data.beginDate 开始时间
     * @param data.endDate 结束时间
     * @returns {*}
     */
    goodPriceList: (data) => {
        return new Promise((resolve, reject) => {
            const begin = moment();
            const params = {
                //产品ID
                goodsIds: data.goodsIds,
                //产品开始时间
                beginDate: begin.format('YYYY-MM-DD'),
                //产品结束时间
                endDate: begin.add('month', 1).format('YYYY-MM-DD'),
            };
            let priceList = [];
            service.post(api.goodPriceList, params).then((res) => {
                if (res.priceList) {
                    priceList = replaceXmlStandard(res.priceList);
                    return scenicDao.deleteGoodPrice({goodsIds: data.goodsIds.split(',')});
                } else {
                    return Promise.reject('');
                }
            }).then((res) => {
                return scenicDao.addGoodPrice(priceList);
            }).then((res) => {
                const result = {
                    code: 1,
                    data: res,
                    msg: "成功"
                };
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 按 ID 获取价格库存接口
     * @param data
     * @param data.goodsIds 商品ID
     * @param data.beginDate 开始时间
     * @param data.endDate 结束时间
     * @returns {*}
     */
    goodPriceList2: (data) => {
        return new Promise((resolve, reject) => {
            const begin = moment();
            const params = {
                //产品ID
                goodsIds: data.goodsIds,
                //产品开始时间
                beginDate: begin.format('YYYY-MM-DD'),
                //产品结束时间
                endDate: begin.add('month', 1).format('YYYY-MM-DD'),
            };
            let priceList = [];
            service.post(api.goodPriceList, params).then((res) => {
                if (res.priceList) {
                    priceList = replaceXmlStandard(res.priceList);
                    return scenicDao.addGoodPrice(priceList);
                } else {
                    return Promise.resolve('');
                }
            }).then((res) => {
                const result = {
                    code: 1,
                    data: res,
                    msg: "成功"
                };
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 按 ID 获取景区信息接口
     * @param data
     * @param data.scenicId 景区ID
     * @returns {*}
     */
    scenicInfoList: (data) => {
        return new Promise((resolve, reject) => {
            const params = {
                //景区ID
                scenicId: data.scenicId,
            };
            service.post(api.scenicInfoList, params).then((res) => {
                res.scenicNameList = replaceXmlStandard(res.scenicNameList);
                return scenicDao.addScenicInfo(res.scenicNameList);
            }).then((res) => {
                const result = {
                    code: 1,
                    data: res,
                    msg: "成功"
                };
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 创建订单
     * @param data
     * @returns {Promise}
     */
    createOrder: (data) => {
        const mOrderService = require('./orderService');
        console.log();
        return new Promise((resolve, reject) => {
            data.visitDate = moment(data.visitDate).format("YYYY-MM-DD");
            let params = {}, good_info = {}, sellPrice = 0, quantity = parseInt(data.quantity), orderAmount = 0,
                order_no = orderNo.createOrderNo(), visitDate = data.visitDate,
                order_user = [], order_paper = [];
            service.findGoodByIdAndDate(data).then((res) => {
                good_info = res.data[0];
                sellPrice = parseFloat(good_info.sellPrice);
                orderAmount = sellPrice * quantity;
                const booker = data.booker;
                // booker.name = urlencode.encode(booker.name, 'utf-8');
                data.travellers.forEach((trave) => {
                    // trave.name = urlencode.encode(trave.name, 'utf-8');
                    order_user.push(trave.name);
                    order_paper.push(trave.credentials);
                });
                order_user = order_user.join(",");
                order_paper = order_paper.join(",");
                params = {
                    orderInfo: {
                        // sessionId: good_info.placeId,
                        partnerOrderNo: order_no,
                        orderAmount: orderAmount / 100,
                        product: {
                            productId: good_info.productId,
                            goodsId: good_info.goodsId,
                            quantity: quantity,
                            sellPrice: sellPrice / 100,
                            visitDate: visitDate
                        },
                        booker: data.booker,
                        travellers: {traveller: data.travellers}
                    }
                };
                if (data.expressage) params.orderInfo.expressage = data.expressage;
                return service.post(api.validateOrder, {request: builder.buildObject({request: params})}, 'xml');
            }).then((res) => {
                return service.post(api.createOrder, {request: builder.buildObject({request: params})}, 'xml');
            }).then((res) => {
                res.order = replaceXmlStandard(res.order);
                const order = {
                    order_id: uuid.createUUID(),
                    order_no: order_no,
                    order_target_id: res.order.orderId,
                    product_id: '20',
                    order_amount: orderAmount,
                    order_price: sellPrice,
                    order_telephone: data.booker.mobile || "",
                    order_mailbox: data.booker.email || "",
                    order_destination: good_info.mainName,
                    order_departure_datetime: visitDate,
                    order_safe_state: '0',
                    order_safe_price: 0,
                    order_count: quantity,
                    order_title: good_info.goodsName,
                    order_company_name: good_info.productName,
                    user_id: data.user_id,
                    order_user: order_user,
                    order_paper: order_paper
                };
                //添加订单
                return mOrderService.addOrder([order]);
            }).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 订单校验
     * @param data
     * @returns {Promise}
     */
    validateOrder: (data) => {
        return new Promise((resolve, reject) => {
            data.visitDate = moment(data.visitDate).format("YYYY-MM-DD");
            let params = {}, good_info = {}, sellPrice = 0, quantity = parseInt(data.quantity), orderAmount = 0,
                order_no = orderNo.createOrderNo(), visitDate = data.visitDate,
                order_user = [];
            service.findGoodByIdAndDate(data).then((res) => {
                good_info = res.data[0];
                sellPrice = parseFloat(good_info.sellPrice);
                orderAmount = sellPrice * quantity;
                const booker = data.booker;
                // booker.name = urlencode(booker.name);
                data.travellers.forEach((trave) => {
                    // trave.name = urlencode(trave.name);
                    order_user.push(trave.name);
                });
                order_user = order_user.join(",");
                params = {
                    orderInfo: {
                        // sessionId: good_info.placeId,
                        partnerOrderNo: order_no,
                        orderAmount: orderAmount / 100,
                        product: {
                            productId: good_info.productId,
                            goodsId: good_info.goodsId,
                            quantity: quantity,
                            sellPrice: sellPrice / 100,
                            visitDate: visitDate
                        },
                        booker: data.booker,
                        travellers: {traveller: data.travellers}
                    }
                };
                if (data.expressage) params.orderInfo.expressage = data.expressage;
                return service.post(api.createOrder, {request: builder.buildObject({request: params})}, 'xml');
            }).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 订单支付
     * @param data
     * @returns {Promise}
     */
    orderPayment: (data) => {
        return new Promise((resolve, reject) => {
            const params = {
                order: {
                    partnerOrderNo: data.order_no,
                    orderId: data.order_target_id,
                    serialNum: uuid.createUUID(),
                }
            };
            //订单支付
            return service.post(api.orderPayment, {request: builder.buildObject({request: params})}, 'xml').then((res) => {
                resolve({code: 1, msg: "支付成功"});
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 重发凭证接口
     * @param data
     * @returns {Promise}
     */
    resendCode: (data) => {
        return new Promise((resolve, reject) => {
            const params = {
                order: {
                    partnerOrderNo: data.order_no,
                    orderId: data.order_target_id,
                    serialNum: uuid.createUUID(),
                }
            };
            orderService.findOrderById(data).then((res) => {
                let order = res.data[0];
                params.order.partnerOrderNo = order.order_no;
                params.order.orderId = order.order_target_id;
                //重发凭证接口
                return service.post(api.resendCode, {request: builder.buildObject({request: params})}, 'xml');
            }).then((res) => {
                resolve({code: 1, msg: "成功"});
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    },

    /**
     * 申请退款接口
     * @param data
     * @returns {Promise}
     */
    orderCancel: (order) => {
        return new Promise((resolve, reject) => {
            const params = {
                PartnerOrderNo: order.order_no,
                orderId: order.order_target_id
            };
            service.post(api.orderCancel, params).then((res) => {
                res.order = replaceXmlStandard(res.order);
                if (res.order.requestStatus === 'REJECT') {
                    const param = {
                        order_state: 8,
                        order_reason: res.order.refundInfo,
                        order_no: order.order_no
                    };
                    require('./orderService').updateOrderStateByNo(param).then((res1) => {
                        reject({code: 2, msg: "退款失败"});
                    }).catch((err) => {
                        reject({code: 3, msg: err.message});
                    });
                } else {
                    resolve({code: 1, msg: "退款成功", data: res});
                }
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 订单查询接口
     * @param data
     * @returns {Promise}
     */
    getOrderInfo: (data) => {
        return new Promise((resolve, reject) => {
            const params = {
                order: {
                    partnerOrderNos: data.partnerOrderNos
                }
            };
            //重发凭证接口
            service.post(api.getOrderInfo, {request: builder.buildObject({request: params})}, 'xml').then((res) => {
                res.order = replaceXmlStandard(res.order);
                resolve({code: 1, data: res, msg: "成功"});
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    },

    /**
     * 根据景区查找产品
     * @param data
     * @returns {*|Promise}
     */
    searchScenicProducts: (data) => {
        data.start = (parseInt(data.page) - 1) * parseInt(data.size);
        return serviceCommon.searchMethod(scenicDao, "searchScenicProducts", data);
    },

    /**
     * 产品上下线
     * @param data
     * @returns {*}
     */
    updteProduceOnLine: (data) => {
        return scenicDao.updteProduceOnLine(data);
    },

    /**
     * 商品上下线
     * @param data
     * @returns {*}
     */
    updteGoodOnLine: (data) => {
        return scenicDao.updteGoodOnLine(data);
    },

    /**
     * 产品推送接口
     * @param data
     * @returns {Promise}
     */
    pushProductChangeInfo: (data) => {
        let changeType = data.body.changeType;
        let signed = data.header.signed, sign = md5(config.secret + changeType);
        // if (signed != sign) {
        //     return Promise.reject({code: 1001, msg: "验签错误"});
        // }
        const product = data.body.product;
        if (changeType == 'product_create') {   //新增产品
            const param = {
                productIds: product.productId,
                type: 1
            };
            return service.productInfoList(param);
        } else if (changeType == 'product_info_change') {   //产品信息变更
            const param = {
                productIds: product.productId,
                type: 2
            };
            return service.productInfoList(param);
        } else if (changeType == 'product_online') {    //产品上线
            const param = {
                productIds: product.productId.split(','),
                productStatus: 'true'
            };
            return service.updteProduceOnLine(param);
        } else if (changeType == 'product_offline') {   //产品下线
            const param = {
                productIds: product.productId.split(','),
                productStatus: 'false'
            };
            return service.updteProduceOnLine(param);
        } else if (changeType == 'goods_create') {  //新增商品
            const param = {
                goodsIds: product.goodsId,
                type: 1
            };
            return service.goodInfoList(param);
        } else if (changeType == 'goods_info_change') { //商品信息变更
            const param = {
                goodsIds: product.goodsId,
                type: 2
            };
            return service.goodInfoList(param);
        } else if (changeType == 'goods_online') {  //商品上线
            const param = {
                goodsIds: product.goodsId.split(','),
                goodsOnLine: 'true'
            };
            return service.updteGoodOnLine(param);
        } else if (changeType == 'goods_offline') { //商品下线
            const param = {
                goodsIds: product.goodsId.split(','),
                goodsOnLine: 'false'
            };
            return service.updteGoodOnLine(param);
        } else if (changeType == 'price_change') {  //时间价格表变更
            const param = {
                goodsIds: product.goodsId
            }
            return service.goodPriceList(param);
        }
    },

    /**
     * 退款接口推送
     * @param data
     * @returns {*}
     */
    pushOrderCancel: (data) => {
        let changeType = data.body.changeType;
        let signed = data.header.signed, sign = md5(config.secret + changeType);
        // if (signed != sign) {
        //     return Promise.reject({code: 1001, msg: "验签错误"});
        // }
        const order = data.body.order;
        if (order.requestStatus === 'PASS') {
            data.order_state = '4';
            return require('./orderService').updateOrderStateByID(data).then((res) => {
                return Promise.resolve({code: 1000, msg: "接收成功"})
            }).catch((err) => {
                console.log(err, message);
                return Promise.resolve({code: 1000, msg: "接收成功"})
            });
        }
        return Promise.resolve({code: 1000, msg: "接收成功"})
    },

    /**
     * 订单推送
     * @param data
     * @returns {*}
     */
    pushOrder: (data) => {
        return new Promise((resolve, reject) => {
            let order = data.body.order,
                signed = data.header.signed,
                sign = md5(config.secret + order.orderId),
                payTime = moment().format("YYYY-MM-DD HH:mm:ss"),
                orderInfo = {};
            // if (signed != sign) {
            //     return Promise.reject({code: 1001, msg: "验签错误"});
            // }
            if (order.status == 'NORMAL' && order.paymentStatus == "PAYED") {
                return require('./orderService').findOrderByTarget({
                    order_target_id: order.orderId,
                    product_id: '20'
                }).then((res) => {
                    orderInfo = res.data[0];
                    order_recordDao.addRecord({order_record_type: '4', order_id: orderInfo.order_id});
                    return require('./orderService').orderPay({
                        order_id: orderInfo.order_id,
                        order_payTime: payTime,
                        order_state: 2
                    });
                }).then((res) => {
                    resolve({code: 1000, msg: "接收成功"})
                }).catch((err) => {
                    console.log(err);
                    reject({code: 1001, msg: "接收失败"});
                })
            } else {
                // order_recordDao.addRecord({order_record_type: '6', order_id: orderInfo.order_id, order_record_fail: ""});
            }
            resolve({code: 1000, msg: "接收成功"});
        });
    },

    /**
     * 根据出游时间及ID获取商品信息
     * @param data
     * @returns {*|Promise}
     */
    findGoodByIdAndDate: (data) => {
        return serviceCommon.searchMethod(scenicDao, "findGoodById", data);
    },

    /**
     * 根据产品ID获取商品信息
     * @param data
     * @returns {*|Promise}
     */
    findGoodByProductId: (data) => {
        return new Promise((resolve, reject) => {
            serviceCommon.searchMethod(scenicDao, "findGoodByProductId", data).then((res) => {
                res.data = {
                    collection_id: null,
                    data: res.data
                };
                if (data.token) {
                    tokenService.queryUserIdByToken(data).then((res1) => {
                        res1.id = data.productId;
                        res1.collection_classification = '2';
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
            })
        });
    },

    /**
     * 查找产品ID
     * @param data
     * @returns {*|Promise}
     */
    findProductById: (data) => {
        return serviceCommon.searchMethod(scenicDao, "findProductById", data);
    },

    /**
     * 根据商品ID获取价格信息
     * @param data
     * @returns {*|Promise}
     */
    findPriceByGoodId: (data) => {
        return serviceCommon.searchMethod(scenicDao, "findPriceByGoodId", data);
    }
};
module.exports = service;