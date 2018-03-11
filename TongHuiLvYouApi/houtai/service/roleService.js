var roleDao = require('../../houtai/dao/roleDao');
var uuid = require('../../utils/uuid');
var serviceMethod = require('../../utils/serviceCommon');
var tokenService = require('../../service/tokenService');
const logger = require("../../utils/logHelper").helper;
let logDao = require('../../utils/logDao');

let service = {

    /**
     * 添加角色
     * @param data
     * @returns {Promise}
     */
    addRole: (data) => {
        data.role_id = uuid.createUUID();
        return new Promise((resolve, reject) => {
            //通过名字查找是否有重复名字
            roleDao.searchRoleByName(data).then((type) => {
                if (type.length > 0) {
                    reject({code: 2, msg: '角色名称重复'})
                } else {
                    //通过token查找操作者id
                    tokenService.queryUserIdByToken(data).then((uidResult) => {
                        let id = uidResult.user_id;
                        data.role_creator = id;
                        //添加角色
                        return serviceMethod.addMethod(roleDao, "addRole", data).then(() => {
                            //添加权限
                            return roleDao.addPower(data).then(() => {
                                resolve({code: 1, msg: "添加成功"});
                            });
                        }, err => {
                            reject(err);
                        });
                    }, err => {
                        reject(err);
                    })
                }
            }).catch((error) => {
                reject(error)
            });
        });
    },

    /**
     * 修改角色
     * @param data
     * @returns {Promise}
     */
    updateRole: (data) => {
        return new Promise((resolve, reject) => {
            //通过token查找操作者id
            tokenService.queryUserIdByToken(data).then((uidResult) => {
                let id = uidResult.id;
                data.role_creator = id;
                //删除角色原本的权限
                return roleDao.delPower(data).then(() => {
                    //修改角色
                    return serviceMethod.updateMethod(roleDao, "updateRole", data).then(() => {
                        //添加权限
                        return roleDao.addPower(data).then(() => {
                            resolve({code: 1, msg: "修改成功"});
                        });
                    })
                });
            }).catch((error) => {
                reject(error);
            });
        })
    },

    /**
     * 删除角色
     * @param data
     * @returns {Promise}
     */
    delRole: (data) => {
        return new Promise((resolve, reject) => {
            //通过token查找操作者id
            tokenService.queryUserIdByToken(data).then((uidResult) => {
                let id = uidResult.id;
                data.type_creator = id;
                //删除角色
                return serviceMethod.delMethod(roleDao, "delRole", data).then(() => {
                    //删除权限
                    return roleDao.delPower(data).then(() => {
                        resolve({code: 1, msg: "删除成功"});
                    });
                });
            }).catch((error) => {
                reject(error)
            });
        });
    },

    /**
     * 查看角色列表
     * @param data
     * @returns {Promise}
     */
    searchRoleList: (data) => {
        return new Promise((resolve, reject) => {
            serviceMethod.searchMethod(roleDao, "searchRoleList", data).then((roleList) => {
                //查看账号列表
                return roleDao.searchRoleListCount(data).then((roleCount) => {
                    roleList.count = roleCount.length;
                    resolve(roleList);
                }, (error) => {
                    reject(error);
                })
            }, (error) => {
                reject(error);
            }).catch((error) => {
                reject(error)
            });
        })
    },

    /**
     * 查看角色列表
     * @param data
     * @returns {Promise}
     */
    searchRoleListSearch: (data) => {
        return new Promise((resolve, reject) => {
            serviceMethod.searchMethod(roleDao, "searchRoleListSearch", data).then((roleList) => {
                //查看账号列表
                return roleDao.searchRoleListSearchCount(data).then((roleCount) => {
                    roleList.count = roleCount.length;
                    resolve(roleList);
                }, (error) => {
                    reject(error);
                })
            }, (error) => {
                reject(error);
            }).catch((error) => {
                reject(error)
            });
        })
    },

    /**
     * 通过角色ID查找菜单
     * @param data
     * @returns {*|Promise}
     */
    searchMenuByRoleId: (data) => {
        return serviceMethod.searchMethod(roleDao, "searchMenuByRoleId", data);
    },

    /**
     *停用角色
     * @param data
     *@return {*}
     */
    updateRoleState: (data) => {
        return serviceMethod.updateMethod(roleDao, "updateRoleState", data);
    }
};

module.exports = service;