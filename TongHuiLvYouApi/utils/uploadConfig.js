/**
 * Created by Administrator on 2017/6/24.
 */
const fs = require('fs');
const multer = require('multer');
const path = require('path');

let createFolder = (folder)=>{
    try {
        fs.accessSync(folder);
    } catch(e) {
        fs.mkdirSync(folder);
    }
};
let uploadFolder = path.join('uploads/');
createFolder(uploadFolder);
let storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    //TODO:文件区目录存放
    filename: (req, file, cb)=>{
        var fileFormat =(file.originalname).split(".");
        cb(null, file.fieldname+'-'+Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});

//添加配置文件到multer
let upload = multer({
    storage:storage,
});
module.exports = upload;