
const daoMethod=require('../../utils/daoCommon');
const dao={
    /**
     * 查询用户服务问题
     * @param data
     * @returns {*}
     */
    queryServer:(data)=>{
        let sql=`select * from server_details limit ${data.start},${data.size}`;
        return daoMethod.oneMethod(sql,data);
    }
}
module.exports=dao;