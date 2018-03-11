/**
 * Created by Administrator on 2017/8/25.
 */
const md5 = require('blueimp-md5');
const moment = require('moment');
const crypto = require('crypto');
const serviceMethod = require('../utils/serviceCommon');
const request = require('../utils/request');
const req = require('request');
const config = require('../utils/config').user;
const api = require('../utils/api').user;
const userDao = require('../dao/userDao');
const tokenService = require('../service/tokenService');
const tokenDao = require('../dao/tokenDao');
const uuid = require('../utils/uuid');
const wechatUtil = require('../utils/pay/wechatUtil');
const orderService = require('./orderService');
const luck_drawService = require('./luck_drawService');

const service = {

    /**
     * 添加用户
     * @param data
     * @returns {*}
     */
    addUser: (data) => {
        return new Promise((resolve, reject) => {
            serviceMethod.searchMethod(userDao, 'findUser', data).then(val => {
                reject({
                    code: 2,
                    msg: '用户已存在'
                });
            }, err => {
                if (err.code == 2) {
                    data.user_id = uuid.createUUID();
                    return serviceMethod.addMethod(userDao, 'addUser', data);
                }
                reject(err);
            }).then(val => {
                resolve(val);
            }, err => {
                reject(err);
            });
        });
        // return serviceMethod.addMethod(userDao, 'addUser', data);
        // return new Promise((resolve, reject)=>{
        //
        // });
    },

    /**
     * 删除用户
     * @param data
     * @returns {*}
     */
    delUser: (data) => {
        return new Promise((resolve, reject) => {
            serviceMethod.searchMethod(userDao, 'findUser', data).then(val => {
                return serviceMethod.delMethod(userDao, 'delUser', data);
            }, err => {
                if (err.code == 2) {
                    err.msg = '用户不存在';
                }
                reject(err);
            }).then(val => {
                resolve(val);
            }, err => {
                reject(err);
            });
        });
    },

    /**
     * 修改用户
     * @param data
     * @returns {*}
     */
    updateUser: (data) => {
        return new Promise((resolve, reject) => {
            tokenService.queryUserIdByToken(data).then(val => {
                data.user_id = val.data[0].user_id;
                return serviceMethod.updateMethod(userDao, 'updateUser', data);
            }, err => {
                reject(err);
            }).then(val => {
                resolve(val);
            }, err => {
                reject(err);
            });
        });
    },

    /**
     * 查询用户
     * @param data
     * @returns {*}
     */
    findUser: (data) => {
        return new Promise((resolve, reject) => {
            tokenService.queryUserIdByToken(data).then(val => {
                data.user_id = val.data[0].user_id;
                return serviceMethod.searchMethod(userDao, 'findUser', data);
            }, err => {
                reject(err);
            }).then(val => {
                resolve(val);
            }, err => {
                reject(err);
            });
        });
    },

    /**
     * 根据姓名查找用户
     * @param data
     * @returns {*}
     */
    findUserByName: (data) => {
        return serviceMethod.searchMethod(userDao, "findUserByName", data);
    },

    /**
     * 用户统一请求返回
     * @param api
     * @param data
     * @param msg
     * @returns {Promise}
     */
    userPost: (url, data, msg) => {
        return new Promise((resolve, reject) => {
            request.post(url, data, 'utf-8').then((res) => {
                try {
                    res = JSON.parse(res);
                    if (res.errno == 0) {
                        resolve({code: 1, data: res, msg: msg});
                    } else {
                        reject({code: 2, msg: res.error});
                    }
                } catch (err) {
                    console.log(err.error);
                    return reject({code: 3, msg: res});
                }
            }).catch((err) => {
                return {code: 3, msg: err.error};
            });
        });
    },

    /**
     * 普通用户登录
     * @param data
     * @returns {Promise}
     * @constructor
     */
    userLogin: (data) => {
        // return Promise.resolve({
        //     code: 1,
        //     msg: "登陆成功",
        //     data: {
        //         token: "fba913f1e5fb3a493568d468cddbf107",
        //         user_name: 'node'
        //     }
        // });
        return new Promise((resolve, reject) => {
            let userInfo = {}, user_id = uuid.createUUID(), token_id = uuid.createUUID();
            const param = {
                username: data.username,
                password: data.password
            };
            let sign = wechatUtil.raw(param) + '&key=' + config.login_key;
            param.sign = (md5(sign) + '').toUpperCase();
            //获取access_token
            service.getAccess_token().then((res) => {
                let uri = api.login + res;
                //登录
                return service.userPost(uri, param, "登陆成功");
            }).then((res) => {
                //获取用户信息
                return service.getUserInfo(res.data.token);
            }).then((res) => {
                userInfo = res.data;
                return userDao.findUserByThToken({th_token: userInfo.token});
            }).then((res) => {
                if (res.length > 0) {
                    user_id = res[0].user_id;
                    return {code: 1};
                }
                const data1 = {
                    user_id: user_id,
                    th_token: userInfo.token,
                    user_name: userInfo.username,
                    user_phone: userInfo.mobile
                };
                return serviceMethod.addMethod(userDao, 'addUser', data1);
            }).then((res) => {
                return tokenDao.queryTokenByUser({user_id});
            }).then((res) => {
                const token = {
                    user_id: user_id,
                    token: token_id
                };
                if (res.length > 0) {
                    return tokenService.updateToken(token);
                } else {
                    return tokenService.addToken(token);
                }
            }).then((res) => {
                return luck_drawService.addLuckDraw({user_id});
            }).then((res) => {
                const result = {
                    code: 1,
                    msg: "登陆成功",
                    data: {
                        token: token_id,
                        user_name: userInfo.username
                    }
                };
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 普通用户登录
     * @param data
     * @returns {Promise}
     * @constructor
     */
    // userLogin: (data) => {
    //     return new Promise((resolve, reject) => {
    //         const param = {
    //             admin_name: data.username,
    //             admin_password: md5(data.password + 'linglan'),
    //         };
    //         let loginResult = {};
    //         userDao.userLogin(param).then((res) => {
    //             loginResult = res[0];
    //             if (res && res.length > 0) {
    //                 return tokenDao.queryTokenByUser({user_id: loginResult.user_id});
    //             }
    //             reject({code: 2, msg: "账号或密码错误"});
    //         }).then((res) => {
    //             loginResult.token = uuid.createUUID();
    //             if (res && res.length > 0) {
    //                 return tokenService.updateToken(loginResult);
    //             } else {
    //                 return tokenService.addToken(loginResult);
    //             }
    //         }).then((res) => {
    //             res.msg = "登陆成功";
    //             res.data = {
    //                 user_name: loginResult.user_name,
    //                 token: loginResult.token,
    //             };
    //             resolve(res);
    //         }).catch((err) => {
    //             reject(err);
    //         });
    //     });
    // },

    /**
     * 普通用户注册
     * @param data
     * @returns {Promise}
     * @constructor
     */
    userRegister: (data) => {
        return new Promise((resolve, reject) => {
            const param = {
                username: data.username,
                password: data.password,
                mobile: data.mobile,
                payword: data.payword,
            };
            service.getAccess_token().then((res => {
                let uri = api.register + res;
                return service.userPost(uri, param, "注册成功");
            })).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 普通用户注册
     * @param data
     * @returns {Promise}
     * @constructor
     */
    // userRegister: (data) => {
    //     return new Promise((resolve, reject) => {
    //         const param = {
    //             admin_id: uuid.createUUID(),
    //             user_id: uuid.createUUID(),
    //             user_name: data.username,
    //             admin_password: md5(data.password + 'linglan'),
    //             admin_contact: data.mobile,
    //         };
    //         userDao.findUserByName(param).then((res) => {
    //             if (res.length > 0) {
    //                 return reject({code: 2, msg: "用户名已存在"});
    //             }
    //             return serviceMethod.addMethod(userDao, "userRegister", param);
    //         }).then((res) => {
    //             resolve({code: 1, msg: "注册成功"});
    //         }).catch((err) => {
    //             reject({code: 3, msg: err.message});
    //         });
    //     });
    // },

    /**
     * 获取用户信息
     * @param data
     * @returns {*|Promise}
     */
    getUserInfo: (toekn) => {
        return new Promise((resolve, reject) => {
            const param = {
                token: toekn
            };
            service.getAccess_token().then((res) => {
                let uri = api.userInfo + res;
                return service.userPost(uri, param, "获取成功");
            }).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 获取用户信息
     * @param data
     * @returns {Promise}
     */
    getUser: (data) => {
        return new Promise((resolve, reject) => {
            serviceMethod.searchMethod(userDao, 'findUser', data).then((res) => {
                return service.getUserInfo(res.data[0].th_token);
            }).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 余额支付
     * @param data
     * @returns {*|Promise}
     */
    lifePay: (data) => {
        return new Promise((resolve, reject) => {
            let order = {}, user = {};
            userDao.findUser(data).then((res) => {
                user = res[0];
                return orderService.findOrderById(data);
            }).then((res) => {
                order = res.data[0];
                if (order.order_state == 2) {
                    return Promise.reject({code: 2, msg: "此订单已支付"});
                }
                return service.getAccess_token();
            }).then((res) => {
                const param = {
                    token: user.th_token,
                    out_trade_no: order.order_no,
                    total_amount: order.order_amount,
                    payword: data.payword
                };
                let sign = wechatUtil.raw(param) + '&key=' + config.payKey;
                param.sign = (md5(sign) + '').toUpperCase();
                let uri = api.lifePay + res;
                return service.userPost(uri, param, "支付成功");
            }).then((res) => {
                let params = {
                    order_amount: order.order_amount,
                    user_id: order.order_creator,
                };
                luck_drawService.addLuckDrawCount(params);
                resolve(res);
            }).catch((err) => {
                reject(err);
            })
        });
    },

    // userLogin: (data) => {
    //     return new Promise((resolve, reject) => {
    //         data.token = uuid.createUUID();
    //         serviceMethod.searchMethod(userDao, 'findUserByName', data).then(val => {
    //             if (data.user_password == val.data[0].user_password) {
    //                 data.user_id = val.data[0].user_id;
    //                 return tokenService.queryUserIdByToken(data);
    //             } else {
    //                 val.msg = '密码错误';
    //                 reject(val);
    //             }
    //         }, err => {
    //             if (err.code == 2) {
    //                 err.msg = '用户名不存在';
    //             }
    //             reject(err);
    //         }).then(val => {
    //             return tokenService.updateToken(data);
    //         }, err => {
    //             if (err.code == 2) {
    //                 return tokenService.addToken(data);
    //             }
    //             reject(err);
    //         }).then(val => {
    //             val.msg = '登陆成功';
    //             resolve(val);
    //         }, err => {
    //             if (err.code == 2) {
    //                 err.msg = '登录失败'
    //             }
    //             reject(err);
    //         });
    //     });
    // },
    /**
     * 获取线上的access_token
     * @returns {Promise}
     */
    access_token: () => {
        return new Promise((resolve, reject) => {
            const param = {
                appid: config.appid,
                secret: config.secret
            }, now = moment().format("YYYY-MM-DD HH:mm:ss");
            let data = {};
            service.userPost(api.access_token, param, "获取成功").then((res) => {
                data = res.data;
                data.createTime = now;
                data.updateTime = now;
                return userDao.updateAccess_token(data);
            }).then((res) => {
                resolve(data.access_token);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 修改的access_token
     * @returns {Promise}
     */
    refresh_token: (param) => {
        return new Promise((resolve, reject) => {
            const params = {
                    appid: config.appid,
                    refresh_token: param.refresh_token
                }, now = moment().format("YYYY-MM-DD HH:mm:ss"),
                createTime = moment(param.createTime).format("YYYY-MM-DD HH:mm:ss");
            let data = {};
            service.userPost(api.refresh_token, params, "获取成功").then((res) => {
                data = res.data;
                data.createTime = createTime;
                data.updateTime = now;
                return userDao.updateAccess_token(data);
            }).then((res) => {
                resolve(data.access_token);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    /**
     * 获取Access_token
     * @returns {Promise}
     */
    getAccess_token: () => {
        return new Promise((resolve, reject) => {
            const param = {
                appid: config.appid,
                secret: config.secret
            }, now = new Date();
            let access = {};
            userDao.getAccess_token().then((res) => {
                access = res[0];
                let updateTime = moment(access.updateTime), createTime = moment(access.createTime);
                if (createTime.add('d', 30).isAfter(now)) {
                    if (updateTime.add('s', parseInt(access.expires_in)).isAfter(now)) {
                        return access.access_token;
                    } else {
                        param.createTime = createTime;
                        param.refresh_token = access.refresh_token;
                        return service.refresh_token(access);
                    }
                }
                return service.access_token();
            }).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    },

};

module.exports = service;