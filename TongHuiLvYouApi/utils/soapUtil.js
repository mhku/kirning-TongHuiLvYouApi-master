/**
 * Created by Administrator on 2017/8/29.
 */
const soap = require('soap');

const server = {
    /**
     * 发送WebService请求
     * @param url
     * @param data
     * @param funName
     * @returns {Promise.<TResult>}
     */
    request: (url, data, funName) => {
        return new Promise((resolve)=>{
            soap.createClientAsync(url).then(client => {
                funName += "Async";
                return client[funName]({request: data});
            }).then(val=>{
                resolve(val.return);
            }).catch(error=>{
                console.log(error);
            });
        });
    }
};
module.exports = server;