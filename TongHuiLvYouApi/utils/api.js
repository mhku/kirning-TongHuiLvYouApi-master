/**
 * Created by Administrator on 2017/8/28.
 */
//航班接口统一前缀
const FilghrApi = 'http://ws.51book.com:8000/ltips/services';
//欧飞接口api前缀
const RechargApi = 'http://api2.ofpay.com';
//水电煤生活缴费接口api前缀
const Life = 'http://api.saiheyi.com/SPI';
//酒店接口统一前缀
// const Scenic = 'http://180.168.128.250:8090/tnt_api/distributorApi/2.0/api/'; //测试
const Scenic = 'http://api.lvmama.com/distributorApi/2.0/api'; //正式接口


const api = {
    //航班接口
    flighr: {
        //航班查询（含票面价、返佣）
        getAvailableFlightWithPriceAndCommision: FilghrApi + '/getAvailableFlightWithPriceAndCommisionService1.0?wsdl',
        //航班政策查询接口
        createOrderByPassenger: FilghrApi + '/createOrderByPassengerService1.0?wsdl',
        //航班订单取消
        cancelPlaneOrder: FilghrApi + '/cancelOrderService1.0?wsdl',
        //根据航空公司、舱位获取退改签规定
        getModifyAndRefundStipulate: FilghrApi + '/getModifyAndRefundStipulateService1.0?wsdl',
        //实时获取每日最低价
        getDailyLowestPrice: FilghrApi + '/getDailyLowestPriceService1.0?wsdl',
        //航班订单自动支付
        pay: FilghrApi + '/payService1.0?wsdl',
        //航班取消订单
        cancelOrder: FilghrApi + '/cancelOrderService1.0?wsdl',
        //通过订单号查询订单详情
        getOrderByOrderNo: FilghrApi + '/getOrderByOrderNoService1.0?wsdl',
        //订单退票
        applyPolicyOrderRefund: FilghrApi + '/applyPolicyOrderRefundService1.0?wsdl',
    },

    //火车票接口
    train: {
        //火车票查询
        gettrainSearch: 'http://www.51bib.com/TrainSearchList.ashx',
        //票价查询接口
        trainsearchPrice: 'http://www.51bib.com/triansearchPrice.ashx',
        //车票下单
        trainCreate: 'http://www.51bib.com/trainCreate.ashx',
        //火车票订单支付接口
        trainpay: 'http://www.51bib.com/trainpay.ashx',
        //火车票的订单状态接口
        trainOrderInfo: 'http://www.51bib.com/trainOrderInfo.ashx',
        //火车票退票接口
        trainrefund: 'http://www.51bib.com/book/refund/trainrefund.ashx',
    },

    //酒店接口
    hotel: {
        //酒店
        hotel: 'http://hotel2.thgo8.com/hotelapi.ashx',
        //获取城市
        getcitylist: 'http://hotel2.thgo8.com/basedata.ashx?action=getcitylist',
        //获取城市地理位置
        getcitylankmark: this.hotel + '?action=getcitylankmark',
    },

    //充值接口
    recharge: {
        //统一充值接口
        onlineorder: RechargApi + '/onlineorder.do',
        //手机归属地查询
        mobinfo: RechargApi + '/mobinfo.do',
        //手机号码是否可以充值
        telcheck: RechargApi + '/telcheck.do',
        //根据手机号和面值查询商品信息
        telquery: RechargApi + '/telquery.do',
        //流量商品信息检查
        flowCheck: RechargApi + '/flowCheck.do',
        //流量直充接口
        flowOrder: RechargApi + '/flowOrder.do',
        //固话/宽带充值
        fixtelorder: RechargApi + '/fixtelorder.do',
        //固话/宽带查询
        fixtelquery: RechargApi + '/fixtelquery.do',
        //水电煤缴费账单查询接口
        bills: Life + '/bills',
        //水电煤缴费充值接口
        sdmRecharge: Life + '/recharge',
        //水电煤缴费充值结果查询接口
        querysingle: Life + '/querysingle',
        //加油卡充值
        jykRecharge: 'http://api.esaipai.com/OilS/recharge',
        //商品小类信息同步接口
        querylist: RechargApi + '/querylist.do',
        //游戏直充区服查询接口
        getareaserver: RechargApi + '/getareaserver.do',
        //具体商品信息同步接口
        querycardinfo: RechargApi + '/querycardinfo.do',
        //交罚违章支持城市查询接口
        queryTrafficCity: RechargApi + '/queryTrafficCity.do',
        //交罚违章查询接口
        queryTrafficFines: RechargApi + '/queryTrafficFines.do',
        //交罚违章缴费接口
        orderTrafficFines: RechargApi + '/orderTrafficFines.do'
    },

    //旅游卫士（保险）
    insurance: {
        // 'http://uat.weebao.com/Travelins.asmx',
        //获取产品信息
        products: 'http://uat.goodbao.cn/service/weishi/Products',
        //获取产品费率
        planRate: 'http://uat.goodbao.cn/service/weishi/PlanRate',
        //获取产品保障内容
        planCoverage: 'http://uat.goodbao.cn/service/weishi/PlanCoverage',
    },

    //电影接口
    movie: {
        index: 'http://v.juhe.cn/wepiao/query'
    },

    //景点接口
    scenic: {
        //批量景区基本信息接口
        scenicInfoListByPage: Scenic + '/ticketProd/scenicInfoListByPage',
        //批量产品/商品信息接口
        productInfoListByPage: Scenic + '/ticketProd/productInfoListByPage',
        //批量价格/库存信息接口
        productPriceListByPage: Scenic + '/ticketProd/productPriceListByPage',
        //按 ID 获取产品信息接口
        productInfoList: Scenic + '/ticketProd/productInfoList',
        //按 ID 获取商品信息接口
        goodInfoList: Scenic + '/ticketProd/goodInfoList',
        //按 ID 获取价格库存接口
        goodPriceList: Scenic + '/ticketProd/goodPriceList',
        //按 ID 获取景区信息接口
        scenicInfoList: Scenic + '/ticketProd/scenicInfoList',
        //订单支付接口
        orderPayment: Scenic + '/order/orderPayment',
        //创建订单
        createOrder: Scenic + '/ticket/createOrder',
        //订单校验
        validateOrder: Scenic + '/ticket/validateOrder',
        //重发凭证接口
        resendCode: Scenic + '/order/resendCode',
        //申请退款接口
        orderCancel: Scenic + '/ticket/orderCancel',
        //订单查询
        getOrderInfo: Scenic + '/order/getOrderInfo',
    },

    //用户
    user: {
        //获取授权access_token
        access_token: 'https://www.thgo8.com/?g=Thirdparty1&c=Oauth2&a=access_token',
        // access_token: 'http://test.thgo8.com/?g=Thirdparty1&c=Oauth2&a=access_token',
        // 刷新授权
        refresh_token: 'https://www.thgo8.com/?g=Thirdparty1&c=Oauth2&a=refresh_token',
        // refresh_token: 'http://test.thgo8.com/?g=Thirdparty1&c=Oauth2&a=refresh_token',
        //用户注册
        register: 'https://www.thgo8.com/?g=Thirdparty1&c=User&a=register&access_token=',
        //用户登录
        login: 'https://www.thgo8.com/?g=Thirdparty1&c=User&a=login&access_token=',
        //获取用户信息
        userInfo: 'https://www.thgo8.com/?g=Thirdparty1&c=User&a=userInfo&access_token=',
        // userInfo: 'http://test.thgo8.com/?g=Thirdparty1&c=User&a=userInfo&access_token=',
        //余额支付
        lifePay: 'https://www.thgo8.com/?g=Thirdparty1&c=User&a=lifePay&access_token=',
    }

};
module.exports = api;