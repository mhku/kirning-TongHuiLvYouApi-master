/**
 * Created by Administrator on 2018/1/12.
 */
const serverService = require('../service/collectionService');
const express = require('express');
const router = express.Router();
const logger = require('../utils/logHelper').helper;
const uuid=require('../utils/uuid');

/**
 * @api {post} /api/collection/queryCollection 查询个人收藏
 * @apiGroup collection
 * @apiName queryCollection
 * @apiParam {String} token 用户ID
 * @apiParam {String} collection_classification 收藏类型
 * @apiParam {String} size 查询大小
 * @apiParam {String} page 当前页
 * @apiSuccess {String} collection_id 收藏ID
 * @apiSuccess {String} ccollection_classification 收藏类型(1 酒店，2 门票)
 * @apiSuccess {String} collection_title 收藏内容
 * @apiSuccess {String} id 收藏商品id
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询无记录
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */

router.post('/queryCollection',(req,res)=>{
    let data = req.body;
    logger.startLog();
    serverService.queryCollection(data).then((val) => {
        logger.endLog(val);
        for(let i=0;i<val.data.length;i++){
            val.data[i].collection_title=JSON.parse(val.data[i].collection_title)
        };
        res.send(val);
    }).catch((error) => {
        logger.endErrLog(error);
        res.send(error);
    });
})

/**
 * @api {post} /api/collection/deleteCollection 删除个人收藏
 * @apiGroup collection
 * @apiName deleteCollection
 * @apiParam {String} collection_id 收藏ID
 * @apiSuccess {String} 1 删除成功
 * @apiError {String} 2 删除失败
 * @apiError {String} 4 参数不齐
 */
router.post('/deleteCollection',(req,res)=>{
    let data=req.body;
    if(!data.collection_id){
        res.send({code:4,message:"参数不齐"});
        return;
    };
    logger.startLog();
    serverService.deleteCollection(data).then((val) => {
        logger.endLog(val);
        res.send(val);
    }).catch((error) => {
        logger.endErrLog(error);
        res.send(error);
    });
})

/**
 * @api {post} /api/collection/insertCollection 添加个人收藏
 * @apiGroup collection
 * @apiName insertCollection
 * @apiParam {String} collection_classification 收藏类型(1 酒店，2 门票)
 * @apiParam {String} collection_title 收藏内容
 * @apiParam {String} id 收藏商品id
 * @apiParam {String} token 用户ID
 * @apiSuccess {Object} data
 * @apiSuccess {String} data.collection_id
 * @apiSuccess {String} 1 添加成功
 * @apiError {String} 2 添加失败
 * @apiError {String} 4 参数不齐
 */
router.post('/insertCollection',(req,res)=>{
    let data=req.body;
    data.collection_id=uuid.createUUID();
    if( !data.collection_classification || !data.collection_title||!data.id){
        res.send({code:4,message:"参数不齐"});
        return;
    }
    logger.startLog();
    serverService.insertCollection(data).then((val) => {
        logger.endLog(val);
        val.data={collection_id:data.collection_id}
        res.send(val);
    }).catch((error) => {
        logger.endErrLog(error);
        res.send(error);
    });
})

module.exports=router;