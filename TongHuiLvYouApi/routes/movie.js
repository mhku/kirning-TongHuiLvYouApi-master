const express = require('express');
const router = express.Router();
const logger = require('../utils/logHelper').helper;
const movieService = require('../service/movieService');

/**
 * @api {post} /api/movie/queryMovice 查询电影网站
 * @apiGroup Movie
 * @apiName queryMovice
 * @apiSuccess {String} h5url H5页面URL
 * @apiSuccess {String} h5weixin 微信公众号专用h5
 * @apiSuccess {String} 1 查询成功
 * @apiError {String} 2 查询失败
 * @apiError {String} 3 错误信息
 */
router.post('/queryMovice', (req, res) => {
    logger.startLog();
    movieService.queryMovice().then((val) => {
        logger.endLog(val);
        res.send(val);
    }).catch((error) => {
        logger.endErrLog(error);
        res.send(error);
    });
});
module.exports = router;