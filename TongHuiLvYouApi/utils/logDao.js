var daoMethod = require("../utils/daoCommon");

let dao = {

    /**
     * 添加操作日志
     * @param data
     */
    addLog: (data) => {
        let sql = `insert into log(log_id,log_text,log_type,log_shop,log_creator,log_createtime)
                    values($log_id,$log_text,$log_type,$log_shop,$log_creator,now())`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 分页查找操作日志总数,商家则按照id 查询
     */
    searchLogList: (data) => {
        let shop = ``;
        let nameSearch = ``;
        let timeSearch = ``;
        let limitSearch = ``;
        if (data.page != '-1') {
            limitSearch = ` limit ${data.page},${data.size}`
        }
        if (data.startTime) {
            timeSearch = ` and date_format(l.log_createtime,'%Y-%m-%d') >= $startTime 
                           and date_format(l.log_createtime,'%Y-%m-%d') <= $endTime `
        }
        if (data.nameSearch) {
            nameSearch = ` and l.log_creator like concat('%',$nameSearch,'%')`
        }
        if (data.shop_id) {
            shop = ` and log_shop = $shop_id`
        } else {
            shop = ` and log_shop = ''`
        }
        let sql = `select l.log_text,l.log_createtime,l.log_creator from log as l 
                     where l.log_type = $log_type ` + shop + timeSearch + nameSearch + `
                     order by log_createtime desc` + limitSearch;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 操作日志的总数量
     * @param data
     */
    searchLogListCount: (data) => {
        let shop = ``;
        let nameSearch = ``;
        let timeSearch = ``;
        if (data.startTime) {
            timeSearch = ` and date_format(l.log_createtime,'%Y-%m-%d') >= $startTime 
                           and date_format(l.log_createtime,'%Y-%m-%d') <= $endTime `
        }
        if (data.nameSearch) {
            nameSearch = ` and l.log_creator like concat('%',$nameSearch,'%')`
        }
        if (data.shop_id) {
            shop = ` and log_shop = $shop_id`
        } else {
            shop = ` and log_shop = ''`
        }
        let sql = `select count(*) as count from log as l 
                    where l.log_type = $log_type` + shop + timeSearch + nameSearch;
        return daoMethod.oneMethod(sql, data);
    }
};

module.exports = dao;