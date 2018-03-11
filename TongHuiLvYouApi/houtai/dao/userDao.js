let daoMethod = require("../../utils/daoCommon");
let md5 = require('blueimp-md5');

let dao =
    {
        /**
         * 用户列表
         * @param data
         * @return {*}
         */
        searchUser: (data) => {
            let user_name = ` `;//昵称
            let user_phone = `  `;//手机号码
            if (data.user_name) {
                user_name = ` and user_name like concat ('%',$user_name,'%')  `;
            }
            if (data.user_phone) {
                user_phone = `  and user_phone like concat ('%',$user_phone,'%')  `;
            }
            let first = ` select u.user_id,u.user_name,u.user_phone,u.user_createtime from user u where 1=1  `;
            let end = ` order by user_createtime desc limit ${data.page},${data.size} `;
            //统计总数
            if (data.counts) {
                let sql = first + user_name + user_phone;
                return daoMethod.oneMethod(sql, data);
            }
            let sql = first + user_name + user_phone + end;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 添加用户
         * @param data
         * @return {*}
         */
        addUser: (data) => {
            let sql = ` insert into user (user_id,user_phone,user_password,user_nickname,user_gender,user_birthday,user_createtime,user_isable)
                       values ($user_id,$user_phone,$user_password,$user_nickname,$user_gender,$user_birthday,now(),1)`;
            return daoMethod.oneMethod(sql, data);
        },

        /**
         * 查询用户是否被注册
         * @param data
         * @return {*}
         */
        validateUser: (data) => {
            let sql = ` select user_id from user where user_phone=$user_phone`;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 删除用户
         * @param data
         * @return {*}
         */
        deleteUser: (data) => {
            let sql = ` delete from  user where user_id=$user_id`;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 更改用户
         * @param data
         * @return {*}
         */
        updateUser: (data) => {
            let user_phone = `    `;
            let user_password = `    `;
            let user_nickname = `    `;
            let user_gender = `    `;
            let user_birthday = `    `;
            if (data.user_phone) {
                user_phone = ` ,user_phone=$user_phone  `;
            }
            if (data.user_password) {
                data.user_password = md5(data.user_password + "linglan");
                user_password = ` ,user_password=$user_password  `;
            }
            if (data.user_nickname) {
                user_nickname = ` ,user_nickname=$user_nickname  `;
            }
            if (data.user_gender) {
                user_gender = ` ,user_gender=$user_gender  `;
            }
            if (data.user_birthday) {
                user_birthday = ` ,user_birthday=$user_birthday  `;
            }
            let first = ` update user set user_id=user_id   `;
            let end = ` where  user_id=$user_id `;
            let sql = first + user_phone + user_password + user_nickname + user_gender + user_birthday + end;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 根据用户ID查询用户信息
         * @param data
         *@return {*}
         */
        searchUserDetailed: (data) => {
            let sql = ` select user_name,user_phone from user where user_id=$user_id `;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 根据手机号查询用户id
         * */
        searchUseridByPhone:(data)=>{
            let sql=` select user_id from user where user_phone=$user_phone`;
            return daoMethod.oneMethod(sql,data);
        }
    };
module.exports = dao;