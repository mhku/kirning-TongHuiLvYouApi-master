/**
 * Created by Administrator on 2018/1/11.
 */
const serverService = require('../service/serverService');
const express = require('express');
const router = express.Router();
const logger = require('../utils/logHelper').helper;

/**
 * @api {post} /api/service/queryServer 查询服务问题详情
 * @apiGroup Service
 * @apiName queryServer
 * @apiParam {String} server_id 服务类id
 * @apiSuccess {String} server_text 服务问题的内容
 * @apiSuccess {String} create_date 创建时间
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询无记录
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/queryServer',(req,res)=>{
    let data = req.body;
    if (!data.server_id) {
        res.send({code: 4, message: "参数不齐"});
        return;
    }
    logger.startLog();
    serverService.queryServer(data).then((val) => {
        logger.endLog(val);
        res.send(val);
    }).catch((error) => {
        logger.endErrLog(error);
        res.send(error);
    });
})

/**
 * @api {post} /api/service/deleteServer 删除服务问题
 * @apiGroup Service
 * @apiName deleteServer
 * @apiParam {String} server_id 服务id
 * @apiSuccess {String} 1 删除成功
 * @apiError {String} 2 删除失败
 * @apiError {String} 4 参数不齐
 */
router.post('/deleteServer',(req,res)=>{
    let data=req.body;
    if(!data.server_id){
        res.send({code:4,message:"参数不齐"});
        return;
    };
    logger.startLog();
    serverService.deleteServer(data).then((val) => {
        logger.endLog(val);
        res.send(val);
    }).catch((error) => {
        logger.endErrLog(error);
        res.send(error);
    });
})

/**
 * @api {post} /api/service/updateServer 修改问题服务
 * @apiGroup Service
 * @apiName updateServer
 * @apiParam {String} server_id 需要修改的服务类id
 * @apiParam {String} server_text 需要修改的服务问题内容
 * @apiParam {String} server_problem 需要修改的服务问题标题
 * @apiSuccess {String} 1 修改成功
 * @apiError {String} 2 修改失败
 * @apiError {String} 4 参数不齐
 */
router.post('/updateServer',(req,res)=>{
    let data=req.body;
    if(!data.server_text||!data.server_id||!data.server_problem){
        res.end({code:4,message:"参数不齐"});
        return;
    }
    logger.startLog();
    serverService.updateServer(data).then((val) => {
        logger.endLog(val);
        res.send(val);
    }).catch((error) => {
        logger.endErrLog(error);
        res.send(error);
    });
})

/**
 * @api {post} /api/service/insertServer 添加服务
 * @apiGroup Service
 * @apiName insertServer
 * @apiParam {String} server_text 服务问题内容
 * @apiParam {String} server_problem 服务问题标题
 * @apiParam {String} token 用户id
 * @apiSuccess {String} 1 添加成功
 * @apiError {String} 2 添加失败
 * @apiError {String} 4 参数不齐
 */

router.post('/insertServer',(req,res)=>{
    let data=req.body;
    if(!data.server_problem||!data.server_text){
        res.send({code:4,message:"参数不齐"});
        return;
    }
    logger.startLog();
    serverService.insertServer(data).then((val) => {
        logger.endLog(val);
        res.send(val);
    }).catch((error) => {
        logger.endErrLog(error);
        res.send(error);
    });
})

/**
 * @api {post} /api/service/selectServer 查询服务问题
 * @apiGroup Service
 * @apiName selectServer
 * @apiSuccess {String} server_id 服务id
 * @apiSuccess {String} server_problem 服务问题标题
 * @apiSuccess {String} hotline_title 热线联系方式
 * @apiSuccess {String} hotline_contact 热线联系
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询无记录
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/selectServer',(req,res)=>{
    logger.startLog();
    serverService.selectServer().then((val) => {
        logger.endLog(val);
        res.send(val);
    }).catch((error) => {
        logger.endErrLog(error);
        res.send(error);
    });
})

module.exports=router