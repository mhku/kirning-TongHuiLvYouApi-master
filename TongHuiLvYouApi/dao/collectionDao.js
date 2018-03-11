/**
 * Created by Administrator on 2018/1/12.
 */
const daoMethod=require('../utils/daoCommon');
const sqlstring = require('sqlstring');
const sqlHelper = require('./sqlHelper');
const dao={
    /**
     * 查询个人收藏
     * @param data
     * @returns {*}
     */
    queryCollection:(data)=>{
        let sql="";
        if(!data.collection_classification){
            sql=`select collection_id,collection_classification,collection_title,id from collection where user_id=$user_id order by create_date desc limit ${data.start},${data.size}`;
        }
        else {
            sql=`select collection_id,collection_classification,collection_title,id from collection where user_id=$user_id and collection_classification=$collection_classification order by create_date desc limit ${data.start},${data.size}`;
        }
        return daoMethod.oneMethod(sql, data);
    },
    /**
     * 删除个人收藏
     * @param data
     * @returns {*}
     */
    deleteCollection:(data)=>{
        let sql='delete from collection where collection_id=$collection_id';
        return daoMethod.oneMethod(sql,data);
    },
    /**
     * 添加个人收藏
     * @param data
     * @returns {*}
     */
    insertCollection:(data)=>{
        let sql='insert into collection (collection_id,collection_classification,collection_title,user_id,id,create_date) value ($collection_id,$collection_classification,$collection_title,$user_id,$id,now())';
        return daoMethod.oneMethod(sql,data);
    },

    /**
     * 查找收藏
     * @param data
     */
    findCollection: (data) => {
        let sql = `select collection_id from collection where user_id=$user_id and id = $id and collection_classification = $collection_classification`;
        return daoMethod.oneMethod(sql,data);
    }
}
module.exports=dao;