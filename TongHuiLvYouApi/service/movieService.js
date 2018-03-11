const config = require('../utils/config');
const api = require('../utils/api').movie;
const request = require('../utils/request');

const service = {

    /**
     * 查询电影地址
     * @returns {Promise}
     */
    queryMovice: () => {
        return new Promise((resolve, reject) => {
            const data = {
                key: config.movieKey
            };
            request.post(api.index, data, 'UTF-8').then((res)=>{
                res = JSON.parse(res);
                resolve({code: 1, data: res.result, msg: "查询成功"});
            }).catch((err)=>{
                reject(err);
            })
        });
    }
};
module.exports = service;

