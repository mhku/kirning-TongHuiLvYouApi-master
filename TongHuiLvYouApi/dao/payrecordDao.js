const daoMethod = require('../utils/daoCommon');

const dao = {

    /**
     * 添加支付记录
     * @param data
     * @returns {*}
     */
    addPayrecord: (data) => {
        let sql = `insert into payrecord(payrecord_id, order_no, user_id, payrecord_price, payrecord_status) 
                   value($payrecord_id, $order_no, $user_id, ${data.payrecord_price}, $payrecord_status)`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 修改支付记录
     * @param data
     * @param data.order_no 订单号
     * @param data.payrecord_status 支付状态
     * @param data.payment_method 支付类型
     * @returns {*}
     */
    updatePayrecord: (data) => {
        let sql = `update payrecord as p set p.payrecord_time = now(), p.payrecord_status = $payrecord_status,
                   payment_method = $payment_method where p.order_no = $order_no`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查找指定支付记录
     * @param data
     * @returns {*}
     */
    findPayrecord: (data) => {
        let sql = `select p.payrecord_id, p.order_no, p.user_id, p.payrecord_price, p.payrecord_time, p.payrecord_status, o.order_id, o.order_departure_datetime from payrecord as p 
                   join \`order\` as o on o.order_no = p.order_no
                   where p.order_no = $order_no`;
        return daoMethod.oneMethod(sql, data);
    }
};
module.exports = dao;