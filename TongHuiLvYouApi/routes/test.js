const express = require('express');
const router = express.Router();
const request = require('../utils/request');


/**
 * @api {post} /api/test/a 测试调用接口
 * @apiGroup Test
 * @apiName a
 * @apiParam {String} url 请求地址
 * @apiParam {String} param 请求参数
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/a', (req, res) => {
    let data = req.body;
    if (!data.url || !data.param) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    let param = data.param;
    param = JSON.parse(param);
    request.post(data.url, param, 'UTF-8').then(val => {
        res.send(val);
    }).catch(err => {
        res.send(err);
    });
});
module.exports = router;