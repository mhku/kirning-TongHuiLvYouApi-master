const express = require('express');
const router = express.Router();
const reward_explainService = require('../../houtai/service/reward_explainService');

/**
 * @api {post} /api/reward_explain/addReward_explain 添加抽奖说明
 * @apiGroup reward_explain
 * @apiName addReward_explain
 * @apiParam {String} token
 * @apiParam {String} reward_explain_text 抽奖说明
 * @apiSuccess {String} reward_explain_text 抽奖说明
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/addReward_explain', function (req, res) {
    let data = req.body;
    if (!data.reward_explain_text) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    reward_explainService.addReward_explain(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});


/**
 * @api {post} /api/reward_explain/searchReward_explain 查询抽奖说明
 * @apiGroup reward_explain
 * @apiName searchReward_explain
 * @apiParam {String} token
 * @apiSuccess {String} reward_explain_text 抽奖说明
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchReward_explain', function (req, res) {
    let data = req.body;
    reward_explainService.searchReward_explain(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});


module.exports = router;