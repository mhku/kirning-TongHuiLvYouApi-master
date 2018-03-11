let daoMethod = require("../../utils/daoCommon");
let sqlHelper = require("../../dao/sqlHelper");
let dao = {
        /**
         * 通过角色ID查找菜单
         * @param data
         */
        searchMenuByRoleId: (data) => {
            let sql = `select m.menu_id,m.menu_name,m.menu_icon,m.menu_path,m.menu_key,m.menu_parentid,m.menu_level,m.menu_component from power as p
                    left join menu as m on p.menu_id = m.menu_id
                    where role_id = $role_id`;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 添加角色
         * @param data
         * @returns {*}
         */
        addRole: (data) => {
            let sql = `insert into role (role_id,role_name,role_creator,role_createtime,role_isable)
                       values($role_id,$role_name,$role_creator,now(),1);`;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 修改角色
         * @param data
         * @returns {*}
         */
        updateRole: (data) => {
            let sql = `update role set role_name = $role_name where role_id = $role_id`;
            return daoMethod.oneMethod(sql, data);
        },

        /**
         * 删除角色下的所有权限
         * @param data
         * @returns {*}
         */
        delPower: (data) => {
            return new Promise((resolve, reject) => {
                let sql = [];
                let roleList = (data.role_id).split(',');
                roleList.forEach((item) => {
                    let sql1 = `delete from power where role_id = '${item}'`;
                    sql.push(sqlHelper.getNewSql(sql1))
                });
                sqlHelper.execTrans(sql).then((result) => {
                    resolve(result);
                }, (err) => {
                    reject(err);
                }).catch(console.log.bind(console))
            })
        },

        /**
         * 添加角色权限
         * @param data
         * @returns {Promise}
         */
        addPower: (data) => {
            return new Promise((resolve, reject) => {
                let sql = [];
                let menuList = (data.menu_id).split(',');
                menuList.forEach((item) => {
                    let sql1 = `insert into power(menu_id,role_id,power_creator,power_createtime,power_isable)
                                values('${item}','${data.role_id}','${data.role_creator}',now(),1)`;
                    sql.push(sqlHelper.getNewSql(sql1, item))
                });
                sqlHelper.execTrans(sql).then((result) => {
                    resolve(result);
                }, (err) => {
                    reject(err);
                }).catch(console.log.bind(console))
            })
        },

        /**
         * 删除角色
         * @param data
         */
        delRole: (data) => {
            return new Promise((resolve, reject) => {
                let sql = [];
                let roleList = (data.role_id).split(',');
                roleList.forEach((item) => {
                    let sql1 = `delete from role where role_id = '${item}'`;
                    sql.push(sqlHelper.getNewSql(sql1))
                });
                sqlHelper.execTrans(sql).then((result) => {
                    resolve(result);
                }, (err) => {
                    reject(err);
                }).catch(console.log.bind(console))
            })
        },

        /**
         * 分页查看角色列表
         * @param data
         * @returns {*}
         */
        searchRoleList: (data) => {
            let sql = `select role_id,role_name,role_isable from role  
                         order by role_createtime desc 
             limit ${data.page},${data.size}`;
            return daoMethod.oneMethod(sql, data);
        },

        /**
         * 查看角色列表总数
         * @param data
         * @returns {*}
         */
        searchRoleListCount: (data) => {
            let sql = `select role_id,role_name,role_isable from role  order by role_createtime desc `;
            return daoMethod.oneMethod(sql, data);
        },

        /**
         * 搜索查看角色列表
         * @param data
         * @returns {*}
         */
        searchRoleListSearch: (data) => {
            let sql = `select role_id,role_name,role_isable from role  
                         where role_name <> '开发者' 
                         order by role_createtime desc 
             limit ${data.page},${data.size}`;
            return daoMethod.oneMethod(sql, data);
        },

        /**
         * 搜索查看角色列表总数
         * @param data
         * @returns {*}
         */
        searchRoleListSearchCount: (data) => {
            let sql = `select role_id,role_name,role_isable from role  
                         where role_name <> '开发者' 
                         order by role_createtime desc `;
            return daoMethod.oneMethod(sql, data);
        },

        /**
         * 通过名字查找角色
         * @param data
         */
        searchRoleByName:
            (data) => {
                let sql = `select role_id from role where role_name = $role_name`;
                return daoMethod.oneMethod(sql, data);
            },
        /**
         *停用角色
         * @param data
         *@return {*}
         */
        updateRoleState: (data) => {
            let sql = `update role set role_isable =$role_isable where role_id=$role_id`;
            return daoMethod.oneMethod(sql, data);
        }
    }
;
module.exports = dao;