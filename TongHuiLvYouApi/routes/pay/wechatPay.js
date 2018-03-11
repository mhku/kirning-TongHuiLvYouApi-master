const express = require('express');
const router = express.Router();
const logger = require("../../util/logHelper").helper;
const payrecordService = require("../../service/payrecordService");

/**
 * 微信异步回调接口
 */
router.post('wechatPayNotify', (req, res) => {
    const xml = req.body.xml;
    if (!xml) {
        res.end("FAIL");
        return;
    }
    const result_code = xml.result_code[0]; //支付结果
    const order_no = xml.out_trade_no[0]; //订单号
    const total_fee = xml.total_fee[0]; //支付金额
    const attach = xml.attach[0];   //商家数据包

    if (result_code === 'SUCCESS') {
        //查询订单信息
        const totalFee = parseFloat(total_fee);
        payrecordService.payCallBack(order_no, '2', total_fee).then((res) => {
            res.send("SUCCESS");
        }).catch(err => {
            console.error(err);
            res.send("SUCCESS");
        });
    } else {
        res.send("SUCCESS");
    }
})