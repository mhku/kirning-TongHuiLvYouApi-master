/**
 * Created by Administrator on 2018/1/12.
 */
const collectionDao = require('../dao/collectionDao');
const serviceMethod = require('../utils/serviceCommon');
const tokenService=require('../service/tokenService');
const uuid=require('../utils/uuid');

const service={
    /**
     * 查询个人收藏
     * @param data
     * @returns {*}
     */
    queryCollection:(data)=>{
        return tokenService.queryUserIdByToken(data).then((result)=>{
            data.user_id=result.user_id;
            data.size=parseInt(data.size);
            data.start=(parseInt(data.page)-1)*data.size;
            return serviceMethod.searchMethod(collectionDao,'queryCollection',data);
        });

    },
    /**
     * 删除个人收藏
     * @param data
     * @returns {*}
     */
    deleteCollection:(data)=>{
        return serviceMethod.delMethod(collectionDao,'deleteCollection',data)
    },
    /**
     * 添加个人收藏
     * @param data
     * @returns {*}
     */
    insertCollection:(data)=>{
        return tokenService.queryUserIdByToken(data).then((result)=>{
            data.user_id=result.user_id;
            return serviceMethod.addMethod(collectionDao,'insertCollection',data)
        });
    },


}

module.exports=service;