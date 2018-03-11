
const serverService = require('../../houtai/service/serverService');
const express = require('express');
const router = express.Router();
const logger = require('../../utils/logHelper').helper;

/**
 * @api {post} /api/services/queryServer 查询用户服务问题
 * @apiGroup services
 * @apiName queryServer
 * @apiParam {String} size 查询分页大小
 * @apiParam {String} page 页码
 * @apiSuccess {String} problem_details 问题详情
 * @apiSuccess {String} create_date 创建时间
 * @apiSuccess {String} server_problem 服务问题标题
 * @apiSuccess {String} user_id 用户名
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询无记录
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/queryServer',(req,res)=>{
    let data = req.body;
    if(!data.size || !data.page){
        res.send({code:4,message:'参数不齐'})
    }
    logger.startLog();
    serverService.queryServer(data).then((val) => {
        logger.endLog(val);
        res.send(val);
    }).catch((error) => {
        logger.endErrLog(error);
        res.send(error);
    });
});
module.exports=router;