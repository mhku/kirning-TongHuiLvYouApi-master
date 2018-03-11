
const daoMethod = require('../utils/daoCommon');

const dao = {
    /**
     * 查询指定运营商与地区的流量值
     * @param data
     * @returns {*}
     */
    searchFlowValue: (data)=>{
        let sql = `select f.flow_flowValue, f.flow_perValue from flow as f where f.flow_supplier = $flow_supplier and (f.flow_range = '全国' or $flow_range LIKE CONCAT ('%',f.flow_range,'%'))
                   group by f.flow_flowValue order by if(right(f.flow_flowValue, 1)='G', (left(f.flow_flowValue, length(f.flow_flowValue)-1)+0)*1024, left(f.flow_flowValue, length(f.flow_flowValue)-1)+0)`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查询指定运营商及地区及流量面值查询流量信息
     * @param data
     * @returns {*}
     */
    searchFlowInfo: (data)=>{
        let sql = `select f.flow_chain, f.flow_supplier, f.flow_perValue, f.flow_flowValue, f.flow_price, f.flow_range, f.flow_expiry_date, f.flow_effective_date, f.flow_filling_limit, f.flow_remark from flow as f 
                   where f.flow_supplier = $flow_supplier and f.flow_flowValue = $flow_flowValue and (f.flow_range = '全国' or $flow_range LIKE CONCAT ('%',f.flow_range,'%')) `;
        if (data.flow_expiry_date) {
            sql += ` f.flow_expiry_date = $flow_expiry_date`;
        }
        if (data.flow_effective_date) {
            sql += ` f.flow_effective_date = $flow_effective_date`;
        }

        sql += ` order by f.flow_price`;

        if (data.query_count) {
            sql += ` limit ${data.query_count}`;
        }
        return daoMethod.oneMethod(sql, data);
    }

};
module.exports = dao;
