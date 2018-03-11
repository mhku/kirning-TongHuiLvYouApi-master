const express = require('express');
const router = express.Router();
const adsenseService = require('../../houtai/service/adsenseService');

/**
 * @api {post} /api/adsense/addAdsense 添加广告位
 * @apiGroup adsense
 * @apiName addAdsense
 * @apiParam {String} token token
 * @apiParam {String} adsense_name 广告位名称
 * @apiParam {String} adsense_number 广告位数量
 * @apiParam {String} adsense_code 识别码
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/addAdsense', function (req, res) {
    let data = req.body;
    if (!data.adsense_name || !data.adsense_number || !data.adsense_code) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    adsenseService.addAdsense(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});
/**
 * @api {post} /api/adsense/delAdsense 停用广告位
 * @apiGroup adsense
 * @apiName delAdsense
 * @apiParam {String} adsense_id 广告位ID
 * @apiParam {String} adsense_isable 状态1:可 0：否
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/delAdsense', function (req, res) {
    let data = req.body;
    if (!data.adsense_id || !data.adsense_isable) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    adsenseService.delAdsense(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/adsense/searchAdsense 广告位列表
 * @apiGroup adsense
 * @apiName searchAdsense
 * @apiParam {String} page  从
 * @apiParam {String} size 到
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchAdsense', function (req, res) {
    let data = req.body;
    if (!data.page || !data.size) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    adsenseService.searchAdsense(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});


/**
 * @api {post} /api/adsense/addAdvertisement 添加广告
 * @apiGroup adsense
 * @apiName addAdvertisement
 * @apiParam {String} token  登陆状态
 * @apiParam {String} adsense_id  广告位ID
 * @apiParam {String} advertisement_page 页码
 * @apiParam {String} advertisement_interval  轮播时间
 * @apiParam {String} advertisement_picture 广告图片
 * @apiParam {String} advertisement_url 链接
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/addAdvertisement', function (req, res) {
    let data = req.body;
    if (!data.adsense_id || !data.advertisement_page || !data.advertisement_interval || !data.advertisement_picture || !data.advertisement_url) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    adsenseService.addAdvertisement(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/adsense/searchAdvertisement 广告列表
 * @apiGroup adsense
 * @apiName searchAdvertisement
 * @apiParam {String} page  从
 * @apiParam {String} size 到
 * @apiParam {String} adsense_id  广告位ID
 * @apiParam {String} advertisement_page 页码
 * @apiParam {String} ago  从
 * @apiParam {String} end 到
 * @apiSuccess {String} advertisement_id 广告ID
 * @apiSuccess {String} advertisement_page 页码
 * @apiSuccess {String} advertisement_interval 轮播时间
 * @apiSuccess {String} advertisement_picture 广告图片
 * @apiSuccess {String} advertisement_url 链接
 * @apiSuccess {String} advertisement_createtime 发布时间
 * @apiSuccess {String} advertisement_isable 状态1可0不
 * @apiSuccess {String} 1 成功
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchAdvertisement', function (req, res) {
    let data = req.body;
    adsenseService.searchAdvertisement(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/adsense/delAdvertisement 停用广告
 * @apiGroup adsense
 * @apiName delAdvertisement
 * @apiParam {String} advertisement_id  广告ID
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/delAdvertisement', function (req, res) {
    let data = req.body;
    adsenseService.delAdvertisement(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});

module.exports = router;