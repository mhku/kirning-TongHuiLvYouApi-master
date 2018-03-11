const order_recordDao = require('../dao/order_recordDao');
const serviceMethod = require('../utils/serviceCommon');

const service = {
    /**
     * 添加记录
     * @param data
     * @returns {Promise}
     */
    addRecord: (data) => {
        return new Promise((resolve, reject) => {
            order_recordDao.findRecordByOrder(data).then((res) => {
                if (res.length == 0) {
                    return serviceMethod.addMethod(order_recordDao, "addRecord", data);
                }
                return Promise.resolve({code: 1, msg: "添加成功"});
            }).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            })
        });
    }
};
module.exports = service;