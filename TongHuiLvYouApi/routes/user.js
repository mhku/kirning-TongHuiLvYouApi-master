const express = require('express');
const router = express.Router();
const logger = require('../utils/logHelper').helper;
const userService = require('../service/userService');
const luck_drawService = require('../service/luck_drawService');


/**
 * @api {post} /api/user/addUser 添加用户
 * @apiGroup User
 * @apiName addUser
 * @apiParam {String} user_name 用户登录名
 * @apiParam {String} user_password 用户密码
 * @apiParam {String} user_nickname 用户昵称
 * @apiParam {String} user_phone 用户手机号码
 * @apiParam {String} user_gender 用户性别
 * @apiParam {String} user_birthday 用户生日
 * @apiParam {String} user_head 用户头像
 * @apiSuccess {String} 1 添加成功
 * @apiError {String} 2 添加失败
 * @apiError {String} 3 错误信息
 */
router.post('/addUser', (req, res) => {
    logger.startLog();
    let data = req.body;
    userService.addUser(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }, err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/user/delUser 删除用户
 * @apiGroup User
 * @apiName delUser
 * @apiParam {String} user_id 用户登录名
 * @apiSuccess {String} 1 删除成功
 * @apiError {String} 2 删除失败
 * @apiError {String} 3 错误信息
 */
router.post('/delUser', (req, res) => {
    logger.startLog();
    let data = req.body;
    userService.delUser(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }, err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/user/updateUser 修改用户
 * @apiGroup User
 * @apiName updateUser
 * @apiParam {String} token token
 * @apiParam {String} user_name 用户登录名
 * @apiParam {String} user_password 用户密码
 * @apiParam {String} user_nickname 用户昵称
 * @apiParam {String} user_phone 用户手机号码
 * @apiParam {String} user_gender 用户性别
 * @apiParam {String} user_birthday 用户生日
 * @apiParam {String} user_head 用户头像
 * @apiSuccess {String} 1 修改成功
 * @apiError {String} 2 修改失败
 * @apiError {String} 3 错误信息
 */
router.post('/updateUser', (req, res) => {
    logger.startLog();
    let data = req.body;
    userService.updateUser(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }, err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/user/findUser 查找用户
 * @apiGroup User
 * @apiName findUser
 * @apiParam {String} token token
 * @apiSuccess {String} 1 查找成功
 * @apiError {String} 2 查找失败
 * @apiError {String} 3 错误信息
 */
router.post('/findUser', (req, res) => {
    logger.startLog();
    let data = req.body;
    userService.findUser(data).then(val => {
        logger.endLog(val);
        res.send(val);
    }, err => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/user/userLogin 用户登录
 * @apiGroup User
 * @apiName userLogin
 * @apiParam {String} username 用户名
 * @apiParam {String} password 用户密码
 * @apiSuccess {String} 1 登录成功
 * @apiError {String} 2 登录失败
 * @apiError {String} 3 错误信息
 */
router.post('/userLogin', (req, res) => {
    let data = req.body;
    if (!data.username || !data.password) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    logger.startLog();
    userService.userLogin(data).then((val) => {
        logger.endLog(val);
        res.send(val);
    }).catch((err) => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/user/userRegister 用户注册
 * @apiGroup User
 * @apiName userRegister
 * @apiParam {String} username 用户名
 * @apiParam {String} password 用户密码
 * @apiParam {String} mobile 手机号码
 * @apiParam {String} payword 支付密码，6位数字，不能6个同样数字和123456（暂不填）
 * @apiSuccess {String} 1 注册成功
 * @apiError {String} 2 注册失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/userRegister', (req, res) => {
    let data = req.body;
    if (!data.username || !data.password || !data.mobile) {
        res.send({code: 4, msg: "参数不齐"});
        return;
    }
    logger.startLog();
    userService.userRegister(data).then((val) => {
        logger.endLog(val);
        res.send(val);
    }).catch((err) => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/user/lifePay 余额支付
 * @apiGroup User
 * @apiName lifePay
 * @apiParam {String} token token
 * @apiParam {String} order_id 订单ID
 * @apiParam {String} payword 支付密码，6位数字，不能6个同样数字和123456
 * @apiSuccess {String} 1 注册成功
 * @apiError {String} 2 注册失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/lifePay', (req, res) => {
    // let data = req.body;
    // if (!data.order_id || !data.payword) {
    //     res.send({code: 4, msg: "参数不齐"});
    //     return;
    // }
    // logger.startLog();
    // userService.getUserInfo(data).then((val) => {
    //     logger.endLog(val);
    //     res.send(val);
    // }).catch((err) => {
    //     logger.endErrLog(err);
    //     res.send(err);
    // });
    res.send("接口不可使用");
});

/**
 * @api {post} /api/user/getUserInfo 获取用户信息
 * @apiGroup User
 * @apiName getUserInfo
 * @apiParam {String} token token
 * @apiSuccess {String} username 用户名
 * @apiSuccess {String} nickname 昵称
 * @apiSuccess {String} mobile 手机号码
 * @apiSuccess {String} face 头像
 * @apiSuccess {String} life_price 用户当前生活费余额，单位：元
 * @apiSuccess {String} freeze_life_price 冻结的生活费余额，单位：元
 * @apiSuccess {String} 1 查找成功
 * @apiError {String} 2 查找失败
 * @apiError {String} 3 错误信息
 * @apiError {String} 4 参数不齐
 */
router.post('/getUserInfo', (req, res) => {
    let data = req.body;
    logger.startLog();
    userService.getUser(data).then((val) => {
        logger.endLog(val);
        res.send(val);
    }).catch((err) => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/user/getAccess_token 获取Access_token
 * @apiGroup User
 * @apiName getAccess_token
 * @apiSuccess {String} 1 登录成功
 * @apiError {String} 2 登录失败
 * @apiError {String} 3 错误信息
 */
router.post('/getAccess_token', (req, res) => {
    logger.startLog();
    userService.getAccess_token().then((val) => {
        logger.endLog(val);
        res.send(val);
    }).catch((err) => {
        logger.endErrLog(err);
        res.send(err);
    });
});

/**
 * @api {post} /api/user/findUserLuckDraw 获取用户的抽奖记录信息
 * @apiGroup User
 * @apiName findUserLuckDraw
 * @apiParam {String} token token
 * @apiSuccess {String} luck_draw_count 剩余抽奖数
 * @apiSuccess {String} 1 登录成功
 * @apiError {String} 2 登录失败
 * @apiError {String} 3 错误信息
 */
router.post('/findUserLuckDraw', (req, res) => {
    const data = req.body;
    logger.startLog();
    luck_drawService.findUserLuckDraw(data).then((val) => {
        logger.endLog(val);
        res.send(val);
    }).catch((err) => {
        logger.endErrLog(err);
        res.send(err);
    });
});

module.exports = router;
