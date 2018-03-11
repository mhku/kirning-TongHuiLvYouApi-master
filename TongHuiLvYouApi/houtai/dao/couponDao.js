let daoMethod = require("../../utils/daoCommon");

let dao =
    {
        /**
         * 添加优惠劵
         *@param data
         * @return {*}
         */
        addCoupon: (data) => {
            let sql = ` insert into coupon(coupon_id,coupon_name,coupon_money,coupon_startTime,coupon_endTime,coupon_issued,coupon_explain,coupon_relation,coupon_creator,coupon_createtime,coupon_isable)
                        values ($coupon_id,$coupon_name,${data.coupon_money},$coupon_startTime,$coupon_endTime,${data.coupon_issued},$coupon_explain,$coupon_relation,$coupon_creator,now(),1) `;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 查询优惠劵是否存在
         *@param data
         * @return {*}
         */
        findCoupon: (data) => {
            let sql = ` select coupon_id from coupon where coupon_name=$coupon_name and coupon_isable=1 `;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 更改优惠劵状态
         * @param data
         * @return {*}
         */
        upCoupon: (data) => {
            let sql = ` update coupon set coupon_isable=$coupon_isable and coupon_id=$coupon_id `;
            return daoMethod.oneMethod(sql, data);
        },

        /**
         * 查询优惠劵
         * @param data
         * @return {*}
         */
        searchCoupon: (data) => {
            let coupon_name = `  `;//优惠劵名称
            let coupon_isable = `  `;//优惠劵状态
            let time = `  `;//优惠劵名称
            if (data.coupon_name) {
                coupon_name = ` and  coupon_name like concat ('%',$coupon_name,'%')  `;
            }
            if (data.coupon_isable) {
                coupon_isable = ` and coupon_isable=$coupon_isable  `;
            }
            if (data.ago && data.end) {
                time = ` and coupon_createtime between  date_format($ago,'%Y-%m-%d') AND date_format($end,'%Y-%m-%d') `;
            }
            let first = ` select * from coupon where 1=1 `;
            let end = ` order by coupon_createtime desc limit ${data.page},${data.size} `;
            if (data.counts) {
                let sql = first + coupon_name + coupon_isable + time;
                return daoMethod.oneMethod(sql, data);
            }
            let sql = first + coupon_name + coupon_isable + time + end;
            return daoMethod.oneMethod(sql, data);
        }
    };
module.exports = dao;