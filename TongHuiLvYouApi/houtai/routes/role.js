const express = require('express');
const router = express.Router();
const roleService = require('../../houtai/service/roleService');
const logger = require("../../utils/logHelper").helper;

function log() {
    logger.writeInfo("请求开始");
}

/**
 * @api {post} /api/role/searchRoleList 查看角色列表
 * @apiGroup role
 * @apiName searchRoleList
 * @apiParam {String} token token
 * @apiParam {String} start 页码
 * @apiParam {String} length 一页数量
 * @apiSuccess {String} role_id 角色ID
 * @apiSuccess {String} role_name 角色名
 * @apiSuccess {String} role_isable 是否有效（有效1:0:无效）
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchRoleList', function (req, res) {
    log();
    let data = req.body;
    if (!data.start || !data.length) {
        res.send({code: 2, error: '参数不齐'});
        return;
    }
    let page = parseInt(data.start);
    let size = parseInt(data.length);
    data.page = page;
    data.size = size;
    roleService.searchRoleList(data).then((result) => {
        logger.writeInfo("结果:" + JSON.stringify(result) + ",请求结束");
        res.send(result);
    }, (error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/role/searchRoleListSearch 查看角色列表
 * @apiGroup role
 * @apiName searchRoleListSearch
 * @apiParam {String} token token
 * @apiParam {String} start 页码
 * @apiParam {String} length 一页数量
 * @apiSuccess {String} role_id 角色ID
 * @apiSuccess {String} role_name 角色名
 * @apiSuccess {String} role_isable 是否有效（有效1:0:无效）
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchRoleListSearch', function (req, res) {
    log();
    let data = req.body;
    if (!data.start || !data.length) {
        res.send({code: 2, error: '参数不齐'});
        return;
    }
    let page = parseInt(data.start);
    let size = parseInt(data.length);
    data.page = page;
    data.size = size;
    roleService.searchRoleListSearch(data).then((result) => {
        logger.writeInfo("结果:" + JSON.stringify(result) + ",请求结束");
        res.send(result);
    }, (error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/role/addRole 添加角色
 * @apiGroup role
 * @apiName addRole
 * @apiParam {String} token
 * @apiParam {String} role_name 角色名
 * @apiParam {String} menu_id 以逗号隔开的菜单id
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/addRole', function (req, res) {
    log();
    var data = req.body;
    if (!data.role_name || !data.menu_id) {
        res.send({code: 2, error: '参数不齐'});
        return;
    }
    roleService.addRole(data).then((result) => {
        logger.writeInfo("结果:" + JSON.stringify(result) + ",请求结束");
        res.send(result);
    }, (error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/role/updateRole 修改角色
 * @apiGroup role
 * @apiName updateRole
 * @apiParam {String} token
 * @apiParam {String} role_id 角色ID
 * @apiParam {String} role_name 角色名
 * @apiParam {String} menu_id 以逗号隔开的菜单id
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/updateRole', function (req, res) {
    log();
    var data = req.body;
    if (!data.role_name || !data.menu_id || !data.role_id) {
        res.send({code: 2, error: '参数不齐'});
        return;
    }
    roleService.updateRole(data).then((result) => {
        logger.writeInfo("结果:" + JSON.stringify(result) + ",请求结束");
        res.send(result);
    }, (error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/role/delRole 删除角色
 * @apiGroup role
 * @apiName delRole
 * @apiParam {String} token
 * @apiParam {String} role_id 角色ID
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/delRole', function (req, res) {
    log();
    var data = req.body;
    if (!data.role_id) {
        res.send({code: 2, error: '参数不齐'});
        return;
    }
    roleService.delRole(data).then((result) => {
        logger.writeInfo("结果:" + JSON.stringify(result) + ",请求结束");
        res.send(result);
    }, (error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/role/searchMenuByRoleId 通过角色ID查找菜单
 * @apiGroup role
 * @apiName searchMenuByRoleId
 * @apiParam {String} token
 * @apiParam {String} role_id 角色ID
 * @apiSuccess {String} menu_id 菜单ID
 * @apiSuccess {String} menu_name 菜单名
 * @apiSuccess {String} menu_icon 图标名
 * @apiSuccess {String} menu_path 菜单地址
 * @apiSuccess {String} menu_key 数据接收需要
 * @apiSuccess {String} menu_parentid 菜单父类ID
 * @apiSuccess {String} menu_level 第几级菜单(1 最高级)
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchMenuByRoleId', function (req, res) {
    log();
    let data = req.body;
    if (!data.role_id) {
        res.send({code: 2, error: '参数不齐'});
        return;
    }
    roleService.searchMenuByRoleId(data).then((result) => {
        logger.writeInfo("结果:" + JSON.stringify(result) + ",请求结束");
        res.send(result);
    }, (error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/role/updateRoleState 更改角色状态
 * @apiGroup role
 * @apiName updateRoleState
 * @apiParam {String} role_isable 1:可0:否
 * @apiParam {String} role_id 角色ID
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/updateRoleState', function (req, res) {
    log();
    var data = req.body;
    if (!data.role_isable || !data.role_id) {
        res.send({code: 2, error: '参数不齐'});
        return;
    }
    roleService.updateRoleState(data).then((result) => {
        logger.writeInfo("结果:" + JSON.stringify(result) + ",请求结束");
        res.send(result);
    }, (error) => {
        res.send(error);
    })
});
module.exports = router;