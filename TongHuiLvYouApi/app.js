const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const tokenService = require('./service/tokenService');
const fs = require('fs');

const app = express();
const city = require('./routes/city');
const user = require('./routes/user');
const flighr = require('./routes/flighr');
const train = require('./routes/train');
const tourist = require('./routes/tourist');
const recharge = require('./routes/recharge');
const aircraft = require('./routes/aircraft');
const alipay = require('./routes/pay/alipay');
const htfile = require('./houtai/routes/file');
const htadmin = require('./houtai/routes/admin');
const htuser = require('./houtai/routes/user');
const htmenu = require('./houtai/routes/menu');
const htrole = require('./houtai/routes/role');
const htorder = require('./houtai/routes/order');
const htadsense = require('./houtai/routes/adsense');
const htcoupon = require('./houtai/routes/coupon');
const htwindow = require('./houtai/routes/window');
const htreward_explain = require('./houtai/routes/reward_explain');
const htreward_user = require('./houtai/routes/reward_user');
const htreward = require('./houtai/routes/reward');
const htversion = require('./houtai/routes/version');
const htservice = require('./houtai/routes/server');
const order = require('./routes/order');
const hotel = require('./routes/hotel');
const movie = require('./routes/movie');
// const insurance = require('./routes/insurance');
const scenic = require('./routes/scenic');
const test = require('./routes/test');
const thpay = require('./routes/pay/thpay');
const exchange = require('./routes/exchange');
const service = require('./routes/server');
const collection = require('./routes/collection');
const records = require('./routes/records');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.raw({
    type: (req) => {
        if (req.headers['content-type'] && req.headers['content-type'].indexOf('GBK') > -1) {
            return true;
        }
        return false;
    }
}));

app.use(bodyParser.raw({
    type: "application/x-www-form-urlencoded;charset=GBK",
    verify: function (req, res, buf, encoding) {
        console.log(encoding);
    }
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use("/game", express.static(path.join(__dirname, '/game')));
app.use('/admin/static', express.static('views/admin/static'));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/data', express.static(path.join(__dirname, 'data')));


app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("Content-Type", "application/json;charset=gbk");
    next();
});


app.use('/admin', (req, res) => {
    reactRes(res);
});

let ex = [
    "/api/city/queryCitysByPid", "/api/city/queryCityByLevel", "/api/flighr/getDailyLowestPrice", "/api/user/userLogin", "/api/flighr/findFlighrs", "/api/train/findTraintickets",
    "/api/flighr/getModifyAndRefundStipulate", "/api/flighr/findFlighrByFlightNo", "/api/recharge/newqueryuserinfo", "/api/recharge/mobinfo", "/api/recharge/flowCheck", "/api/recharge/searchCitys",
    "/api/recharge/searchCompanyByProtype", "/api/recharge/searchCompanyById", "/api/recharge/bills", "/api/aircraft/queryAircrafts", "/api/aircraft/queryAircraftsByCity", "/api/admin/loginAdmin",
    "/api/admin/searchAdmin", "/api/admin/addAdmin", "/api/admin/deleteAdmin", "/api/admin/updateAdmin", "/api/admin/searchUser", "/api/users/searchUser", "/api/users/searchUserDetailed",
    "/api/users/updateUser", "/api/users/deleteUser", "/api/users/addUser", "/api/role/updateRoleState", "/api/adsense/addAdsense", "/api/adsense/searchAdsense", "/api/adsense/delAdsense", "/api/adsense/delAdvertisement",
    "/api/adsense/searchAdvertisement", "/api/adsense/addAdvertisement", "/api/coupon/addCoupon", "/api/coupon/upCoupon", "/api/coupon/searchCoupon", "/api/hotel/getcitylist",
    "/api/hotel/searchHotelList", "/api/hotel/queryhotelkw", "/api/hotel/getcitylankmark", "/api/hotel/getbrandcode", "/api/hotel/gethotelcomment", "/api/hotel/getmarkplace",
    "/api/hotel/gethoteldetail", "/api/recharge/queryList", "/api/recharge/telquery", "/api/recharge/telcheck", "/api/recharge/searchCompanyByProtypeAndCity", "/api/recharge/searchFlowValue",
    "/api/recharge/searchFlowInfo", "/api/insurance/searchProducts", "/api/users/searchUserDetailed", "/api/users/updateUser", "/api/users/deleteUser", "/api/users/addUser",
     "/api/role/updateRoleState", "/api/train/findTraintickets", "/api/train/trainsearchPrice", "/api/train/searchTrainCodeByInitial", "/api/order/searchLife",
    "/api/window/searchWindow", "/api/order/searchTicketReport", "/api/order/searchAllticket", "/api/order/searchCardReport","/api/file/upload", "/data",  "/api/window/searchAllWindow",
    "/api/alipay/aliPayNotify", "/api/movie/queryMovice", "/api/scenic/searchProducts", "/api/scenic/productInfoListByPage", "/api/scenic/productPriceListByPage", "/api/scenic/productInfoList",
    "/api/scenic/goodInfoList", "/api/scenic/goodPriceList", "/api/scenic/scenicInfoList", "/api/recharge/queryTrafficCity", "/api/window/searchPlace", "/api/user/getAccess_token",
    "/api/user/userRegister", "/api/scenic/searchScenicProducts", "/api/recharge/querycardinfo", "/api/scenic/pushProductChangeInfo", "/api/scenic/findGoodByProductId",
    "/api/scenic/findPriceByGoodId", "/api/scenic/pushOrder", "/api/scenic/findProductById", "/api/recharge/queryTrafficFines", "/api/flighr/getOrderDetail", "/api/file/download",
    "/api/scenic/pushOrderCancel", "/api/reward/searchReward", "/api/recharge/shyNotifyurl", "/api/recharge/retonline", "/api/train/searchTrainCodeByName", "/api/scenic/scenicInfoList",
    "/api/order/searchOrderProduct", "/api/test/a", "/api/service/queryServer", "/api/service/selectServer", "/api/version/searchVersion",
       "/api/services/queryServer","/api/reward_explain/searchReward_explain", "/api/flighr/flightTicket", "/api/flighr/refundNotifiedUrl","/api/hotel/testOrder" +
    ""
];

app.all("/*", (req, res, next) => {
    let u = req.url;
    let urls = u.split("?");
    let index = ex.indexOf(urls[0]);
    if (index == -1 && urls[0].indexOf('/data') == -1) {
        let token = req.body.token || req.query.token;
        if (token) {
            console.log(token);
            return tokenService.queryUserIdByToken({token}).then((result) => {
                req.body.user_id = result.user_id;
                next();
            }).catch(() => {
                res.send({code: -1, msg: "token没找到"});
            });
        } else {
            res.send({code: -1, msg: "token没找到"});
        }
    }else{
        next();
    }
});

function reactRes(res) {
    res.header("Content-Type", "text/html;charset=utf-8");
    const data = fs.readFileSync(path.join(__dirname, '/views/admin/index.html'), "utf-8");
    res.send(data);
}


// app.use('/', index);
app.use('/api/city', city);
app.use('/api/user', user);
app.use('/api/flighr', flighr);
app.use('/api/train', train);
app.use('/api/tourist', tourist);
app.use('/api/recharge', recharge);
app.use('/api/aircraft', aircraft);
app.use('/api/order', order);
app.use('/api/admin', htadmin);
app.use('/api/users', htuser);
app.use('/api/menu', htmenu);
app.use('/api/role', htrole);
app.use('/api/order', htorder);
app.use('/api/adsense', htadsense);
app.use('/api/coupon', htcoupon);
app.use('/api/window', htwindow);
app.use('/api/file', htfile);
app.use('/api/reward_explain', htreward_explain);
app.use('/api/reward_user', htreward_user);
app.use('/api/reward', htreward);
app.use('/api/services', htservice);
app.use('/api/hotel', hotel);
app.use('/api/alipay', alipay);
app.use('/api/movie', movie);
app.use('/api/version', htversion);
// app.use('/api/insurance', insurance);
app.use('/api/scenic', scenic);
app.use('/api/test', test);
app.use('/api/pay', thpay);
app.use('/api/service', service);
app.use('/api/collection', collection);
app.use('/api/records', records);
// 兑换奖品
app.use('/api/exchange', exchange);
// app.use('/api/file', file);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;