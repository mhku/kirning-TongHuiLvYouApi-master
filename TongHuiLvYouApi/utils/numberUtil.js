const util = {
    /**
     * 验证是否整数（成功则转换原字符串为数字）
     * @param num
     * @returns {*}
     */
    isInteger: (num) => {
        const reg = /^[1-9][0-9]*$/
        if (reg.test(num)) return parseInt(num);
        return 0;
    }
};
module.exports = util;