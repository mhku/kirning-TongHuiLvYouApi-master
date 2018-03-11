const express = require('express');
const router = express.Router();
const reward_userService = require('../../houtai/service/reward_userService');

/**
 * @api {post} /api/reward_user/searchReward_user 中奖用户列表
 * @apiGroup reward_user
 * @apiName searchReward_user
 * @apiParam {String} token
 * @apiParam {String} page
 * @apiParam {String} size
 * @apiParam {String} search_type 1:后台查询 2：查询自己的抽奖记录
 * @apiParam {String} type 抽奖结果
 * @apiParam {String} name 抽奖用户名字
 * @apiParam {String} state 状态(1:已处理 0:待处理)
 * @apiSuccess {String} reward_user_id ID
 * @apiSuccess {String} reward_user_name 中奖人
 * @apiSuccess {String} reward_explain 中奖内容
 * @apiSuccess {String} reward_user_phone 手机号
 * @apiSuccess {String} reward_user_state 状态(1:已处理 0:待处理)
 * @apiSuccess {String} reward_isuse 是否使用(1:是 0:否)
 * @apiSuccess {String} reward_user_creatime 创建时间
 * @apiSuccess {String} reward_user_isable 是否删除(1:是 0:否)
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchReward_user', function (req, res) {
    let data = req.body;
    if (!data.page || !data.size || !data.search_type) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    reward_userService.searchReward_user(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});


/**
 * @api {post} /api/reward_user/addReward 用户抽奖
 * @apiGroup reward_user
 * @apiName addReward
 * @apiParam {String} token
 * @apiSuccess {String} jp 奖品类型(1：红包 2：话费 3：机票 4：谢谢参与 5：旅游产品 6：流量 7：门票 8：火车票 9：酒店 10：油卡 )
 * @apiSuccess {String} detailed 奖品详细信息
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/addReward', function (req, res) {
    let data = req.body;
    reward_userService.addReward(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/reward_user/handleReward 处理用户中奖记录
 * @apiGroup reward_user
 * @apiName handleReward
 * @apiParam {String} token
 * @apiParam {String} reward_user_id
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/handleReward', function (req, res) {
    let data = req.body;
    if (!data.reward_user_id) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    reward_userService.handleReward(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});


module.exports = router;