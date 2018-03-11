const express = require('express');
const router = express.Router();
const menuService = require('../../houtai/service/menuService');
const logger = require("../../utils/logHelper").helper;

function log() {
    logger.writeInfo("请求开始");
}

/**
 * @api {post} /api/menu/addMenu 添加菜单
 * @apiGroup menu
 * @apiName addMenu
 * @apiParam {String} token
 * @apiParam {String} menu_parentid 上级菜单（有则传）
 * @apiParam {String} menu_name 菜单名字
 * @apiParam {String} menu_icon 菜单图标名
 * @apiParam {String} menu_path 菜单地址
 * @apiParam {String} menu_level 第几级菜单(1 最高级)
 * @apiParam {String} menu_key 数据接收需要
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/addMenu', function (req, res) {
    log();
    var data = req.body;
    if (!data.menu_name || !data.menu_level) {
        res.send({code: 2, error: '参数不齐'});
        return;
    }
    menuService.addMenu(data).then((result) => {
        logger.writeInfo("结果:" + JSON.stringify(result) + ",请求结束");
        res.send(result);
    }, (error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/menu/updateMenu 修改菜单
 * @apiGroup menu
 * @apiName updateMenu
 * @apiParam {String} token
 * @apiParam {String} menu_id 菜单ID
 * @apiParam {String} menu_name 菜单名字
 * @apiParam {String} menu_icon 菜单图标名
 * @apiParam {String} menu_path 菜单地址
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/updateMenu', function (req, res) {
    log();
    var data = req.body;
    if (!data.menu_name || !data.menu_id) {
        res.send({code: 2, error: '参数不齐'});
        return;
    }
    menuService.updateMenu(data).then((result) => {
        logger.writeInfo("结果:" + JSON.stringify(result) + ",请求结束");
        res.send(result);
    }, (error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/menu/delMenu 删除菜单
 * @apiGroup menu
 * @apiName delMenu
 * @apiParam {String} token
 * @apiParam {String} menu_id 菜单ID
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/delMenu', function (req, res) {
    log();
    var data = req.body;
    if (!data.menu_id) {
        res.send({code: 2, error: '参数不齐'});
        return;
    }
    menuService.delMenu(data).then((result) => {
        logger.writeInfo("结果:" + JSON.stringify(result) + ",请求结束");
        res.send(result);
    }, (error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/menu/searchMenuList 查看第一级菜单列表
 * @apiGroup menu
 * @apiName searchMenuList
 * @apiParam {String} token
 * @apiSuccess {String} menu_id 菜单ID
 * @apiSuccess {String} menu_name 菜单名
 * @apiSuccess {String} menu_icon 图标名
 * @apiSuccess {String} menu_path 菜单地址
 * @apiSuccess {String} menu_parentid 菜单父类ID
 * @apiSuccess {String} menu_level 第几级菜单(1 最高级)
 * @apiSuccess {String} menu_creator 创建人
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchMenuList', function (req, res) {
    log();
    let data = req.body;
    menuService.searchMenuList(data).then((result) => {
        logger.writeInfo("结果:" + JSON.stringify(result) + ",请求结束");
        res.send(result);
    }, (error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/menu/searchMenuListAll 查看全部菜单
 * @apiGroup menu
 * @apiName searchMenuListAll
 * @apiSuccess {String} menu_id 菜单ID
 * @apiSuccess {String} menu_name 菜单名
 * @apiSuccess {String} menu_icon 图标名
 * @apiSuccess {String} menu_path 菜单地址
 * @apiSuccess {String} menu_parentid 菜单父类ID
 * @apiSuccess {String} menu_level 第几级菜单(1 最高级)
 * @apiSuccess {String} menu_creator 创建人
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchMenuListAll', function (req, res) {
    log();
    let data = req.body;
    menuService.searchMenuListAll(data).then((result) => {
        logger.writeInfo("结果:" + JSON.stringify(result) + ",请求结束");
        res.send(result);
    }, (error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/menu/searchMenuListByParentId 通过菜单ID查看下级菜单
 * @apiGroup menu
 * @apiName searchMenuListByParentId
 * @apiParam {String} menu_id 菜单ID
 * @apiParam {String} token
 * @apiSuccess {String} menu_id 菜单ID
 * @apiSuccess {String} menu_name 菜单名
 * @apiSuccess {String} menu_icon 图标名
 * @apiSuccess {String} menu_path 菜单地址
 * @apiSuccess {String} menu_parentid 菜单父类ID
 * @apiSuccess {String} menu_level 第几级菜单(1 最高级)
 * @apiSuccess {String} menu_creator 创建人
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchMenuListByParentId', function (req, res) {
    log();
    let data = req.body;
    if (!data.menu_id) {
        res.send({code: 2, error: '参数不齐'});
        return;
    }
    menuService.searchMenuListByParentId(data).then((result) => {
        logger.writeInfo("结果:" + JSON.stringify(result) + ",请求结束");
        res.send(result);
    }, (error) => {
        res.send(error);
    })
});

module.exports = router;