const daoMethod = require('../utils/daoCommon');
const uuid = require('../utils/uuid');

const dao = {
    /**
     * 添加订单日志
     * @param data
     * @param data.order_record_type 操作类型（1创建订单， 2用户支付，3用户退款，4供应商出单成功， 5用户取消， 6供应商出单失败）
     * @param data.order_id 订单ID
     * @returns {*}
     */
    addRecord: (data) => {
        data.order_record_id = uuid.createUUID();
        let sql = `insert into order_record(order_record_id, order_record_type, order_record_createtime, order_id, order_record_fail)
                  values($order_record_id,$order_record_type,now(),$order_id, $order_record_fail)`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查询日志
     * @param data
     * @returns {*}
     */
    findRecordByOrder: (data) => {
        let sql = `select * from order_record as o where o.order_id = $order_id and o.order_record_type = $order_record_type and o.order_record_isable = '1'`;
        return daoMethod.oneMethod(sql, data);
    }
};
module.exports = dao;