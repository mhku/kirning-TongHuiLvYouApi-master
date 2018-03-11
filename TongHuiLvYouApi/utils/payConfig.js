/**
 * Created by Administrator on 2017/8/31.
 */
const serverUrl = '192.168.2.114:4001';

const config = {
    // 支付宝服务器通知的页面 要用 http://格式的完整路径，不允许加?id:123这类自定义参数
// 必须保证其地址能够在互联网中访问的到
    notify_url: `http://${serverUrl}/api/filghr/notified`,

// 当前页面跳转后的页面 要用 http://格式的完整路径，不允许加?id:123这类自定义参数
// 域名不能写成http://localhost/create_direct_pay_by_user_jsp_utf8/return_url.jsp ，否则会导致return_url执行无效
    return_url: `http://${serverUrl}/api/filghr/paymentReturn`,

    //充值接口回调通知
    retonline_url: `http://${serverUrl}/api/recharge/retonline`,
};
module.exports = config;