const moment = require('moment');
const autoConfigure = {

    //待支付订单自动取消时间(size: 大小, unit: 单位 )
    orderCancelTime: {size: 6, unit: 'hours'},

    //待使用订单自动确认使用时间
    orderConfirmationTime: {size: 1, unit: 'weeks'},

    //待评价订单自动完成时间
    orderFinishTime: {size: 1, unit: 'weeks'},
};
module.exports = autoConfigure;