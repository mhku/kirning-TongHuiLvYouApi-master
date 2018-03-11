/**
 * Created by Administrator on 2017/8/28.
 */
const rp = require('request-promise');
const iconv = require('iconv-lite');
const req = require("request");

const request = {

    /**
     * POST请求
     * @param uri
     * @param data
     * @returns {*}
     */
    post: (uri, data, encode, form) => {
        return request.req('POST', uri, data, encode, form);
    },

    /**
     * GET请求
     * @param uri
     * @param data
     * @returns {*}
     */
    get: (uri, data) => {
        return request.req('GET', uri, data);
    },
    /**
     * 请求发送
     * @param method
     * @param uri
     * @param data 请求数据
     * @param encode
     * @param from 请求格式，如果为form 就是表单提交
     * @returns {*}
     */
    req: (method, uri, data, encode, from) => {
        let options = {
            method, uri, form: data,
            // proxy: 'http://localhost:8888'
        };
        if (from) {
            options.headers = {
                "Content-Type": `application/x-www-form-urlencoded; charset=${encode}`,
            };
        } else {
            if (encode) {
                options.encoding = null;
                options.transform = (body) => {
                    // return JSON.parse(iconv.decode(body, encode));
                    if (encode) {
                        return iconv.decode(body, encode);
                    } else {
                        return body;
                    }
                };
                options.headers = {
                    "Content-Type": "application/json;charset=" + encode,
                    charset: encode
                };
            }
        }
        return rp(options);
    },
    req2: (option) => {
        return new Promise((resolve, reject) => {
            req(option, function (err, response, body) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(body, response);
            })
        })
    }
};


module.exports = request;