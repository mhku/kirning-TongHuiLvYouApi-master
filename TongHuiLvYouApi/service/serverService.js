/**
 * Created by Administrator on 2018/1/11.
 */
const serverDao = require('../dao/serverDao');
const serviceMethod = require('../utils/serviceCommon');
const uuid=require('../utils/uuid');
const tokenService=require('../service/tokenService');

const service={
    /**
     * 查询服务问题明细
     * @param data
     * @returns {*}
     */
    queryServer:(data)=>{
        return serviceMethod.searchMethod(serverDao,"queryServer",data);
    },
    /**
     * 删除服务问题明细
     * @param data
     * @returns {*}
     */
    deleteServer:(data)=>{
        return serviceMethod.delMethod(serverDao,"deleteServer",data);
    },
    /**
     * 修改服务问题明细
     * @param data
     * @returns {*}
     */
    updateServer:(data)=>{
        return serviceMethod.updateMethod(serverDao,"updateServer",data)
    },
    /**
     * 添加服务问题
     * @param data
     * @returns {*}
     */
    insertServer:(data)=>{
            data.server_id=uuid.createUUID();
            return serviceMethod.addMethod(serverDao,"insertServer",data);
    },
    /**
     * 查询服务问题
     * @returns {*}
     */
    selectServer:()=>{
        return serviceMethod.searchMethod(serverDao,"selectServer")
    }
}
module.exports=service;