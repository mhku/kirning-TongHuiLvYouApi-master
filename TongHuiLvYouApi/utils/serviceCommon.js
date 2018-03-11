/**
 * Created by gu on 2017/7/7.
 */
const logger = require("../utils/logHelper").helper;

const serviceMethod = {

    /**
     * 添加方法
     * @param name 类名
     * @param method 方法名
     * @param value 参数
     * @returns {Promise}
     */
    addMethod: (name, method, value) => {
        return new Promise((resolve, reject) => {
            name[method](value).then((result) => {
                let affectedRows = result.affectedRows;
                if (affectedRows > 0) {
                    let success = {};
                    success.code = 1;
                    success.msg = "添加成功";
                    resolve(success);
                } else {
                    let error = {};
                    error.code = 2;
                    error.msg = "添加失败";
                    reject(error)
                }
            }, (err) => {
                logger.writeErr(err.msg);
                let error = {};
                error.code = 3;
                error.msg = err.message;
                reject(error);
            });
        });
    },

    /**
     * 修改方法
     * @param name 类名
     * @param method 方法名
     * @param value 参数
     * @returns {Promise}
     */
    updateMethod: (name, method, value) => {
        return new Promise((resolve, reject) => {
            name[method](value).then((result) => {
                let affectedRows = result.affectedRows;
                if (affectedRows > 0) {
                    let success = {};
                    success.code = 1;
                    success.msg = "修改成功";
                    resolve(success);
                }
                else {
                    let error = {};
                    error.code = 2;
                    error.msg = "修改失败";
                    reject(error)
                }
            }, (err) => {
                logger.writeErr(err.msg);
                let error = {};
                error.code = 3;
                error.msg = err.message;
                reject(error);
            });
        });
    },

    /**
     * 删除方法
     * @param name 类名
     * @param method 方法名
     * @param value 参数
     * @returns {Promise}
     */
    delMethod: (name, method, value) => {
        return new Promise((resolve, reject) => {
            name[method](value).then((result) => {
                let affectedRows = result.affectedRows;
                if (affectedRows > 0) {
                    let success = {};
                    success.code = 1;
                    success.msg = "删除成功";
                    resolve(success);
                }
                else {
                    let error = {};
                    error.code = 2;
                    error.msg = "删除失败";
                    reject(error)
                }
            }, (err) => {
                logger.writeErr(err.msg);
                let error = {};
                error.code = 3;
                error.msg = err.message;
                reject(error);
            });
        });
    },

    /**
     * 查询方法
     * @param name 类名
     * @param method 方法名
     * @param value 参数
     * @returns {Promise}
     */
    searchMethod: (name, method, value) => {
        return new Promise((resolve, reject) => {
            if (value) {
                name[method](value).then((result) => {
                    if (result.length > 0) {
                        let success = {};
                        success.code = 1;
                        success.msg = "查询成功";
                        success.data = result;
                        resolve(success);
                    } else {
                        let error = {};
                        error.code = 2;
                        error.msg = "查询无记录";
                        reject(error)
                    }
                }, (err) => {
                    logger.writeErr(err.msg);
                    let error = {};
                    error.code = 3;
                    error.msg = err.message;
                    reject(error);
                });
            } else {
                name[method]().then((result) => {
                    if (result.length > 0) {
                        let success = {};
                        success.code = 1;
                        success.msg = "查询成功";
                        success.data = result;
                        resolve(success);
                    }
                    else {
                        let error = {};
                        error.code = 2;
                        error.msg = "查询无记录";
                        reject(error)
                    }
                }, (err) => {
                    logger.writeErr(err.msg);
                    let error = {};
                    error.code = 3;
                    error.msg = err.message;
                    reject(error);
                });
            }
        });
    },
    /**
     * 返回页面提示封装
     * @param val
     */
    returnCode: (val, data) => {
        return new Promise((reslove, reject) => {
            if (val.returnCode == 'S') {
                const result = {
                    code: 1,
                    data: val[data],
                    msg: '查询成功'
                };
                reslove(result);
            } else if (val.returnCode == 'F') {
                const result = {
                    code: 2,
                    msg: val.returnMessage
                };
                reject(result);
            }
        });
    }

}

module.exports = serviceMethod;
