const express = require('express');
const router = express.Router();
const userService = require('../../houtai/service/userService');

/**
 * @api {post} /api/users/searchUser 用户列表
 * @apiGroup users
 * @apiName searchUser
 * @apiParam {String} page 从
 * @apiParam {String} size 到
 * @apiParam {String} user_nickname 昵称
 * @apiParam {String} user_phone 手机
 * @apiSuccess {String} user_id 用户ID
 * @apiSuccess {String} user_nickname 昵称
 * @apiSuccess {String} user_phone 电话
 * @apiSuccess {String} user_gender 性别(1:男,0:女)
 * @apiSuccess {String} user_birthday 生日
 * @apiSuccess {String} wallet_money 账户余额
 * @apiSuccess {String} user_isable 是否有效(1:有0:否)
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchUser', function (req, res) {
    let data = req.body;
    if (!data.page || !data.size) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    userService.searchUser(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});
/**
 * @api {post} /api/users/addUser 添加用户
 * @apiGroup users
 * @apiName addUser
 * @apiParam {String} user_phone 手机
 * @apiParam {String} user_password 密码
 * @apiParam {String} user_nickname 昵称
 * @apiParam {String} user_gender 性别(1:男0:女)
 * @apiParam {String} user_birthday 生日
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/addUser', function (req, res) {
    let data = req.body;
    userService.addUser(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});
/**
 * @api {post} /api/users/deleteUser 删除用户
 * @apiGroup users
 * @apiName deleteUser
 * @apiParam {String} user_id 用户ID
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/deleteUser', function (req, res) {
    let data = req.body;
    if (!data.user_id) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    userService.deleteUser(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});
/**
 * @api {post} /api/users/updateUser 更改用户
 * @apiGroup users
 * @apiName updateUser
 * @apiParam {String} user_id 用户ID
 * @apiParam {String} user_phone 手机
 * @apiParam {String} user_password 密码
 * @apiParam {String} user_nickname 昵称
 * @apiParam {String} user_gender 性别(1:男0:女)
 * @apiParam {String} user_birthday 生日
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/updateUser', function (req, res) {
    let data = req.body;
    if (!data.user_id) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    userService.updateUser(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});
/**
 * @api {post} /api/users/searchUserDetailed 用户详细信息
 * @apiGroup users
 * @apiName searchUserDetailed
 * @apiParam {String} user_id 用户ID
 * @apiSuccess {String} user_phone 手机
 * @apiSuccess {String} user_password 密码
 * @apiSuccess {String} user_nickname 昵称
 * @apiSuccess {String} user_gender 性别(1:男0:女)
 * @apiSuccess {String} user_head 头像
 * @apiSuccess {String} user_birthday 生日
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchUserDetailed', function (req, res) {
    let data = req.body;
    if (!data.user_id) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    userService.searchUserDetailed(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});

module.exports = router;