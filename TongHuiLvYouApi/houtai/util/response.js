/**
 * Created by PVer on 2017/4/14.
 */
const responseUtils = {
    getSuccess(data, msg){
        return {
            data: data,
            msg: msg,
            code: 1
        }
    },
    getError(msg, code = 0){
        return {
            msg: msg,
            code: code
        }
    },
    /**
     * 返回成功的表格数据
     * @param draw 前端传过来的，照原样返回即可
     * @param total 总数据
     * @param filterTotal 过滤后的中数据
     * @param data 表格数据，数组
     * @returns {{draw: *, total: *, filterTotal: *, data: *}}
     */
    getSuccessTable(draw, total, filterTotal, data){
        return {
            draw: draw, total: total, filterTotal: filterTotal, data: data
        }
    }
};
module.exports = responseUtils;