/**
 * Created by Administrator on 2017/8/25.
 */
const daoMethod = require('../utils/daoCommon');
const sqlHelper = require('./sqlHelper');

const dao = {
    /**
     * 添加用户
     * @param data
     * @returns {*}
     */
    addUser: (data) => {
        let sql = `insert into \`user\`(user_id, th_token, user_name, user_phone) value($user_id, $th_token, $user_name, $user_phone)`;
        return daoMethod.oneMethod(sql, data);
    },
    /**
     * 删除用户
     * @param data
     * @returns {*}
     */
    delUser: (data) => {
        let sql = `update user set user_isable = '0' where user_id = $user_id`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 修改用户
     * @param data
     * @returns {*}
     */
    updateUser: (data) => {
        let sql = `update user set user_name = $user_name, user_password = $user_password, user_nickname = $user_password, user_phone = $user_phone, user_gender = $user_gender, 
                   user_birthday = $user_birthday, user_head = $user_head where user_id = $user_id`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查询用户
     * @param data
     * @returns {*}
     */
    findUser: (data) => {
        let sql = `select * from user where user_id = $user_id`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 根据通惠后台token查询用户
     * @param data
     * @returns {*}
     */
    findUserByThToken: (data) => {
        let sql = `select * from user where th_token = $th_token`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 通过登录名查询用户
     * @param data
     * @returns {*}
     */
    findUserByName: (data) => {
        let sql = `select * from user where user_name = $user_name`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 用户登录
     * @param data
     * @returns {*}
     */
    userLogin: (data) => {
        let sql = `select a.admin_id, u.user_name, u.user_id from admin as a inner join \`user\` as u on u.admin_id = a.admin_id
                   where a.admin_name = $admin_name and a.admin_password = $admin_password`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 用户注册
     * @param data
     * @returns {*}
     */
    userRegister: (data) => {
        let sqls = [];
        let sql1 = `insert into admin(admin_id, admin_name, admin_password, admin_contact) value($admin_id, $user_name, $admin_password, $admin_contact)`;
        sqls.push(sqlHelper.getNewSql(sql1, data));
        let sql2 = `insert into \`user\`(user_id, user_name, admin_id) value($user_id, $user_name, $admin_id)`;
        sqls.push(sqlHelper.getNewSql(sql2, data));
        return sqlHelper.execTrans(sqls);
    },

    /**
     * 获取Access_token
     * @returns {*}
     */
    getAccess_token: () => {
        let sql = `select * from access_token`;
        return daoMethod.oneMethod(sql, {});
    },

    /**
     * 刷新Access_token
     * @returns {*}
     */
    updateAccess_token: (data) => {
        let sql = `update access_token as a set a.access_token = $access_token, a.expires_in = ${data.expires_in}, 
                   a.refresh_token = $refresh_token, a.createTime = $createTime, a.updateTime = $updateTime`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 添加Access_token
     * @param data
     * @returns {*}
     */
    insertAccess_token: (data) => {
        let sql = `insert into access_token(\`access_token\`, expires_in, refresh_token, createTime, updateTime) 
                   value($access_token, ${data.expires_in}, $refresh_token, $createTime, $updateTime);`;
        return daoMethod.oneMethod(sql, data);
    },
    /**
     * 查询用户抽奖阶段，消费金额
     * */
    seachUserAmountStage:(data)=>{
        let sql=`select user_amount,user_stage from user where user_id=$user_id`;
        return daoMethod.oneMethod(sql,data);
    },
    /**
     * 修改用户抽奖阶段,消费金额
     * */
    updateUserAmountStage:(data)=>{
        let sql=`update user set user_amount=$user_amount,user_stage=$user_stage where user_id=$user_id`;
        return daoMethod.oneMethod(sql,data);
    }
};
module.exports = dao;