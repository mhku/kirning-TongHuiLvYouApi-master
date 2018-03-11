
const serverDao = require('../../houtai/dao/serverDao');
const serviceMethod = require('../../utils/serviceCommon');

const service={
    /**
     * 查询用户服务问题
     * @param data
     * @returns {*}
     */
    queryServer:(data)=>{
        data.size=parseInt(data.size);
        data.start = (parseInt(data.page) - 1) * data.size;
        return serviceMethod.searchMethod(serverDao,"queryServer",data);
    }
}
module.exports=service;