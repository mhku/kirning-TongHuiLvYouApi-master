/**
 * Created by Administrator on 2017/8/31.
 */
const daoMethod = require('../utils/daoCommon');
const sqlHepler = require('./sqlHelper');

const dao = {

    /**
     * 添加通常订单
     * @param orders
     * @returns {Promise}
     */
    addOrder: (orders) => {
        let sqls = [];
        orders.forEach((order) => {
            if (!order.order_state) order.order_state = 1;
            //添加订单
            let sql = `insert into \`order\` (order_id, order_no, user_id, order_target_id, product_id, order_amount, order_price, order_original_price, order_state, order_telephone, order_mailbox, order_user, 
            order_paper, order_origin, order_destination, order_other_origin, order_other_destination, order_departure_datetime, order_end_time, order_safe_state, order_safe_price, order_count, 
            order_title, order_number, order_tickettype, order_ticke, order_seat_no, order_company_name, order_trip_rule, order_otherInfo, order_remark, order_creator)
            value ($order_id, $order_no, $user_id, $order_target_id, $product_id, ${order.order_amount}, ${order.order_price}, ${order.order_original_price || 0}, $order_state, $order_telephone, $order_mailbox, $order_user, 
            $order_paper, $order_origin, $order_destination, $order_other_origin, $order_other_destination, $order_departure_datetime, $order_end_time, $order_safe_state, $order_safe_price, 
            ${order.order_count}, $order_title, $order_number, $order_tickettype, $order_ticke, $order_seat_no, $order_company_name, $order_trip_rule, $order_otherInfo, $order_remark, $user_id)`;
            sqls.push(sqlHepler.getNewSql(sql, order));
            if (!order.tourists) order.tourists = [];
            //添加参与订单游客
            order.tourists.forEach((tourist) => {
                tourist.order_id = order.order_id;
                tourist.user_id = order.user_id;
                sql = `insert into order_tourist (order_id, tourist_id, order_tourist_creator) value ($order_id, $tourist_id, $user_id)`;
                sqls.push(sqlHepler.getNewSql(sql, tourist));
            })
        });
        return sqlHepler.execTrans(sqls);
    },

    /**
     * 订单支付完成修改
     * @param data
     * @param data.order_pay 支付方式
     * @param data.order_payTime 支付时间
     * @param data.order_id 订单ID
     * @param data.order_state 订单ID
     * @returns {*}
     */
    orderPay: (data) => {
        let sql = `update \`order\` as o set o.order_state = $order_state, o.order_payTime = now()`;
        if (data.order_pay) {
            sql += `, o.order_pay = $order_pay`;
        }
        sql += ` where o.order_id = $order_id`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 根据订单ID修改订单状态
     * @param data
     * @returns {Promise}
     */
    updateOrderStateByID: (data) => {
        let sql = `update \`order\` as o set o.order_state = $order_state where o.order_id = $order_id and o.order_creator = $user_id`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 根据订单编号修改订单状态
     * @param data
     * @returns {Promise}
     */
    updateOrderStateByNo: (data) => {
        let sql = `update \`order\` set order_state = $order_state`;
        if (data.pay_datetime) {
            sql += ` ,pay_datetime = $pay_datetime`;
        }
        if (data.order_reason) {
            sql += ` ,order_reason = $order_reason`;
        }
        if (data.order_refund_amount) {
            sql += ` ,order_refund_amount = ${data.order_refund_amount}`
        }
        sql += ` where order_no = $order_no`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 根据订单编号修改订单状态
     * @param data
     * @param data.order_tickeNo
     * @returns {Promise}
     */
    updateOrderStateByTargetNo: (data) => {
        let sql = `update \`order\` set order_state = $order_state`;
        if (data.order_tickeNo) {
            sql += ` and order_tickeNo = $order_tickeNo`;
        }
        sql += ` where order_target_id = $order_target_id and product_id = $product_id`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 根据订单号查找订单
     * @param data
     * @returns {*}
     */
    findOrderByNo: (data) => {
        let sql = `select o.* from \`order\` as o where o.order_no = $order_no and o.product_id = $product_id and o.order_isable = '1'`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 根据订单号查询订单信息(支付用)
     * @param data
     * @returns {*}
     */
    findOrderByNoOfPay: (data) => {
        let sql = `select o.* from \`order\` as o where o.order_no = $order_no and o.order_isable = '1'`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 根据第三方订单查询
     * @param data
     * @returns {*}
     */
    findOrderByTarget: (data) => {
        const product = data.product_id.split(',');
        let pros = [];
        for (let i = 0; i < product.length; i++) {
            if (product[i]) {
                pros.push(`'${product[i]}'`)
            }
        }
        let sql = `select o.* from \`order\` as o where o.order_target_id = $order_target_id and o.product_id in (${pros.join(',')}) and o.order_isable = '1'`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查找订单
     * @param data
     * @returns {*}
     */
    findOrderById: (data) => {
        let sql = `select o.* from \`order\` as o where order_id = $order_id and o.order_creator = $user_id and o.order_isable = '1'`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查找订单下的游客
     * @param data
     * @returns {*}
     */
    findTouristByOrder: (data) => {
        let sql = `select t.tourist_id, t.tourist_name, t.tourist_birthday, t.tourist_identityType, t.tourist_identityNo, t.tourist_phone, t.tourist_email, t.tourist_crowd_type from order_tourist as ot
                   inner join tourist as t on t.tourist_id = ot.tourist_id and t.tourist_isable = '1'
                   where ot.order_id = $order_id and ot.order_tourist_creator = $user_id and ot.order_tourist_isable = '1'`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查找订单下的游客
     * @param data
     * @returns {*}
     */
    searchUserOrders: (data) => {
        let sql = `select * from \`order\` as o where o.order_creator = $user_id`;
        if (data.order_state) sql += ` and o.order_state in (${data.order_state})`;
        if (data.product_id) {
            sql += ` and o.product_id in (${data.product_id})`;
        }
        sql += ` order by o.order_createtime desc limit ${data.page},${data.size}`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 下单成功修改状态
     * @param data
     * @param data.order_state 订单状态
     * @param data.order_pay 支付方式
     * @param data.order_no 订单号
     * @returns {*}
     */
    payOrder: (data) => {
        let sql = `update \`order\` as o set o.order_state = $order_state, o.order_pay = $order_pay, o.order_payTime = now() where o.order_no = $order_no`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 自动修改订单状态
     * @param data
     * @param data.order_state 修改状态内容
     * @param data.order_id 订单id
     * @param data.before_state 修改的指定状态
     * @param data.order_reason 取消原因（可选）
     * @returns {*}
     */
    updateOrderStateById: (data) => {
        let sql = `update \`order\` as o set o.order_state = $order_state`;
        if (data.order_reason) sql += `, o.order_reason = $order_reason`;
        sql += ` where o.order_id = $order_id and o.order_state = $before_state`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查询所有订单类型
     * @returns {*}
     */
    searchOrderProduct: () => {
        let sql = `select p.product_id, p.product_name from product as p`;
        return daoMethod.oneMethod(sql, {});
    },

    /**
     * 查询所有产品下指定状态订单
     * @returns {*}
     */
    searchOrderByState: (data) => {
        const product = data.product_id.split(',');
        let pros = [];
        for (let i = 0; i < product.length; i++) {
            if (product[i]) {
                pros.push(`'${product[i]}'`)
            }
        }
        let sql = `select * from \`order\` as o where o.product_id in (${pros.join(',')}) and o.order_state = $order_state and o.order_isable = '1'`;
        return daoMethod.oneMethod(sql, data);
    }
    ,

    addTouristNo: (data) => {

    }
};
module.exports = dao;