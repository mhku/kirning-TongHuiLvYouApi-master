/**
 * Created by Administrator on 2017/8/28.
 */
/**
 * 接口配置
 * @type {{agencyCode: string, safetyCode: string, flighService: string}}
 */
const config = {
    // url: 'http://liuxin.tunnel.qydev.com',
    url: 'https://ly.thgo8.com',

    // 航空
    filghr: {
        // 授权支付营业员的登录名
        loginName: 'rmth88',

        //航班公司代码
        agencyCode: 'RMTH88',

        //航班安全码
        safetyCode: 'NsR$EQtK',
    },

    //火车公司账号
    retailId: 'FX712130947250092CC',//'FX7021409252933EDBB',

    //欧飞充值接口用户账号
    rechargeUserId: 'A1350971',//'A08566',

    //欧飞充值接口账号密码
    rechargeUserPassword: 'H1HmsW',//'of111111',|

    //欧飞充值接口密钥
    rechargeKeyStr: 'OFCARD',

    //欧飞充值接口版本
    rechargeVersion: '6.0',

    //赛合一商家编号
    shyPartnerid: 102752,

    //赛合一商家编号
    shySignkey: '8551DCD507DEC0AC75CA5EC85BDD8058',

    //航班服务接口
    flighServer: 'http://ws.51book.com:8000/ltips/services',

    //火车服务接口
    trainServer: 'http://www.51bib.com/TrainSearchList.ashx',

    //酒店
    hotel: {
        companycode: "GX1001",//'GX1109',
        key: 'c4395a901e9b4ec888c365117b4403eb',//'8e8580d67c534d988efc9d69858aec23',
        paypwd: '888888',
    },

    //电影接口秘钥
    movieKey: 'a42c66e832e712408aaa7b4fb93b6843',

    //景点配置信息
    scenic: {
        appKey: 'SANDISHUI',
        secret: '838790750564a733ab72be9025471b4b'//'fc50ffee10a40321891a1e006e5931cb'
    },

    //旅游卫士（保险）配置
    insura: {
        username: 'rmth',
        password: 'abc123'
    },

    //用户操作配置
    user: {
        login_key: '9e4e091bea8505b77968b3002262576b',
        appid: 'th4760200d2a11c14e',
        secret: '077d8c466216afd20e35a7baea6498c0',
        payKey: 'dd6192cf527574e6682ea9cd7f1b04fd'
    }
}

module.exports = config;