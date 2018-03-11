let daoMethod = require("../../utils/daoCommon");
let md5 = require('blueimp-md5');

let dao =
    {
        /**
         * 登陆管理员账号
         *@param data
         *@returns {*}
         */
        loginAdmin: (data) => {
            let sql = `  select  admin_id,admin_employeeName  from admin  where admin_state = '1' and admin_isable in (1,2) and admin_name=$admin_name and admin_password=$admin_password `;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 查询管理员账号
         *@param data
         *@returns {*}
         */
        searchAdmin: (data) => {
            let admin_name = `  `;//用户名
            let employee_name = `  `;//员工姓名
            let job_time = `  `;//入职时间
            let state = `  `;//是否在职
            let frist = ` select a.admin_id,a.admin_name,a.admin_code,a.admin_employeeName,a.admin_sex,a.admin_contact,a.admin_entryTime,a.admin_state,r.role_id,r.role_name from admin a 
            left join role r on r.role_id=a.role_id and r.role_isable=1 where admin_isable=1  `;
            let end = ` order by admin_creatime desc  limit ${data.page},${data.size} `;
            if (data.admin_name) {
                admin_name = `  and  a.admin_name like concat ('%',$admin_name,'%') `;
            }
            if (data.admin_employeeName) {
                employee_name = `  and a.admin_employeeName like concat ('%',$admin_employeeName,'%')   `;
            }
            if (data.from && data.reach) {
                job_time = ` and date_format(a.admin_entryTime,'%Y-%m-%d') between  date_format($from,'%Y-%m-%d') and date_format($reach,'%Y-%m-%d') `;
            }
            if (data.admin_state) {
                if (data.admin_state == 1) {
                    state = ` and a.admin_state =1 `;
                }
                else if (data.admin_state == 0) {
                    state = ` and a.admin_state =0 `;
                }
            }
            //统计总数
            if (data.counts) {
                let sql = frist + admin_name + job_time + employee_name + state;
                return daoMethod.oneMethod(sql, data);
            }
            let sql = frist + admin_name + job_time + employee_name + state + end;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 添加管理员账号
         *@param data
         * @return {*}
         */
        addAdmin: (data) => {
            let sql = `INSERT INTO admin(admin_id, admin_name, admin_code, admin_employeeName, admin_password,admin_sex , admin_contact, admin_entryTime, role_id, admin_creator, admin_creatime, admin_isable, admin_state) 
                       VALUES($admin_id,$admin_name, $admin_code,$admin_employeeName,$admin_password,$admin_sex,$admin_contact, now(),$role_id,'',now(),1,$admin_state) `;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 查询管理员账号是否被注册
         * @param data
         * @return {*}
         */
        searchAdmin_name: (data) => {
            let sql = ` select admin_id from admin where admin_name =$admin_name and admin_isable=1 `;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 删除管理员账号
         * @param data
         * @return {*}
         */
        deleteAdmin: (data) => {
            let sql = ` update  admin set admin_isable =0 where admin_id =$admin_id`;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 更改管理员账号
         * @param data
         * @return {*}
         */
        updateAdmin: (data) => {
            let admin_name = ` `;//用户名
            let employee_name = ` `;//员工姓名
            let contact = ` `;//联系电话
            let entry_time = ` `;//入职时间
            let sex = ` `;//性别
            let admin_code = ` `;//员工编号
            let password = ` `;//密码
            let state = ` `;//是否离职
            let first = ` update admin set admin_id=admin_id `;
            let end = ` where admin_id=$admin_id `;
            if (data.admin_name) {
                admin_name = ` ,admin_name=$admin_name `;
            }
            if (data.admin_employeeName) {
                employee_name = ` ,admin_employeeName=$admin_employeeName `;
            }
            if (data.admin_contact) {
                contact = ` ,admin_contact=$admin_contact `;
            }
            if (data.admin_entryTime) {
                entry_time = ` ,admin_entryTime=$admin_entryTime `;
            }
            if (data.admin_sex) {
                sex = ` ,admin_sex=$admin_sex  `;
            }
            if (data.admin_code) {
                admin_code = ` ,admin_code=$admin_code `;
            }
            if (data.admin_password) {
                data.admin_password = md5(data.admin_password + "linglan");
                password = `  ,admin_password=$admin_password `;
            }
            if (data.admin_state) {
                state = `, admin_state=$admin_state `;
            }
            let sql = first + admin_name + employee_name + contact + entry_time + sex + admin_code + password + state + end;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 查询管理员权限
         * @param data
         * @return {*}
         */
        searchRole: (data) => {
            let sql = `select m.* from admin a  join role r on r.role_id=a.role_id and r.role_isable=1  join power p on p.role_id=r.role_id and p.power_isable=1   join menu m on m.menu_id=p.menu_id and m.menu_isable=1
            where a.admin_isable in (1,2) and a.admin_id=$admin_id group by m.menu_id order by m.menu_key `;
            return daoMethod.oneMethod(sql, data);
        }
    };
module.exports = dao;