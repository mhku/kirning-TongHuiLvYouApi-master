const daoMethod = require('../utils/daoCommon');

const dao = {

    /**
     * 添加抽奖记录
     * @param data
     * @returns {*}
     */
    addLuckDraw: (data) => {
        let sql = `insert into luck_draw(luck_draw_id, user_id)
                   values($luck_draw_id, $user_id)`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查找用户抽奖记录
     * @param data
     * @returns {*}
     */
    findUserLuckDraw: (data) => {
        let sql = `select l.luck_draw_count, l.luck_draw_get_count from luck_draw as l where l.user_id = $user_id`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 添加所有抽奖记录数量
     * @param data
     * @returns {*}
     */
    addAllLuckDrawCount: () => {
        let sql = `update luck_draw as l set l.luck_draw_count = (l.luck_draw_count + if(l.luck_draw_new = '0', 1, 2)), l.luck_draw_get_count = (l.luck_draw_get_count + if(l.luck_draw_new = '0', 1, 2))`;
        return daoMethod.oneMethod(sql, null);
    },

    /**
     * 清除所有抽奖记录数量
     * */
    deleteAllLuckDrawCount:()=>{
        let sql=`update luck_draw set luck_draw_count=0, luck_draw_get_count=0`;
        return daoMethod.oneMethod(sql,null)
    },

    /**
     * 清除所有用户抽奖金额阶段
     * */
    deleteAllUserStage:()=>{
        let sql=`update user set user_stage=0, user_amount=0`;
        return daoMethod.oneMethod(sql,null)
    },


    /**
     * 按下单价格判断添加抽奖记录数量
     * @param data
     * @returns {*}
     */
    addLuckDrawCount: (data) => {
        let sql;
        if(data.getCount != null){
            sql = `update luck_draw as l set l.luck_draw_count = $count, l.luck_draw_get_count = $getCount, l.luck_draw_date = now()
                   where l.user_id = $user_id`;
        } else {
            sql = `update luck_draw as l set l.luck_draw_count = $count, l.luck_draw_date = now()
                   where l.user_id = $user_id`;
        }
        return daoMethod.oneMethod(sql, data);
    },
};
module.exports = dao;