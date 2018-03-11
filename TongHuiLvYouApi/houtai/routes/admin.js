const express = require('express');
const router = express.Router();
const userService = require('../../houtai/service/adminService');


/**
 * @api {post} /api/admin/loginAdmin 用户登陆
 * @apiGroup admin
 * @apiName loginAdmin
 * @apiParam {String} admin_name 用户登录名
 * @apiParam {String} admin_password 用户登录密码
 * @apiSuccess {String} admin_employeeName 员工姓名
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/loginAdmin', function (req, res) {
    let data = req.body;
    if (!data.admin_name || !data.admin_password) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    userService.loginAdmin(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/admin/searchAdmin 管理员列表
 * @apiGroup admin
 * @apiName searchAdmin
 * @apiParam {String} page 从
 * @apiParam {String} size 到
 * @apiParam {String} admin_name 用户名
 * @apiParam {String} admin_employeeName 员工姓名
 * @apiParam {String} from 从
 * @apiParam {String} reach 到
 * @apiParam {String} state 是否在职(1：在 0 ：不在)
 * @apiSuccess {String} admin_id 管理员列表ID
 * @apiSuccess {String} admin_name 管理员名
 * @apiSuccess {String} admin_code 员工编号
 * @apiSuccess {String} admin_employeeName 员工姓名
 * @apiSuccess {String} admin_sex 性别(1：男 0：女)
 * @apiSuccess {String} admin_contact 联系电话
 * @apiSuccess {String} admin_entryTime 入职时间
 * @apiSuccess {String} admin_state (1:在职0:离职)
 * @apiSuccess {String} role_id 角色ID
 * @apiSuccess {String} role_name 角色名称
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchAdmin', function (req, res) {
    let data = req.body;
    if (!data.page || !data.size) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    userService.searchAdmin(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/admin/addAdmin 添加管理员账号
 * @apiGroup admin
 * @apiName addAdmin
 * @apiParam {String} admin_name 管理员名
 * @apiParam {String} admin_code 员工编号
 * @apiParam {String} admin_employeeName 员工姓名
 * @apiParam {String} admin_password 密码
 * @apiParam {String} admin_sex 性别（1为男0为女）
 * @apiParam {String} admin_contact 联系方式
 * @apiParam {String} admin_entryTime 入职时间
 * @apiParam {String} role_id 角色ID
 * @apiParam {String} admin_state 状态(1:在职0：离职)
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/addAdmin', function (req, res) {
    let data = req.body;
    if (!data.admin_name || !data.admin_code || !data.admin_employeeName || !data.admin_password || !data.admin_sex || !data.admin_contact || !data.admin_entryTime ||  !data.admin_state) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    userService.addAdmin(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/admin/deleteAdmin 删除管理员账号
 * @apiGroup admin
 * @apiName deleteAdmin
 * @apiParam {String} admin_id 管理员ID
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/deleteAdmin', function (req, res) {
    let data = req.body;
    userService.deleteAdmin(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});


/**
 * @api {post} /api/admin/updateAdmin 更改管理员账号
 * @apiGroup admin
 * @apiName updateAdmin
 * @apiParam {String} admin_id 管理员ID
 * @apiParam {String} admin_name 管理员名
 * @apiParam {String} admin_employeeName 员工姓名
 * @apiParam {String} admin_contact 联系电话
 * @apiParam {String} admin_entryTime 入职时间
 * @apiParam {String} admin_sex 性别
 * @apiParam {String} admin_code 员工编号
 * @apiParam {String} admin_password 密码
 * @apiParam {String} admin_state 是否离职(1在0否)
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/updateAdmin', function (req, res) {
    let data = req.body;
    userService.updateAdmin(data).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
});


module.exports = router;