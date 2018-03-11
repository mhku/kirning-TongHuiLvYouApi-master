const express = require('express');
const router = express.Router();
const rewardService = require('../../houtai/service/rewardService');

/**
 * @api {post} /api/reward/searchReward 奖品列表
 * @apiGroup reward
 * @apiName searchReward
 * @apiParam {String} token
 * @apiParam {String} type 1:查询奖品 2：查询奖品下的中奖概率
 * @apiParam {String} reward_id 父类ID
 * @apiSuccess {String} reward_id ID
 * @apiSuccess {String} reward_start 从
 * @apiSuccess {String} reward_end 到
 * @apiSuccess {String} reward_probability 几率
 * @apiSuccess {String} reward_ordinal 序号
 * @apiSuccess {String} reward_type 奖品类型(1：红包 2：话费 3：机票 4：谢谢参与 5：旅游产品 6：流量 7：门票 8：火车票 9：酒店 10：油卡 )
 * @apiSuccess {String} reward_picture 奖品图标
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchReward', function (req, res) {
    let data = req.body;
    if (!data.type) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    if (data.type == 2) {
        if (!data.reward_id) {
            return res.send({code: 2, msg: "参数不齐"});
        }
    }
    rewardService.searchReward(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});


/**
 * @api {post} /api/reward/upReward_picture 更改奖品图标
 * @apiGroup reward
 * @apiName upReward_picture
 * @apiParam {String} token
 * @apiParam {String} reward_picture 奖品图标
 * @apiParam {String} reward_id ID
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/upReward_picture', function (req, res) {
    let data = req.body;
    if (!data.reward_picture || !data.reward_id) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    rewardService.upReward_picture(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});


module.exports = router;