const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const upload = require("../util/config");
const resUtils = require('../util/response');


/**
 * @api {post} /api/file/upload 上传文件(图片，文档)
 * @apiName upload
 * @apiGroup file
 * @apiParam {File} file 文件
 * @apiParam {String} token 用户Token，认证用户
 * @apiSuccess {String} file_name 文件名
 * @apiSuccess {String} file_path 文件路径
 * @apiError {String} 2 上传失败
 */

router.post('/upload', upload.single('file'), function (req, res, next) {
    if (req.file) {
        const name = req.file.originalname;
        let path = req.file.path;
        path = path.replace(/\\/g, "/");
        const file = {
            file_name: name,
            file_path: path
        };
        res.send(resUtils.getSuccess({file}));
    }
});
/**
 * @api {post} /api/file/download 下载APP
 * @apiName download
 * @apiGroup file
 */
router.get('/download', function (req, res, next) {
    let name = `通惠APP.apk`;
    res.download('data/uploads/file/app-release.apk', name);
});

module.exports = router;
