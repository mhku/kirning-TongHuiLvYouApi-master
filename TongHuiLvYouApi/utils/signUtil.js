/**
 * Created by Administrator on 2017/9/29.
 */
const md5 = require('blueimp-md5');
const util = {
    /**
     * 将对象排序后再MD5加密签名
     * @param obj 排序对象
     * @param str 另加字符串
     * @returns {*}
     */
    sortSign: (obj, str) => {
        let keys = Object.keys(obj).sort();
        let signStr = keys[0] + '=' + obj[keys[0]];
        for (let i = 1; i < keys.length; i++) {
            let key = keys[i];
            let value = obj[key];
            if (key && value || value == 0) {
                signStr += '&' + key + '=' + value;
            }
        }
        if (str) signStr += str;
        return md5(signStr);
    }
};
module.exports = util;