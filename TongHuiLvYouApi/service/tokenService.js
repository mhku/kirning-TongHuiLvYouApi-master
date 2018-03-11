/**
 * Created by Administrator on 2017/8/25.
 */
const tokenDao = require('../dao/tokenDao');
const serviceMethod = require('../utils/serviceCommon');

const service = {

    /**
     * 添加Token值
     * @param data
     * @returns {*}
     */
    addToken: (data) => {
        return serviceMethod.addMethod(tokenDao, 'addToken', data);
    },

    /**
     * 修改Token值
     * @param data
     * @returns {*}
     */
    updateToken: (data) => {
        return serviceMethod.updateMethod(tokenDao, 'updateToken', data);
    },

    /**
     * 查询指定用户Token值
     * @param data
     * @returns {*}
     */
    queryTokenByUser: (data) => {
        return serviceMethod.searchMethod(tokenDao, 'queryTokenByUser', data);
    },

    /**
     * 查询用户的Token值
     * @param data
     * @returns {*}
     */
    queryUserIdByToken: (data) => {
        return new Promise((resolve, reject) => {
            tokenDao.queryUserIdByToken(data).then((res) => {
                if (res.length > 0) {
                    return resolve(res[0]);
                }
                return reject({code: 2, msg: "用户找不到"});
            }).catch((error) => {
                return reject({code: 3, msg: error.msg});
            });
        });
    }
}

module.exports = service;