const serviceMethod = require('../../utils/serviceCommon');
const userDao = require('../../houtai/dao/userDao');
const uuid = require('../../utils/uuid');
let tokenService = require('../../service/tokenService');
let md5 = require('blueimp-md5');
let tokenUtil = require('../../utils/tokenUtil');

let service =
    {
        /**
         * 用户列表
         *@param data
         * @return {*}
         */
        searchUser: (data) => {
            return new Promise((resolve, reject) => {
                return serviceMethod.searchMethod(userDao, "searchUser", data).then((result) => {
                    data.counts = 1;
                    return serviceMethod.searchMethod(userDao, "searchUser", data).then((result2) => {
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
         * 添加用户
         * @param data
         * @return {*}
         */
        addUser: (data) => {
            return new Promise((resolve, reject) => {
                return userDao.validateUser(data).then((result) => {
                    if (result.length > 0) {
                        return Promise.reject({code: 2, msg: "已经注册"});
                    }
                    data.user_id = uuid.createUUID();
                    data.user_password = md5(data.user_password + "linglan");
                    return resolve(serviceMethod.addMethod(userDao, "addUser", data));
                }).catch((error) => {
                    reject(error);
                })
            })
        },
        /**
         * 删除用户
         * @param data
         * @return {*}
         */
        deleteUser: (data) => {
            return serviceMethod.delMethod(userDao, "deleteUser", data);
        },
        /**
         * 更改用户
         * @param data
         * @return {*}
         */
        updateUser: (data) => {
            return serviceMethod.updateMethod(userDao, "updateUser", data);
        },
        /**
         * 根据用户ID查询用户信息
         * @param data
         *@return {*}
         */
        searchUserDetailed: (data) => {
            return serviceMethod.searchMethod(userDao, "searchUserDetailed", data);
        },
        /**
         * 根据手机号查询userid
         * */
        searchUseridByPhone:(data)=>{
            return new Promise((resolve, reject) => {
                return serviceMethod.searchMethod(userDao,'searchUseridByPhone',data).then((result)=>{
                    resolve(result)
                },err =>{
                    reject(err);
                })
            })
        }
    };

module.exports = service;