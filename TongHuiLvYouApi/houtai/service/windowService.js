const serviceMethod = require('../../utils/serviceCommon');
const windowDao = require('../../houtai/dao/windowDao');
const uuid = require('../../utils/uuid');
let tokenService = require('../../service/tokenService');


let service =
    {
        /**
         *添加橱窗信息
         *@param data handle:1(批量/删除后增加) 2：单个增加 类型(1,目的地 2,精选景点 3,主图 4,首页图片 5,酒店广告 6,机票广告 7,门票广告 8,火车票广告 9,意外险广告 10,航意险广告 11,旅游险广告 12,交通险广告 13,你可能想去橱窗)
         * @return {*}
         */
        addWindow: (data) => {
            return new Promise((resolve, reject) => {
                tokenService.queryUserIdByToken(data).then((result) => {
                    data.window_creator = result.user_id;
                    if (data.window_type == 1) {
                        data.type = 1;//目的地
                    }
                    if (data.window_type == 2) {
                        data.type = 2;//精选景点
                    }
                    if (data.window_type == 3) {
                        data.type = 3;//主图
                    }
                    if (data.window_type == 4) {
                        data.type = 4;//首页图片
                    }
                    if (data.window_type == 5) {
                        data.type = 5;//酒店广告
                    }
                    if (data.window_type == 6) {
                        data.type = 6;//机票广告
                    }
                    if (data.window_type == 7) {
                        data.type = 7;//门票广告
                    }
                    if (data.window_type == 8) {
                        data.type = 8;//火车票广告
                    }
                    if (data.window_type == 9) {
                        data.type = 9;//意外险广告
                    }
                    if (data.window_type == 10) {
                        data.type = 10;//航意险广告
                    }
                    if (data.window_type == 11) {
                        data.type = 11;//旅游险广告
                    }
                    if (data.window_type == 12) {
                        data.type = 12;//交通险广告
                    }
                    if (data.window_type == 13) {
                        data.type = 13;//你可能想去橱窗
                    }
                    if (data.window_type != 1 && data.window_type != 2 && data.window_type != 3 && data.window_type != 4 && data.window_type != 5 && data.window_type != 6 && data.window_type != 7 && data.window_type != 8 && data.window_type != 9 && data.window_type != 10 && data.window_type != 11 && data.window_type != 12 && data.window_type != 13) {
                        return Promise.reject({code: 2, msg: "参数错误！"});
                    }
                    if (data.handles == 1) {
                        //直接跳过
                        return "current";
                    }
                    return windowDao.findWindow(data);
                }).then((result2) => {
                    if (result2 == "current") {
                        //删除后批量增加
                        if (data.handles == 1) {
                            data.states = 2;//执行删除操作
                            return serviceMethod.delMethod(windowDao, "upWindow", data);
                        }
                        return Promise.reject({code: 2, msg: "参数错误！"});
                    }
                    if (result2.length > 0) {
                        return Promise.reject({code: 2, msg: "地点已存在"});
                    }
                }).then(() => {
                    //批量添加
                    if (data.handles == 1) {
                        try {
                            if (data.windows) {
                                let windows = JSON.parse(data.windows);
                                if (windows instanceof Array && windows.length > 0) {
                                    return Promise.all(windows.map(datas => {
                                        datas.window_id = uuid.createUUID();
                                        datas.window_creator = data.window_creator;
                                        return serviceMethod.addMethod(windowDao, "addWindow", datas);
                                    }));
                                }
                                return Promise.reject({code: 2, msg: "参数错误！"});
                            }
                        }
                        catch (err) {
                            return Promise.reject({code: 2, msg: "参数错误！"});
                        }
                    }
                    if (data.handles == 2) {
                        //单个添加
                        data.window_id = uuid.createUUID();
                        return resolve(serviceMethod.addMethod(windowDao, "addWindow", data));
                    }
                }).then((result) => {
                    resolve(result[0]);
                }).catch((error) => {
                    reject(error);
                })
            })
        },
        /**
         * 查询橱窗
         * @param data
         * @return {*}
         */
        searchWindow: (data) => {
            //  return serviceMethod.addMethod(windowDao, "searchWindow", data);
            return new Promise((resolve, reject) => {
                return serviceMethod.searchMethod(windowDao, "searchWindow", data).then((result) => {
                    data.counts = 1;
                    return serviceMethod.searchMethod(windowDao, "searchWindow", data).then((result2) => {
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
         * 操作橱窗信息
         * @param data
         * @return {*}
         */
        upWindow: (data) => {
            return new Promise((resolve, reject) => {
                windowDao.upWindow(data).then(() => {
                    resolve({code: 1, msg: "操作成功"});
                }).catch((error) => {
                    reject(error);
                })
            })
        },
        /**
         * 更改橱窗信息
         * @param data
         * @return {*}
         */
        updateWindow: (data) => {
            return serviceMethod.updateMethod(windowDao, "updateWindow", data);
        },
        /**
         * 查询所有橱窗信息 类型(1,目的地 2,精选景点 3,主图 4,首页图片 5,酒店广告 6,机票广告 7,门票广告 8,火车票广告 9,意外险广告 10,航意险广告 11,旅游险广告 12,交通险广告 13,你可能想去橱窗)
         * @param data
         * @return {*}
         */
        searchAllWindow: (data) => {
            return new Promise((resolve, reject) => {
                let destination;//目的地 1
                let spot;//精选景点 2
                let master_map;//主图 3
                let home_page_picture;//首页图片 4
                let hotel_advertising;//酒店图片 5
                let air_ticket_advertisement;//机票广告 6
                let ticket_advertising;//门票广告 7
                let train_ticket_advertising;//火车票广告 8
                let accident_insurance;//意外险广告 9
                let insurance_advertisement;//航意险广告 10
                let tourism_insurance;//旅游险广告 11
                let traffic_insurance_advertising;//交通险广告 12
                let other;//你可能想去的橱窗 13
                data.type = 1;//目的地
                return windowDao.searchAllWindow(data).then((result) => {
                    if (result) {
                        if (result.length > 0) {
                            destination = result;
                        }
                    }
                    data.type = 2;//精选景点
                    return windowDao.searchAllWindow(data);
                }).then((result2) => {
                    if (result2) {
                        if (result2.length > 0) {
                            spot = result2;
                        }
                    }
                    data.type = 3;//主图
                    return windowDao.searchAllWindow(data);
                }).then((result3) => {
                    if (result3) {
                        if (result3.length > 0) {
                            master_map = result3;
                        }
                    }
                    data.type = 4;//首页图片
                    return windowDao.searchAllWindow(data);
                }).then((result4) => {
                    if (result4) {
                        if (result4.length > 0) {
                            home_page_picture = result4;
                        }
                    }
                    data.type = 5;//酒店图片
                    return windowDao.searchAllWindow(data);
                }).then((result5) => {
                    if (result5) {
                        if (result5.length > 0) {
                            hotel_advertising = result5;
                        }
                    }
                    data.type = 6;//机票广告
                    return windowDao.searchAllWindow(data);
                }).then((result6) => {
                    if (result6) {
                        if (result6.length > 0) {
                            air_ticket_advertisement = result6;
                        }
                    }
                    data.type = 7;//门票广告
                    return windowDao.searchAllWindow(data);
                }).then((result7) => {
                    if (result7) {
                        if (result7.length > 0) {
                            ticket_advertising = result7;
                        }
                    }
                    data.type = 8;//火车票广告
                    return windowDao.searchAllWindow(data);
                }).then((result8) => {
                    if (result8) {
                        if (result8.length > 0) {
                            train_ticket_advertising = result8;
                        }
                    }
                    data.type = 9;//意外险广告
                    return windowDao.searchAllWindow(data);
                }).then((result9) => {
                    if (result9) {
                        if (result9.length > 0) {
                            accident_insurance = result9;
                        }
                    }
                    data.type = 10;//航意险广告
                    return windowDao.searchAllWindow(data);
                }).then((result10) => {
                    if (result10) {
                        if (result10.length > 0) {
                            insurance_advertisement = result10;
                        }
                    }
                    data.type = 11;//旅游险广告
                    return windowDao.searchAllWindow(data);
                }).then((result11) => {
                    if (result11) {
                        if (result11.length > 0) {
                            tourism_insurance = result11;
                        }
                    }
                    data.type = 12;//交通险广告
                    return windowDao.searchAllWindow(data);
                }).then((result12) => {
                    if (result12) {
                        if (result12.length > 0) {
                            traffic_insurance_advertising = result12;
                        }
                    }
                    data.type = 13;//其他
                    return windowDao.searchAllWindow(data);
                }).then((result13) => {
                    if (result13) {
                        if (result13.length > 0) {
                            other = result13;
                        }
                    }
                    //判断全部是否为空
                    if (!destination && !spot && !master_map && !home_page_picture && !hotel_advertising && !air_ticket_advertisement && !ticket_advertising && !train_ticket_advertising && !accident_insurance && !insurance_advertisement && !tourism_insurance && !traffic_insurance_advertising && !other) {
                        return Promise.reject({code: 2, msg: "查询无记录"});
                    }
                    //封住数据
                    let results;//数据集合
                    let code = {code: 1, msg: "查询成功"};
                    let values = {
                        destination,
                        spot,
                        master_map,
                        home_page_picture,
                        hotel_advertising,
                        air_ticket_advertisement,
                        ticket_advertising,
                        train_ticket_advertising,
                        accident_insurance,
                        insurance_advertisement,
                        tourism_insurance,
                        traffic_insurance_advertising,
                        other
                    };
                    results = code;
                    results.data = values;
                    resolve(results);
                }).catch((err) => {
                    reject(err);
                })
            })
        },

        /**
         * 添加去哪儿橱窗
         * @param data
         * @returns {Promise}
         */
        addPlace: (data) => {
            data.place_id = uuid.createUUID();
            return new Promise((resolve, reject) => {
                //通过TOKEN拿到
                tokenService.queryUserIdByToken(data).then((result) => {
                    data.place_creator = result.user_id;
                    //添加地点
                    return serviceMethod.addMethod(windowDao, "addPlace", data).then((placeResult) => {
                        data.windowList = JSON.parse(data.windowList);
                        //循环添加地点图片
                        const promise = data.windowList.map((item) => {
                            return new Promise((resolve1) => {
                                item.window_id = uuid.createUUID();
                                return windowDao.addPlaceWindow(item, data).then(() => {
                                    resolve1()
                                })
                            })
                        });
                        Promise.all(promise).then(() => {
                            resolve(placeResult);
                        })
                    })
                })
            })
        },

        /**
         * 修改去哪儿橱窗
         * @param data
         * @returns {Promise}
         */
        updatePlace: (data) => {
            return new Promise((resolve, reject) => {
                //通过TOKEN拿到
                tokenService.queryUserIdByToken(data).then((result) => {
                    data.place_creator = result.user_id;
                    //修改地点
                    return serviceMethod.updateMethod(windowDao, "updatePlace", data).then((placeResult) => {
                        data.windowList = JSON.parse(data.windowList);
                        //删除地点图片
                        return windowDao.delPlaceWindow(data).then(()=>{
                            //循环添加地点图片
                            const promise = data.windowList.map((item) => {
                                return new Promise((resolve1) => {
                                    item.window_id = uuid.createUUID();
                                    return windowDao.addPlaceWindow(item, data).then(() => {
                                        resolve1()
                                    })
                                })
                            });
                            Promise.all(promise).then(() => {
                                resolve(placeResult);
                            })
                        });
                    })
                })
            })
        },

        /**
         * 查看地点
         * @param data
         * @return {*}
         */
        searchPlace: (data) => {
            return new Promise((resolve, reject) => {
                return serviceMethod.searchMethod(windowDao, "searchPlace", data).then((result) => {
                    data.counts = 1;
                    return serviceMethod.searchMethod(windowDao, "searchPlaceCount", data).then((result2) => {
                        result.count = result2.data.length;
                        const promise = result.data.map((item)=>{
                            return new Promise((resolve1)=>{
                                windowDao.searchPlaceWindow(item).then((result1)=>{
                                    item.windowList = result1;
                                    resolve1();
                                })
                            })
                        });
                        Promise.all(promise).then(()=>{
                            resolve(result);
                        })
                    }, err => {
                        reject(err);
                    })
                }, err => {
                    reject(err);
                })
            })
        },
    };


module.exports = service;