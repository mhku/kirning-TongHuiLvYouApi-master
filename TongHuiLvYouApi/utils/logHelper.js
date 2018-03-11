/**
 * Created by gu on 2017/7/7.
 */

let helper = {};

const log4js = require('log4js');
const fs = require("fs");
const path = require("path");

// 加载配置文件
let objConfig = JSON.parse(fs.readFileSync("bin/log4js.json", "utf8"));

// 检查配置文件所需的目录是否存在，不存在时创建
if (objConfig.appenders) {
    let baseDir = objConfig["customBaseDir"];
    let defaultAtt = objConfig["customDefaultAtt"];

    for (let i = 0, j = objConfig.appenders.length; i < j; i++) {
        let item = objConfig.appenders[i];
        if (item["type"] == "console")
            continue;

        if (defaultAtt != null) {
            for (let att in defaultAtt) {
                if (item[att] == null)
                    item[att] = defaultAtt[att];
            }
        }
        if (baseDir != null) {
            if (item["filename"] == null)
                item["filename"] = baseDir;
            else
                item["filename"] = baseDir + item["filename"];
        }
        let fileName = item["filename"];
        if (fileName == null)
            continue;
        let pattern = item["pattern"];
        try {
            fs.accessSync(fileName);
        } catch (e) {
            console.error("日志目录不存在，请检查目录配置");
            return;
        }

        if (pattern != null) {
            fileName += pattern;
        }
        let category = item["category"];

        // if (!isAbsoluteDir(fileName)) {//path.isAbsolute(fileName))
        //     throw new Error("配置节" + category + "的路径不是绝对路径:" + fileName);
        // }
        let dir = path.dirname(fileName);
        checkAndCreateDir(dir);
    }
}

// 目录创建完毕，才加载配置，不然会出异常
log4js.configure(objConfig);

const logDebug = log4js.getLogger('logDebug');
const logInfo = log4js.getLogger('logInfo');
const logWarn = log4js.getLogger('logWarn');
const logErr = log4js.getLogger('logErr');

helper.writeDebug = (msg)=>{
    if (msg == null)
        msg = "";
    logDebug.debug(msg);
};

helper.writeInfo = (msg)=>{
    if (msg == null)
        msg = "";
    logInfo.info(msg);
};

helper.writeWarn = (msg)=>{
    if (msg == null)
        msg = "";
    logWarn.warn(msg);
};

helper.writeErr = (msg, exp)=>{
    if (msg == null)
        msg = "";
    if (exp != null)
        msg += "\r\n" + exp;
    logErr.error(msg);
};

helper.startLog = ()=>{
    logInfo.info("请求开始");
};

helper.endLog = (param)=>{
    logInfo.info("结果:"+JSON.stringify(param)+",请求结束");
};

helper.endErrLog = (param)=>{
    logErr.error("错误结果:"+JSON.stringify(param)+",请求结束");
};
// 配合express用的方法
exports.use = (app)=>{
    //页面请求日志, level用auto时,默认级别是WARN
    app.use(log4js.connectLogger(logInfo, {level: 'debug', format: ':method :url'}));
}

// 判断日志目录是否存在，不存在时创建日志目录
function checkAndCreateDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

// 指定的字符串是否绝对路径
function isAbsoluteDir(path) {
    if (path == null)
        return false;
    let len = path.length;

    let isWindows = process.platform === 'win32';
    if (isWindows) {
        if (len <= 1)
            return false;
        return path[1] == ":";
    } else {
        if (len <= 0)
            return false;
        return path[0] == "/";
    }
}


exports.helper = helper;