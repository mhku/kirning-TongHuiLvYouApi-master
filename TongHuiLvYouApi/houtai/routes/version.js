const express = require('express');
const router = express.Router();
const versionService = require('../../houtai/service/versionService');

/**
 * @api {post} /api/version/searchVersion 查找版本
 * @apiGroup version
 * @apiName searchVersion
 * @apiSuccess {String} version_number 版本号
 * @apiSuccess {String} version_path 文件地址
 * @apiSuccess {String} version_name 文件名
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchVersion', function (req, res) {
    let data = req.body;
    versionService.searchVersion(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/version/addVersion 查找版本
 * @apiGroup version
 * @apiName addVersion
 * @apiParam {String} version_number 版本号
 * @apiParam {String} version_path 版本地址
 * @apiParam {String} version_name 文件名
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/addVersion', function (req, res) {
    let data = req.body;
    versionService.addVersion(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});

module.exports = router;