/**
 * Created by Administrator on 2017/9/1.
 */
const daoMethod = require('../utils/daoCommon');

const dao = {
    /**
     * 查找航班订单详情
     * @param data
     * @returns {*}
     */
    findFilghrOrder: (data)=>{
        let sql = `select * from filghr_order fo left join order_detail od on od.order_detail_id = fo.order_detail_id 
        where fo.filghr_order_id = $filghr_order_id`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 添加航班附加订单
     * @param data
     * @returns {*}
     */
    addFilghrOrder: (data) => {
        let sql = `insert into filghr_order (filghr_order_id, order_detail_id, depTime, arrTime, org_code, dst_code, orgJetquay, 
        dstJetquay, airline, filghr_no, trip_rule) value ($filghr_order_id, $order_detail_id, $depTime, $arrTime, 
        $org_code, $dst_code, $orgJetquay, $dstJetquay, $airline, $filghr_no, $trip_rule)`;
        return daoMethod.oneMethod(sql, data);
    },
};
module.exports = dao;