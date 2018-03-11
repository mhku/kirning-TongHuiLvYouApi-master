/**
 * Created by Administrator on 2018/1/12.
 */
const recordsService = require('../service/recordsService');
const express = require('express');
const router = express.Router();
const logger = require('../utils/logHelper').helper;

/**
 * @api {post} /api/records/queryRecords 查询浏览记录
 * @apiGroup records
 * @apiName queryRecords
 * @apiParam {String} token 用户ID
 * @apiParam {String} size 查询大小
 * @apiParam {String} page 当前页
 * @apiSuccess {String} records_id 浏览记录ID
 * @apiSuccess {String} records_text 浏览记录
 * @apiSuccess {String} create_date 创建时间
 * @apiSuccess {String} id 浏览商品id
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询无记录
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/queryRecords',(req,res)=>{
    let data=req.body;
    if(!data.token || !data.page || !data.size){
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    logger.startLog();
    recordsService.queryRecords(data).then((val) => {
        logger.endLog(val);
        for(let i=0;i<val.data.length;i++){
            val.data[i].records_text=JSON.parse(val.data[i].records_text)
        };
        res.send(val);
    }).catch((error) => {
        logger.endErrLog(error);
        res.send(error);
    });
})
/**
 * @api {post} /api/records/insertRecords 添加浏览记录
 * @apiGroup records
 * @apiName insertRecords
 * @apiParam {String} token 用户ID
 * @apiParam {String} records_text 浏览记录
 * @apiParam {String} id 浏览商品id
 * @apiSuccess {String} 1 添加成功
 * @apiError {String} 2 添加失败
 * @apiError {String} 4 参数不齐
 */
router.post('/insertRecords',(req,res)=>{
    let data=req.body;
    if(!data.records_text||!data.id){
        res.send({code:4,message:"参数不齐"});
        return;
    }
    logger.startLog();
    recordsService.insertRecords(data).then((val) => {
        logger.endLog(val);
        res.send(val);
    }).catch((error) => {
        logger.endErrLog(error);
        res.send(error);
    });
})

/**
 * @api {post} /api/records/deleteRecords 删除浏览记录
 * @apiGroup records
 * @apiName deleteRecords
 * @apiParam {String} records_id 浏览记录ID
 * @apiSuccess {String} 1 删除成功
 * @apiError {String} 2 删除失败
 * @apiError {String} 4 参数不齐
 */
router.post('/deleteRecords',(req,res)=>{
    let data=req.body;
    if(!data.records_id){
        res.send({code:4,message:"参数不齐"});
        return;
    }
    logger.startLog();
    recordsService.deleteRecords(data).then((val) => {
        logger.endLog(val);
        res.send(val);
    }).catch((error) => {
        logger.endErrLog(error);
        res.send(error);
    });
})
module.exports=router;