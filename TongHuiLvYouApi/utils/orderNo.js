/**
 * Created by Administrator on 2017/8/30.
 */
const moment = require('moment');

const util = {
    /**
     * 生成指定位数的随机数
     * @param n
     * @returns {string}
     */
    createRandomNumber: (n) => {
        let t = '';
        for (let i = 0; i < n; i++) {
            let a = Math.floor(Math.random() * 10);
            if (i == 0) {
                if (a == 0) {
                    a = '1';
                }
            }
            t += a + '';
        }
        return t;
    },

    //订单号生成
    createOrderNo: () => {
        return moment().format('YYYYMMDDhhmmss') + util.createRandomNumber(3);
    }
};
console.log(util.createOrderNo());
module.exports = util;