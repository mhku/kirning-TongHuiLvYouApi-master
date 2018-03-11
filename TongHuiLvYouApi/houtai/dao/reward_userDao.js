let daoMethod = require("../../utils/daoCommon");

let dao =
    {
        /**
         * 中奖用户列表
         * @param data
         * @return
         */
        searchReward_user: (data) => {
            let type = `    `;//奖品类型
            let state = `   `;//状态
            let name = `   `;//中奖用户名称
            if (data.type) {
                type = `  and reward_explain  like concat ('%',$type,'%')  `;
            }
            if (data.name) {
                name = `  and reward_user_name  like concat ('%',$name,'%')  `;
            }
            if (data.state) {
                state = `  and reward_user_state =$state `;
            }
            let first = ` select * from reward_user where reward_user_isable=1  `;
            let end = `order by reward_user_state asc,reward_user_creatime desc limit ${data.page},${data.size} `;
            if (data.counts) {
                let sql = first + type + name + state;
                return daoMethod.oneMethod(sql, data);
            }
            if (data.user_id && data.search_type == 2) {
                let sql = ` select * from reward_user where user_id=$user_id and reward_type!=4 `;
                return daoMethod.oneMethod(sql, data);
            }
            let sql = first + type + name + state + end;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 添加中奖用户
         * @param data
         * @return
         */
        addReward_user: (data) => {
            let sql = ` insert into reward_user (reward_user_id,reward_user_name,reward_type,reward_explain,reward_user_phone,reward_user_state,reward_user_creatime,reward_user_isable,user_id,reward_isuse,reward_number)
             values ($reward_user_id,$reward_user_name,$reward_type,$reward_explain,$reward_user_phone,$reward_user_state,now(),1,$user_id,$reward_isuse,$reward_number) `;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 查询用户抽奖次数
         * @param data
         * @return
         */
        searchLuck_draw: (data) => {
            let sql = ` select luck_draw_count from luck_draw where luck_draw_isable =1 and user_id=$user_id `;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 减去用户抽奖次数
         * @param data
         * @return
         */
        upLuck_draw: (data) => {
            let sql = ` update luck_draw set luck_draw_count=luck_draw_count-1 where user_id=$user_id `;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 处理用户中奖记录
         * @param data
         * @return {*}
         */
        handleReward: (data) => {
            let sql = ` update reward_user set reward_user_state=1 where reward_user_id=$reward_user_id `;
            return daoMethod.oneMethod(sql, data);
        }
    };
module.exports = dao;