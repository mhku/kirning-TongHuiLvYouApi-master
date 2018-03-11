const menuDao = require('../../houtai/dao/menuDao');
const uuid = require('../../utils/uuid');
const serviceMethod = require('../../utils/serviceCommon');
const tokenService = require('../../service/tokenService');
const logger = require("../../utils/logHelper").helper;
let logDao = require('../../utils/logDao');

let service = {
    /**
     * 添加菜单
     * @param data
     * @returns {Promise}
     */
    addMenu: (data) => {
        data.menu_id = uuid.createUUID();
        return new Promise((resolve, reject) => {
            //通过名字查找是否有重复名字
            menuDao.searchMenuByName(data).then((menu) => {
                if (menu.length > 0) {
                    reject({code: 2, msg: '菜单名称重复'})
                } else {
                    //通过token查找操作者id
                    tokenService.queryUserIdByToken(data).then((uidResult) => {
                        let id = uidResult.user_id;
                        data.menu_creator = id;
                        //添加菜单
                        return serviceMethod.addMethod(menuDao, "addMenu", data).then((result) => {
                            if (data.menu_parentid) {
                                //添加菜单后修改上级菜单是否有下级为1
                                data.menu_isLeaf = '1';
                                return menuDao.updateMenuLeaf(data).then(() => {
                                    resolve({code: 1, msg: "添加成功"});
                                }, (error) => {
                                    reject(error)
                                })
                            }
                            else {
                                resolve(result);
                            }
                        }, err => {
                            reject(err);
                        })
                    }, err => {
                        reject(err);
                    })
                }
            })
        });
    },

    /**
     * 修改菜单
     * @param data
     * @returns {Promise}
     */
    updateMenu: (data) => {
        return new Promise((resolve, reject) => {
            //通过名字查找是否有重复名字
            menuDao.searchMenuByName(data).then((menu) => {
                if (menu.length > 0) {
                    reject({code: 2, msg: '菜单名称重复'})
                } else {
                    //通过token查找操作者id
                    tokenService.queryUserIdByToken(data).then((uidResult) => {
                        let id = uidResult.id;
                        data.type_creator = id;
                        //修改菜单
                        return serviceMethod.updateMethod(menuDao, "updateMenu", data).then(() => {
                            resolve({code: 1, msg: "修改成功"});
                        }, (error) => {
                            reject(error)
                        });
                    }, (error) => {
                        reject(error)
                    })
                }
            })
        });
    },

    /**
     * 删除菜单
     * @param data
     * @returns {Promise}
     */
    delMenu: (data) => {
        return new Promise((resolve, reject) => {
            menuDao.searchMenuListByParentId(data).then((menu) => {
                //验证是否有下级菜单
                if (menu.length > 0) {
                    reject({code: 2, msg: '不能删除，有下级菜单存在'})
                } else {
                    //通过token查找操作者id
                    tokenService.queryUserIdByToken(data).then((uidResult) => {
                        let id = uidResult.id;
                        data.type_creator = id;
                        //删除菜单
                        return serviceMethod.delMethod(menuDao, "delMenu", data).then((result) => {
                            if (data.menu_parentid) {
                                return menuDao.searchMenuListByParentId({menu_id: data.menu_parentid}).then((menu1) => {
                                    if (menu1.length > 0) {
                                        resolve(result)
                                    } else {
                                        data.menu_isLeaf = '0';
                                        return menuDao.updateMenuLeaf(data).then(() => {
                                            resolve(result)
                                        }, (error) => {
                                            reject(error)
                                        })
                                    }
                                }, (error) => {
                                    reject(error)
                                })
                            } else {
                                resolve(result)
                            }
                        }, (error) => {
                            reject(error)
                        });
                    }, (error) => {
                        reject(error)
                    })
                }
            });
        });
    },

    /**
     * 查看第一级菜单列表
     * @param data
     * @returns {Promise}
     */
    searchMenuList: (data) => {
        return new Promise((resolve, reject) => {
            serviceMethod.searchMethod(menuDao, "searchMenuList", data).then((typeList) => {
                //查看菜单列表
                resolve(typeList);
            }, (error) => {
                reject(error);
            }).catch((error) => {
                reject(error)
            });
        })
    },

    /**
     * 查看所有菜单
     * @param data
     * @returns {Promise}
     */
    searchMenuListAll: (data) => {
        return new Promise((resolve, reject) => {
            serviceMethod.searchMethod(menuDao, "searchMenuListAll", data).then((typeList) => {
                //查看菜单列表
                resolve(typeList);
            }, (error) => {
                reject(error);
            }).catch((error) => {
                reject(error)
            });
        })
    },

    /**
     * 通过菜单ID查看下级菜单
     * @param data
     * @returns {Promise}
     */
    searchMenuListByParentId: (data) => {
        return new Promise((resolve, reject) => {
            serviceMethod.searchMethod(menuDao, "searchMenuListByParentId", data).then((typeList) => {
                //查看菜单列表
                resolve(typeList);
            }, (error) => {
                reject(error);
            }).catch((error) => {
                reject(error)
            });
        })
    }
};

module.exports = service;