const express = require('express');
const router = express.Router();
const windowService = require('../../houtai/service/windowService');

/**
 * @api {post} /api/window/addWindow 添加橱窗
 * @apiGroup window
 * @apiName addWindow
 * @apiParam {String} token 登陆状态
 * @apiParam {String} handles 1,批量删除/添加 2,单个添加
 * @apiParam {String} window_destination 目的地
 * @apiParam {String} window_pictrue 图片
 * @apiParam {String} window_type 类型(1,目的地 2,精选景点 3,主图 4,首页图片 5,酒店广告 6,机票广告 7,门票广告 8,火车票广告 9,意外险广告 10,航意险广告 11,旅游险广告 12,交通险广告 13,你可能想去橱窗)
 * @apiParam {String} window_number 序号
 * @apiParam {String} windows 数据集合[{"window_destination":"21313","window_pictrue":"图片","window_type":"1","window_number":"1"},{"window_destination":"21313","window_pictrue":"图片","window_type":"1","window_number":"1"}]
 * @apiParam {String} window_link 连接
 * @apiParam {String} window_price 价格
 * @apiParam {String} window_class 橱窗类型
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/addWindow', function (req, res) {
    let data = req.body;
    if (data.handles == 1) {
        if (!data.window_type || !data.windows) {
            return res.send({code: 2, msg: "参数不齐"});
        }
    }
    if (data.handles == 2) {
        if (!data.window_destination || !data.window_pictrue || !data.window_number || !data.window_type) {
            return res.send({code: 2, msg: "参数不齐"});
        }
    }
    if (data.handles != 1 && data.handles != 2) {
        return res.send({code: 2, msg: "参数错误"});
    }
    windowService.addWindow(data).then((result) => {
        res.send(result);
    }, (error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/window/addPlace 添加地点
 * @apiGroup window
 * @apiName addPlace
 * @apiParam {String} token 登陆状态
 * @apiParam {String} place_name 地点
 * @apiParam {List} windowList 图片集合
 * @apiParam {String} windowList.window_destination 地点名
 * @apiParam {String} windowList.window_pictrue 图片地址
 * @apiParam {String} windowList.window_number 序号
 * @apiParam {String} windowList.window_price 价格
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/addPlace', function (req, res) {
    let data = req.body;
    if (!data.place_name || !data.windowList) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    windowService.addPlace(data).then((result) => {
        res.send(result);
    }, (error) => {
        res.send(error);
    });
});
/**
 * @api {post} /api/window/updatePlace 修改地点
 * @apiGroup window
 * @apiName updatePlace
 * @apiParam {String} token 登陆状态
 * @apiParam {String} place_id 地点ID
 * @apiParam {String} place_name 地点名字
 * @apiParam {List} windowList 图片集合
 * @apiParam {String} windowList.window_destination 地点名
 * @apiParam {String} windowList.window_pictrue 图片地址
 * @apiParam {String} windowList.window_number 序号
 * @apiParam {String} windowList.window_price 价格
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/updatePlace', function (req, res) {
    let data = req.body;
    if (!data.place_name || !data.windowList || !data.place_id) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    windowService.updatePlace(data).then((result) => {
        res.send(result);
    }, (error) => {
        res.send(error);
    });
});

/**
 * @api {post} /api/window/searchPlace 查询橱窗
 * @apiGroup window
 * @apiName searchPlace
 * @apiParam {String} page 从
 * @apiParam {String} size 到
 * @apiSuccess {String} place_id 地点ID
 * @apiSuccess {String} place_name 地点名字
 * @apiSuccess {String} place_isable 是否有效(1可用0不可用)
 * @apiSuccess {List} windowList 图片集合
 * @apiSuccess {String} windowList.window_id 图片ID
 * @apiSuccess {String} windowList.window_destination 中文名
 * @apiSuccess {String} windowList.window_number 序号
 * @apiSuccess {String} windowList.window_pictrue 图片地址
 * @apiSuccess {String} windowList.window_price 价格
 * @apiSuccess {String} windowList.window_createtime 创建时间
 * @apiSuccess {String} windowList.window_isable 1可用0不可用
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchPlace', function (req, res) {
    let data = req.body;
    if (!data.page || !data.size) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    data.page = parseInt(data.page);
    data.size = parseInt(data.size);
    windowService.searchPlace(data).then((result) => {
        res.send(result);
    }, (error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/window/searchWindow 查询橱窗
 * @apiGroup window
 * @apiName searchWindow
 * @apiParam {String} page 从
 * @apiParam {String} size 到
 * @apiParam {String} window_destination 目的地
 * @apiParam {String} window_type 类型(1,目的地 2,精选景点 3,主图 4,首页图片 5,酒店广告 6,机票广告 7,门票广告 8,火车票广告 9,意外险广告 10,航意险广告 11,旅游险广告 12,交通险广告 13,你可能想去橱窗)
 * @apiSuccess {String} window_id 橱窗ID
 * @apiSuccess {String} window_destination 目的地
 * @apiSuccess {String} window_pictrue 图片
 * @apiSuccess {String} window_link 连接
 * @apiSuccess {String} window_price 价格
 * @apiSuccess {String} window_createtime 创建时间
 * @apiSuccess {String} window_isable 1可用0不可用
 * @apiSuccess {String} window_class 橱窗类型
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchWindow', function (req, res) {
    let data = req.body;
    if (!data.window_type) {
        return res.send({code: 2, msg: "参数不齐"});
    }
    windowService.searchWindow(data).then((result) => {
        res.send(result);
    }, (error) => {
        res.send(error);
    })
});
/**
 * @api {post} /api/window/upWindow 更改橱窗状态
 * @apiGroup window
 * @apiName upWindow
 * @apiParam {String} window_id 橱窗ID
 * @apiParam {String} states 1：启用 0 ：禁用  3:删除
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/upWindow', function (req, res) {
    let data = req.body;
    windowService.upWindow(data).then((result) => {
        res.send(result);
    }, (error) => {
        res.send(error);
    })
});
/**
 * @api {post} /api/window/updateWindow 修改橱窗信息
 * @apiGroup window
 * @apiName updateWindow
 * @apiParam {String} window_id 橱窗ID
 * @apiParam {String} window_destination 地点
 * @apiParam {String} window_pictrue 图片
 * @apiParam {String} window_link 连接
 * @apiParam {String} window_price 价格
 * @apiParam {String} window_class 1 是超链接 2是酒店 3门票 4飞机票首页 5火车票首页 6油卡充值首页 7游戏充值首页
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/updateWindow', function (req, res) {
    let data = req.body;
    windowService.updateWindow(data).then((result) => {
        res.send(result);
    }, (error) => {
        res.send(error);
    })
});

/**
 * @api {post} /api/window/searchAllWindow 查询全部橱窗信息
 * @apiGroup window
 * @apiName searchAllWindow
 * @apiSuccess {String} window_id 橱窗ID
 * @apiSuccess {String} window_destination 目的地
 * @apiSuccess {String} window_class 窗口类型
 * @apiSuccess {String} window_pictrue 图片
 * @apiSuccess {String} window_id 橱窗ID
 * @apiSuccess {String} window_link 连接
 * @apiSuccess {String} window_price 价格
 * @apiSuccess {String} window_isable 1可用0不可用
 * @apiSuccess {list} destination 目的地
 * @apiSuccess {list} spot 精选景点
 * @apiSuccess {list} master_map 主图
 * @apiSuccess {list} home_page_picture 首页图片
 * @apiSuccess {list} hotel_advertising 酒店图片
 * @apiSuccess {list} air_ticket_advertisement 机票图片
 * @apiSuccess {list} ticket_advertising 门票广告
 * @apiSuccess {list} train_ticket_advertising 火车票广告
 * @apiSuccess {list} accident_insurance 意外险广告
 * @apiSuccess {list} insurance_advertisement 航意险广告
 * @apiSuccess {list} tourism_insurance 旅游险广告
 * @apiSuccess {list} traffic_insurance_advertising 交通险广告
 * @apiSuccess {list} other 你可能想去的橱窗
 * @apiSuccess {String} 1 成功
 * @apiError {String} 2 失败
 * @apiError {String} 3 错误信息
 */
router.post('/searchAllWindow', function (req, res) {
    let data = req.body;
    windowService.searchAllWindow(data).then((result) => {
        res.send(result);
    }, (error) => {
        res.send(error);
    })
});


module.exports = router;