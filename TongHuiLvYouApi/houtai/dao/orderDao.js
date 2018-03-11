let daoMethod = require("../../utils/daoCommon");


let dao =
    {
        /**
         * 查询各种车票订单列表
         * @param data
         * @return {*}
         */
        searchOrder: (data) => {
            let order_type = `    `;//订单类型(1,火车票2,飞机票3,汽车票4，船票)
            let order_state = ` `;//订单状态（1待支付，2待使用，3待评价，4退款/售后，5已完成， 6已取消）
            let order_no = `  `;//订单号
            let order_phone = `   `;//用户手机号
            let order_time = ` `;//下单时间
            let first = ` select o.* ,u.user_phone from \`order\` o 
             left join user u on u.user_id=o.user_id and u.user_isable=1
             where o.order_isable=1 `;
            let end = ` order by order_createtime desc limit ${data.page}, ${data.size} `;
            if (data.order_type == 1) {
                order_type = ` and o.product_id = 1 `;
            }
            if (data.order_type == 2) {
                order_type = ` and o.product_id = 2 `;
            }
            if (data.order_type == 3) {
                order_type = ` and o.product_id = 3 `;
            }
            if (data.order_type == 4) {
                order_type = ` and o.product_id = 4 `;
            }
            if(data.order_type==5){
                order_type = ` and o.product_id = 25 `;
            }
            if (data.order_state) {
                order_state = ` and o.order_state=$order_state  `;
            }
            if (data.order_no) {
                order_no = ` and  o.order_no like concat ('%',$order_no,'%')   `;
            }
            if (data.order_phone) {
                order_phone = ` and  u.user_phone like concat ('%',$order_phone,'%')   `;
            }
            if (data.ago && data.end) {
                order_time = ` and  date_format(o.order_createtime,'%Y-%m-%d') between  date_format($ago,'%Y-%m-%d') AND date_format($end,'%Y-%m-%d') `;
            }
            if (data.counts) {
                let sql = first + order_type + order_state + order_no + order_phone + order_time;
                return daoMethod.oneMethod(sql, data);
            }
            let sql = first + order_type + order_state + order_no + order_phone + order_time + end;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 订单详细/根据order_id查询用户信息
         * @param data
         * @returns {*}
         */
        selectUser: (data) => {
            let sql = `select o.order_no,o.order_createtime,o.order_payTime,o.order_state,o.order_pay,u.user_name as user_nickname,u.user_phone  from \`order\` o
            left join user u on u.user_id=o.user_id where o.order_id=$order_id`;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 订单详细/根据order_id查询游客信息
         * @param data
         * @returns {*}
         */
        selectOrder: (data) => {
            let sql = `select o.* ,ott.tourist_price ,tt.tourist_name,tt.tourist_gender,tt.tourist_identityType,tt.tourist_identityNo,tt.tourist_crowd_type from \`order\` o 
            left join order_tourist ott on o.order_id =ott.order_id  left join tourist tt on tt.tourist_id=ott.tourist_id 
            where  o.order_id=$order_id`;
            return daoMethod.oneMethod(sql, data);
        },
        updateOrderstate:(data)=>{
            let sql=`update \`order\` set order_state=$order_state where order_id=$order_id`;
            return daoMethod.oneMethod(sql,data);
        },
        /**
         * 充值中心列表
         *@param data
         *@return {*}
         */
        searchCharge: (data) => {
            let order_no = `  `;//订单号
            let order_phone = `  `;//用户手机号码
            let time = `  `;//下单时间
            let order_telephone = `  `;//充值号码
            let type = `  `;//1:话费，2：流量 3：Q币 4：游戏充值
            let order_state = `   `;//1：充值成功 2：取消充值
            let first = ` select o.*,u.user_name as user_nickname,u.user_phone from \`order\` o
            left join user u on u.user_id=o.user_id where 1=1 and o.order_isable=1 `;
            let end = ` order by order_createtime desc limit ${data.page},${data.size} `;
            if (data.order_no) {
                order_no = ` and  o.order_no like concat ('%',$order_no,'%')   `;
            }
            if (data.order_phone) {
                order_phone = ` and  u.user_phone like concat ('%',$order_phone,'%')   `;
            }
            if (data.ago && data.end) {
                time = ` and date_format(o.order_createtime,'%Y-%m-%d') between  date_format($ago,'%Y-%m-%d') AND date_format($end,'%Y-%m-%d') `;
            }
            if (data.number) {
                order_telephone = ` and o.order_telephone  like concat ('%',$number,'%') `;
            }
            if (data.type == 1) {
                type = ` and o.product_id =5 `;
            }
            if (data.type == 2) {
                type = ` and o.product_id =6 `;
            }
            if (data.type == 3) {
                type = ` and o.product_id =7 `;
            }
            if (data.type == 4) {
                type = ` and o.product_id =22 `;
            }
            if (data.order_state) {
                order_state = ` and o.order_state =$order_state `;
            }
            if (data.counts) {
                let sql = first + order_no + order_phone + time + order_telephone + type + order_state;
                return daoMethod.oneMethod(sql, data);
            }
            let sql = first + order_no + order_phone + time + order_telephone + type + order_state + end;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 加油卡充值列表
         * @param data
         * @returns {*}
         */
        searchCard: (data) => {
            let order_no = `  `;//订单号
            let order_phone = `  `;//用户手机号码
            let order_telephone = ` `;//加油卡号码
            let user_name = `  `;//持卡人姓名
            let time = `  `;//缴费时间
            let order_state = ` `;//订单状态1:成功 2 : 失败
            let order_type = ``; //1:中国石油 2：中石化油卡充值
            if (data.order_type == 1) {
                order_type = ` and o.product_id =8 `;
            }
            if (data.order_type == 2) {
                order_type = ` and o.product_id =9 `;
            }
            if (data.order_state) {
                order_state = ` and o.order_state= $order_state `;
            }
            if (data.order_no) {
                order_no = ` and  o.order_no like concat ('%',$order_no,'%')   `;
            }
            if (data.order_phone) {
                order_phone = ` and  u.user_phone like concat ('%',$order_phone,'%')   `;
            }
            if (data.order_telephone) {
                order_telephone = ` and  o.order_telephone like concat ('%',$order_telephone,'%')   `;
            }
            if (data.user_name) {
                user_name = ` and  u.user_name like concat ('%',$user_name,'%')   `;
            }
            if (data.ago && data.end) {
                time = ` and date_format(o.order_createtime,'%Y-%m-%d') between date_format($ago,'%Y-%m-%d') AND date_format($end,'%Y-%m-%d') `;
            }
            let first = ` select o.order_no,u.user_phone,u.user_name as user_nickname,o.order_telephone,o.order_original_price,o.order_discount ,o.order_amount ,o.order_state,o.order_payTime,o.order_createtime 
            from \`order\` o left join user u on u.user_id = o.user_id where 1 =1  `;
            let end = ` order by order_createtime desc limit ${data.page},${data.size} `;
            if (data.counts) {
                let sql = first + order_state + time + user_name + order_no + order_telephone + order_phone + order_type;
                return daoMethod.oneMethod(sql, data);
            }
            let sql = first + order_state + time + user_name + order_no + order_telephone + order_phone + order_type + end;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 生活费用列表
         * @param data
         * @returns {*}
         */
        searchLife: (data) => {
            let order_state = ` `;
            let order_no = `  `;//订单号
            let order_phone = `  `;//用户手机号码
            //   let city = `    `;//城市
            //    let company = ` `;//收费单位
            let order_telephone = ` `;//操作账号
            let payin_gunit = ` `;//缴费单位
            //  let home_number = ` `;//房号
            let time = `  `;//缴费时间
            let order_type = `  `;//1:水费 2:电费 3:燃气费 4：有线电视-暂无  5：固话 6：宽带 7：物业费-暂无
            if (data.order_state) {
                order_state = ` and o.order_state= $order_state `;
            }
            if (data.order_no) {
                order_no = ` and  o.order_no like concat ('%',$order_no,'%')   `;
            }
            if (data.order_phone) {
                order_phone = ` and  u.user_phone like concat ('%',$order_phone,'%')   `;
            }
            if (data.order_telephone) {
                order_telephone = ` and o.order_telephone like concat ('%',$order_telephone,'%') `;
            }
            if (data.payin_gunit) {
                payin_gunit = ` and o.order_company_name like concat ('%',$payin_gunit,'%')  `;
            }
            if (data.ago && data.end) {
                time = ` and date_format(o.order_createtime,'%Y-%m-%d') between  date_format($ago,'%Y-%m-%d') AND date_format($end,'%Y-%m-%d') `;
            }
            if (data.order_type == 1) {
                order_type = ` and o.product_id = 10 `;
            }
            if (data.order_type == 2) {
                order_type = ` and o.product_id = 11 `;
            }
            if (data.order_type == 3) {
                order_type = ` and o.product_id = 12 `;
            }
            if (data.order_type == 4) {
                order_type = ` and o.product_id = 13 `;
            }
            if (data.order_type == 5) {
                order_type = ` and o.product_id = 14 `;
            }
            if (data.order_type == 6) {
                order_type = ` and o.product_id = 15 `;
            }
            if (data.order_type == 7) {
                order_type = ` and o.product_id = 16 `;
            }
            let first = ` select o.*,u.user_phone  from \`order\` o left join user u on u.user_id=o.user_id where  o.order_isable=1 `;
            let end = ` order by order_createtime desc limit ${data.page},${data.size} `;
            if (data.counts) {
                let sql = first + order_type + time + payin_gunit + order_telephone + order_phone + order_no + order_state;
                return daoMethod.oneMethod(sql, data);
            }
            let sql = first + order_type + time + payin_gunit + order_telephone + order_phone + order_no + order_state + end;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 酒店列表
         * @param data
         * @return {*}
         */
        searchHotel: (data) => {
            let order_no = `  `;//订单号
            let order_phone = `  `;//用户手机号码
            let time = `  `;//下单时间
            let city = `  `;//城市
            let company = ` `;//企业名称
            let type = `    `;//类型1：国内，2：国际 3：钟点
            let order_state = ``;
            if (data.order_no) {
                order_no = ` and  o.order_no like concat ('%',$order_no,'%')   `;
            }
            if (data.order_phone) {
                order_phone = ` and  u.user_phone like concat ('%',$order_phone,'%')   `;
            }
            if (data.ago && data.end) {
                time = ` and date_format(o.order_createtime,'%Y-%m-%d') between  date_format($ago,'%Y-%m-%d') AND date_format($end,'%Y-%m-%d') `;
            }
            if (data.city) {
                city = `  and o.order_destination =$city   `;
            }
            if (data.company) {
                company = ` and o.order_company_name =$company `;
            }
            if(data.order_state){
                order_state = ` and o.order_state = $order_state`;
            }
            if (data.type == 1) {
                type = ` and o.product_id = 17    `;
            }
            if (data.type == 2) {
                type = ` and o.product_id = 18    `;
            }
            if (data.type == 3) {
                type = ` and o.product_id = 19    `;
            }
            let first = ` select o.*,u.user_phone from \`order\` o left join user u on u.user_id=o.user_id where 1=1  `;
            let end = ` order by order_createtime desc limit ${data.page},${data.size} `;
            if (data.counts) {
                let sql = first + city + type + order_no + order_phone + order_state + time + company;
                return daoMethod.oneMethod(sql, data);
            }
            let sql = first + city + type + order_no + order_phone + order_state + time + company + end;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 查询酒店详细
         * @param data
         * @return {*}
         */
        searchHotelDetailed: (data) => {
            let sql = ` select  o.order_destination,o.order_company_name,o.order_tickettype,o.order_count,o.order_telephone,o.order_departure_datetime,o.order_end_time,
            o.order_price,o.order_amount,o.order_discount,o.order_mailbox,o.order_remark,o.order_service_price,o.order_user from \`order\` o  where o.order_isable=1 and o.order_id=$order_id `;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 根据订单查询入住人
         * @param data
         * @return {*}
         */
        searchOrderTourist: (data) => {
            let sql = `  select tt.tourist_name from  order_tourist ott left join tourist tt on tt.tourist_id=ott.tourist_id where ott.order_id=$order_id `;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 查询景点列表
         * @param data
         * @return {*}
         */
        searchSpot: (data) => {
            let order_no = `  `;//订单号
            let order_phone = `  `;//用户手机号码
            let city = `    `;//目的地
            let spot = `    `;//景点名称
            let time = `    `;//下单时间
            let type = `    `;//1:境内景区 2：境外景区
            let order_state = ``;
            if (data.order_no) {
                order_no = ` and  o.order_no like concat ('%',$order_no,'%')   `;
            }
            if (data.order_phone) {
                order_phone = ` and  u.user_phone like concat ('%',$order_phone,'%')   `;
            }
            if (data.ago && data.end) {
                time = ` and date_format(o.order_createtime,'%Y-%m-%d') between  date_format($ago,'%Y-%m-%d') AND date_format($end,'%Y-%m-%d') `;
            }
            if (data.city) {
                city = `  and o.order_destination=$city `;
            }
            if (data.spot) {
                spot = `  and o.order_company_name=$spot `;
            }
            if(data.order_state){
                order_state = ` and o.order_state = $order_state`;
            }
            if (data.type == 1) {
                type = `   and o.product_id = 20 `;
            }
            if (data.type == 2) {
                type = `   and o.product_id =  21  `;
            }
            let first = ` select o.*,u.user_phone,tt.tourist_name from \`order\` o left join user u on u.user_id=o.user_id left join order_tourist ott on ott.order_id =o.order_id 
             left join  tourist tt on tt.tourist_id=ott.tourist_id  where 1=1  `;
            let end = ` order by order_createtime desc limit ${data.page},${data.size} `;
            if (data.counts) {
                let sql = first + spot + time + city + order_phone + order_no + order_state + type;
                return daoMethod.oneMethod(sql, data);
            }
            let sql = first + spot + time + city + order_phone + order_no + order_state + type + end;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 查询景点详细
         * @param data
         * @return {*}
         */
        searchSpotDetailed: (data) => {
            let sql = ` select o.order_no,o.order_user,u.user_phone,u.user_name as user_nickname,o.order_telephone,o.order_createtime,o.order_state,o.order_price, o.order_payTime,o.order_pay,o.order_destination,o.order_company_name,o.order_remark,o.order_count,
            o.order_departure_datetime,tt.tourist_name,tt.tourist_identityType,tt.tourist_identityNo,tt.tourist_phone,tt.tourist_crowd_type, o.order_price,o.order_safe_price,o.order_amount,o.order_discount ,tt.tourist_email from \`order\` o 
            left join \`user\` u on u.user_id =o.user_id  left join order_tourist ott on ott.order_id=o.order_id left join tourist tt on tt.tourist_id=ott.tourist_id where o.order_id=$order_id `;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 报表管理(票)
         * @param data
         * @returns {*}
         */
        searchTicketReport: (data) => {
            let order_no = `  `;//订单号
            let time = `  `;//下单时间
            let type = ` `;//1:火车票 2：飞机票 3：汽车票 4：船票
            if (data.order_no) {
                order_no = ` and  o.order_no like concat ('%',$order_no,'%')   `;
            }
            if (data.ago && data.end) {
                time = ` and date_format(o.order_createtime,'%Y-%m-%d') between  date_format($ago,'%Y-%m-%d') AND date_format($end,'%Y-%m-%d') `;
            }
            if (!data.type) {
                type = ` and o.product_id in (20,21,22,23)  `;
            }
            if (data.type == 1) {
                type = ` and o.product_id = 1 `;
            }
            if (data.type == 2) {
                type = ` and o.product_id = 2 `;
            }
            if (data.type == 3) {
                type = ` and o.product_id = 3 `;
            }
            if (data.type == 4) {
                type = ` and o.product_id = 4 `;
            }
            let first = ` select o.order_no ,o.order_createtime ,p.product_name ,o.order_count ,o.order_amount from \`order\` o left join product p on p.product_id=o.product_id and p.product_isable=1 where o.order_isable=1  and o.order_state=5  `;
            let end = ` order by o.order_createtime desc limit ${data.page},${data.size} `;
            if (data.counts) {
                let sql = first + order_no + time + type;
                return daoMethod.oneMethod(sql, data);
            }
            let sql = first + order_no + time + type + end;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 报表管理(酒店)
         * @param data
         * @return {*}
         */
        searchHotelReport: (data) => {
            let order_no = `  `;//订单号
            let time = `  `;//下单时间
            let type = ` `;//1:酒店国内 2：酒店国际 3：酒店钟点
            if (data.order_no) {
                order_no = ` and  o.order_no like concat ('%',$order_no,'%')   `;
            }
            if (data.ago && data.end) {
                time = ` and date_format(o.order_createtime,'%Y-%m-%d') between  date_format($ago,'%Y-%m-%d') AND date_format($end,'%Y-%m-%d') `;
            }
            let first = ` select o.order_no ,o.order_createtime ,p.product_name ,o.order_count ,o.order_amount from \`order\` o left join product p on p.product_id=o.product_id and p.product_isable=1 where o.order_isable=1 and o.order_state=5  `;
            let end = ` order by o.order_createtime desc limit ${data.page},${data.size} `;
            if (data.type == 1) {
                type = ` and o.product_id = 17 `;
            }
            if (data.type == 2) {
                type = ` and o.product_id = 18 `;
            }
            if (data.type == 3) {
                type = ` and o.product_id = 19 `;
            }
            if (data.counts) {
                let sql = first + order_no + time + type;
                return daoMethod.oneMethod(sql, data);
            }
            let sql = first + order_no + time + type + end;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 报表管理(生活费用)
         *@param data
         * @return {*}
         */
        searchLifeReport: (data) => {
            let order_no = `  `;//订单号
            let time = `  `;//下单时间
            let type = `  `;//1:水费 2:电费 3:燃气费 4：有线电视-暂无  5：固话 6：宽带 7：物业费-暂无
            if (data.order_no) {
                order_no = ` and  o.order_no like concat ('%',$order_no,'%')   `;
            }
            if (data.ago && data.end) {
                time = ` and date_format(o.order_createtime,'%Y-%m-%d') between  date_format($ago,'%Y-%m-%d') AND date_format($end,'%Y-%m-%d') `;
            }
            let first = ` select o.order_no ,o.order_createtime ,p.product_name ,o.order_count ,o.order_amount from \`order\` o left join product p on p.product_id=o.product_id and p.product_isable=1 where o.order_isable=1 and o.order_state=5  `;
            let end = ` order by o.order_createtime desc limit ${data.page},${data.size} `;
            if (data.type == 1) {
                type = ` and o.product_id = 10 `;
            }
            if (data.type == 2) {
                type = ` and o.product_id = 11 `;
            }
            if (data.type == 3) {
                type = ` and o.product_id = 12 `;
            }
            if (data.type == 3) {
                type = ` and o.product_id = 13 `;
            }
            if (data.type == 5) {
                type = ` and o.product_id = 14 `;
            }
            if (data.type == 6) {
                type = ` and o.product_id = 15 `;
            }
            if (data.type == 7) {
                type = ` and o.product_id = 16 `;
            }
            if (data.counts) {
                let sql = first + order_no + time + type;
                return daoMethod.oneMethod(sql, data);
            }
            let sql = first + order_no + time + type + end;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 报表管理(加油卡)
         *@param data
         * @return {*}
         */
        searchCardReport: (data) => {
            let order_no = `  `;//订单号
            let time = `  `;//下单时间
            let type = ``; //1:中国石油 2：中石化油卡充值
            if (data.order_no) {
                order_no = ` and  o.order_no like concat ('%',$order_no,'%')   `;
            }
            if (data.ago && data.end) {
                time = ` and date_format(o.order_createtime,'%Y-%m-%d') between  date_format($ago,'%Y-%m-%d') AND date_format($end,'%Y-%m-%d') `;
            }
            let first = ` select o.order_no ,o.order_createtime ,p.product_name ,o.order_count ,o.order_amount from \`order\` o left join product p on p.product_id=o.product_id and p.product_isable=1 where o.order_isable=1 and o.order_state=5  `;
            let end = ` order by o.order_createtime desc limit ${data.page},${data.size} `;
            if (data.type == 1) {
                type = ` and o.product_id =8 `;
            }
            if (data.type == 2) {
                type = ` and o.product_id =9 `;
            }
            if (data.counts) {
                let sql = first + order_no + time + type;
                return daoMethod.oneMethod(sql, data);
            }
            let sql = first + order_no + time + type + end;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 测试消费抽奖
         * */
        ceshi:(data)=>{
            let sql=`select * from \`order\` where order_id=$order_id`;
            return daoMethod.oneMethod(sql,data);
        },

        /**
         * 查询各种车票订单列表
         * @param data
         * @return {*}
         */
        getOrderRecord: (data) => {
            let sql = `select order_record_type, 
                            order_record_fail, 
                            DATE_FORMAT(order_record_createtime,'%Y-%m-%d %h:%i:%s') order_record_createtime
                        from 
                            order_record 
                        where 
                            order_id = $order_id`;
            return daoMethod.oneMethod(sql, data);
        },
    };
module.exports = dao;
