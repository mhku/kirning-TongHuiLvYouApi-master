/**
 * Created by gu on 2017/3/02.
 */
var fs = require('fs');
const path = require('path');
var multer = require('multer');


var uploadFolder = 'data/uploads/';


var storage = multer.diskStorage({
    //设置上传文件路径,以后可以扩展成上传至七牛,文件服务器等等
    //Note:如果你传递的是一个函数，你负责创建文件夹，如果你传递的是一个字符串，multer会自动创建
    destination: function (req, file, cb) {
        var type = file.mimetype;
        if (type == 'image/png' || type == 'image/jpeg' || type == 'image/jpg') {
            cb(null, uploadFolder + 'image/');    // 保存的路径，备注：需要自己创建
        } else {
            cb(null, uploadFolder + 'file/');
        }
    },
    //TODO:文件区分目录存放
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});

//添加配置文件到muler对象。
var upload = multer({
    storage: storage,
    //其他设置请参考multer的limits
    //limits:{}
});


//导出对象
module.exports = upload;
