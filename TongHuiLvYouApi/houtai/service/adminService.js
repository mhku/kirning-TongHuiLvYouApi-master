const serviceMethod = require('../../utils/serviceCommon');
const adminDao = require('../../houtai/dao/adminDao');
const uuid = require('../../utils/uuid');
let tokenService = require('../../service/tokenService');
let md5 = require('blueimp-md5');
let tokenUtil = require('../../utils/tokenUtil');
let service =
    {
        /**
         * 查看管理员列表
         * @param data
         * @returns {*}
         */
        searchAdmin: (data) => {
            return new Promise((resolve, reject) => {
                return serviceMethod.searchMethod(adminDao, "searchAdmin", data).then((result) => {
                    data.counts = 1;
                    return serviceMethod.searchMethod(adminDao, "searchAdmin", data).then((result2) => {
                        let count = result2.data.length;//总数
                        result.count = count;
                        resolve(result);
                    }, err => {
                        reject(err);
                    })
                }, err => {
                    reject(err);
                })
            })
        },
        /**
         * 登陆管理员账号
         *@param data
         *@returns {*}
         */
        loginAdmin: (data) => {
            //  return serviceMethod.searchMethod(adminDao, "loginAdmin", data);
            return new Promise((resolve, reject) => {
                let name;//员工姓名
                let results;//数据集合
                data.token = uuid.createUUID(); //token
                let token = data.token;
                data.admin_password = data.admin_password + "linglan";
                data.admin_password = md5(data.admin_password);
                return serviceMethod.searchMethod(adminDao, "loginAdmin", data).then((result) => {
                    data.user_id = result.data[0].admin_id;
                    name = result.data[0].admin_employeeName;
                    data.admin_id = result.data[0].admin_id;//管理员ID
                    return tokenUtil.searchTokenById(data);//查询用户是否有token
                }).then((result2) => {
                    //有token修改token
                    if (result2.length > 0) {
                        return tokenService.updateToken(data);
                    }
                    //没有token添加
                    return tokenService.addToken(data);
                }).then(() => {
                    //获取用户所有权限
                    return serviceMethod.searchMethod(adminDao, "searchRole", data);
                }).then((result3) => {
                    if (result3) {
                        let state = {code: 1, msg: "登陆成功"};
                        let values = {token: token, name: name};
                        results = state;
                        results.data = values;
                        results.data.menus = result3.data;
                        resolve(results);
                    }
                }).catch((error) => {
                    reject(error)
                })
            })
        },
        /**
         * 添加管理员账号
         *@param data
         * @return {*}
         */
        addAdmin: (data) => {
            return new Promise((resolve, reject) => {
                return adminDao.searchAdmin_name(data).then((result) => {
                    if (result.length > 0) {
                        return Promise.reject({code: 2, msg: "已经注册"});
                    }
                    data.admin_id = uuid.createUUID();
                    data.admin_password = md5(data.admin_password + "linglan");
                    return resolve(serviceMethod.addMethod(adminDao, "addAdmin", data));
                }).catch((error) => {
                    reject(error);
                })
            })
        },
        /**
         * 删除管理员账号
         * @param data
         * @return {*}
         */
        deleteAdmin: (data) => {
            return serviceMethod.delMethod(adminDao, "deleteAdmin", data);
        },
        /**
         * 更改管理员账号
         * @param data
         * @return {*}
         */
        updateAdmin: (data) => {
            return serviceMethod.updateMethod(adminDao, "updateAdmin", data);
        }
    };
module.exports = service;