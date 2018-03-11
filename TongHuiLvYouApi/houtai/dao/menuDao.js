let daoMethod = require("../../utils/daoCommon");


let dao =
    {
        /**
         * 添加菜单
         * @param data
         */
        addMenu: (data) => {
            let sql = `insert into menu (menu_id,menu_name,menu_icon,menu_path,menu_parentid,
                                menu_level,menu_component,menu_creator,menu_createtime,menu_isable,menu_key,menu_isLeaf)
                     values($menu_id,$menu_name,$menu_icon,$menu_path,$menu_parentid,
                                $menu_level,$menu_component,$menu_creator,now(),1,$menu_key,0)`;
            return daoMethod.oneMethod(sql, data);
        },

        /**
         * 修改菜单
         * @param data
         */
        updateMenu: (data) => {
            let sql = `update menu set menu_name = $menu_name,menu_icon = $menu_icon,menu_path = $menu_path
                    where menu_id=$menu_id`;
            return daoMethod.oneMethod(sql, data);
        },

        /**
         * 添加菜单后修改上级菜单是否有下级
         * @param data
         */
        updateMenuLeaf: (data) => {
            let sql = `update menu set menu_isLeaf = $menu_isLeaf where menu_id =$menu_parentid`;
            return daoMethod.oneMethod(sql, data);
        },

        /**
         * 删除菜单
         * @param data
         */
        delMenu: (data) => {
            let sql = `delete from menu where menu_id = $menu_id`;
            return daoMethod.oneMethod(sql, data);
        },

        /**
         * 查看第一级菜单列表
         * @param data
         */
        searchMenuList: (data) => {
            let sql = `select menu_id,menu_name,menu_icon,menu_path,menu_parentid,menu_level,menu_creator,menu_key,menu_isLeaf,menu_component from menu
                        where menu_level = 1  ORDER BY menu_key`;
            return daoMethod.oneMethod(sql, data);
        },

        /**
         * 查看菜单列表
         * @param data
         */
        searchMenuListAll: (data) => {
            let sql = `select menu_id,menu_name,menu_icon,menu_path,menu_parentid,menu_level,menu_creator,menu_key,menu_isLeaf,menu_component from menu 
                        ORDER BY menu_level,menu_key`;
            return daoMethod.oneMethod(sql, data);
        },

        /**
         * 通过菜单ID查看他的下级菜单
         * @param data
         */
        searchMenuListByParentId: (data) => {
            let sql = `select menu_id,menu_name,menu_icon,menu_path,menu_parentid,menu_level,menu_creator,menu_key,menu_isLeaf,menu_component from menu
                        where menu_parentid = $menu_id order by menu_key asc`;
            return daoMethod.oneMethod(sql, data);
        },

        /**
         * 通过菜单ID查看菜单内容
         * @param data
         */
        searchMenuById: (data) => {
            let sql = `select menu_id,menu_parentid,menu_level from menu where menu_id = $menu_id`;
            return daoMethod.oneMethod(sql, data);
        },

        /**
         * 通过菜单名查看菜单内容
         * @param data
         */
        searchMenuByName: (data) => {
            let sql = `select menu_id from menu where menu_name = $menu_name  and menu_id not in ($menu_id)`;
            return daoMethod.oneMethod(sql, data);
        }
    };
module.exports = dao;