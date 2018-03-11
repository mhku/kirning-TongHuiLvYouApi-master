/**
 * Created by Administrator on 2018/1/12.
 */
const daoMethod = require('../utils/daoCommon');
const sqlstring = require('sqlstring');
const sqlHelper = require('./sqlHelper');
const dao = {
    /**
     * 查询浏览记录
     * @param data
     * @returns {*}
     */
    queryRecords: (data) => {
        let sql = `select records_id,records_text,create_date,id from records where user_id=$user_id order by create_date desc limit ${data.start},${data.size}`;
        return daoMethod.oneMethod(sql, data);
    },
    /**
     * 添加浏览记录
     * @param data
     * @returns {*}
     */
    insertRecords: (data) => {
        let sql = 'insert into records (user_id,records_id,records_text,id,create_date) values ($user_id,$records_id,$records_text,$id,now())';
        return daoMethod.oneMethod(sql, data);
    },
    /**
     * 删除浏览记录
     * @param data
     * @returns {*}
     */
    deleteRecords: (data) => {
        let sql = '';
        if (data.user_id) {
            sql = 'delete from records  where records_id = (select * from (select r.records_id from records as r where  r.user_id = $user_id order by r.create_date asc limit 1) as a)';
            return daoMethod.oneMethod(sql, data);
        }
        else {
            sql = 'delete from records  where records_id =$records_id';
            return daoMethod.oneMethod(sql, data);
        }
    },
    /**
     * 总浏览记录
     * @returns {*}
     */
    countRecords: (data) => {
        let sql = 'select count(*) as count from records where user_id = $user_id';
        return daoMethod.oneMethod(sql, data);
    }, /**
     * 修改浏览记录
     * @param data
     * @returns {*}
     */
    updateRecords: (data) => {
        let sql = 'update records set create_date=now() where id=$id';
        return daoMethod.oneMethod(sql, data);
    },
    /**
     * 查询单条记录
     * **/
    selRecords: (data) => {
        let sql = 'select * from records where id=$id and user_id=$user_id';
        return daoMethod.oneMethod(sql, data);
    }
}
module.exports = dao;