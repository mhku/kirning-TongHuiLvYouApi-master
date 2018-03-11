/**
 * Created by Administrator on 2018/1/11.
 */
const daoMethod=require('../utils/daoCommon');
const dao={
    /**
     * 查询服务问题明细
     * @param data
     * @returns {*}
     */
    queryServer:(data)=>{
        let sql="select server_text,create_date from  server as s where server_id=$server_id";
        return daoMethod.oneMethod(sql, data);
    },
    /**
     * 删除服务问题明细
     * @param data
     * @returns {*}
     */
    deleteServer:(data)=>{
        let sql="delete from server where server_id=$server_id";
        return daoMethod.oneMethod(sql,data)
    },
    /**
     * 修改服务问题明细
     * @param data
     * @returns {*}
     */
    updateServer:(data)=>{
        let sql="update server set server_text=$server_text,server_problem=$server_problem where server_id=$server_id";
        return daoMethod.oneMethod(sql,data)
    },
    /**
     * 添加服务问题
     * @param data
     * @returns {*}
     */
    insertServer:(data)=>{
        let sql="insert into server (server_id,server_problem,server_text,create_date) values ($server_id,$server_problem,$server_text,now())";
        return daoMethod.oneMethod(sql,data)
    },
    /**
     * 查询服务问题标题
     * @returns {*}
     */
    selectServer:()=>{
        let sql="select s.server_problem,s.server_id,s.server_text from server as s; select h.hotline_title,h.hotline_contact from hotline as h";
        return daoMethod.oneMethod(sql)
    }
};
module.exports=dao;

