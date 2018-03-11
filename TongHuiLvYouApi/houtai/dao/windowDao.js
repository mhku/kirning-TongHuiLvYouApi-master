let daoMethod = require("../../utils/daoCommon");
let dao =
    {
        /**
         *添加橱窗信息
         *@param data
         * @return {*}
         */
        addWindow: (data) => {
            let sql = ` insert into window (window_id,window_destination,window_pictrue,window_type,window_number,window_link,window_price,window_creator,window_createtime,window_isable,window_class
)
                                    values ($window_id,$window_destination,$window_pictrue,$window_type,${data.window_number},$window_link,$window_price,$window_creator,now(),1,$window_class
)  `;
            return daoMethod.oneMethod(sql, data);
        },

        /**
         * 添加地点名
         * @param data
         * @returns {*}
         */
        addPlace: (data) => {
            const sql = `insert into place(place_id,place_name,place_creator,place_createtime,place_isable)
                            VALUES($place_id,$place_name,$place_creator,now(),'1')`;
            return daoMethod.oneMethod(sql, data);
        },

        /**
         * 修改地点名
         * @param data
         * @return {*}
         */
        updatePlace: (data) => {
            const sql = `update place set place_name = $place_name where place_id = $place_id`;
            return daoMethod.oneMethod(sql,data);
        },


        /**
         * 查看地点
         * @param data
         * @returns {*}
         */
        searchPlace: (data) => {
            const sql = `select * from place limit ${data.page},${data.size}`;
            return daoMethod.oneMethod(sql, data);
        },

        /**
         * 查看地点总数
         * @param data
         * @returns {*}
         */
        searchPlaceCount: (data) => {
            const sql = `select count(*) as count from place `;
            return daoMethod.oneMethod(sql, data);
        },

        /**
         * 查看地点下的图片
         * @param data
         * @returns {*}
         */
        searchPlaceWindow: (data) => {
            const sql = `select a.*,b.productName from window as a left join scenic_product as b on a.product_id = b.productId 
                            where place_id = $place_id
                            order by window_number`;
            return daoMethod.oneMethod(sql,data);
        },


        /**
         * 添加地点下的图片
         * @param item
         * @param data
         * @returns {*}
         */
        addPlaceWindow: (item, data) => {
            const sql = `insert into window(window_id,window_destination,window_pictrue,window_type,window_number,window_price,place_id,window_creator,
                                              window_createtime,window_isable,product_id )
                                 VALUES($window_id,$window_destination,$window_pictrue,'13',$window_number,$window_price,'${data.place_id}','${data.place_creator}',
                                              now(),'1',$product_id)`;
            return daoMethod.oneMethod(sql, item);
        },

        /**
         * 删除地点名
         * @param data
         * @return {*}
         */
        delPlaceWindow: (data) => {
            const sql = `delete from window where place_id = $place_id`;
            return daoMethod.oneMethod(sql, data);
        },


        /**
         * 查询橱窗是否存在-类型(1,目的地 2,精选景点 3,主图 4,首页图片 5,酒店广告 6,机票广告 7,门票广告 8,火车票广告 9,意外险广告 10,航意险广告 11,旅游险广告 12,交通险广告 13,你可能想去橱窗)
         * @param data
         * @return {*}
         */
        findWindow: (data) => {
            if (data.type == 1) {
                let sql = ` select window_id  from window where window_destination=$window_destination and window_type =1 `;
                return daoMethod.oneMethod(sql, data);
            }
            if (data.type == 2) {
                let sql = ` select window_id  from window where window_destination=$window_destination and window_type =2 `;
                return daoMethod.oneMethod(sql, data);
            }
            if (data.type == 3) {
                let sql = ` select window_id  from window where window_destination=$window_destination and window_type =3 `;
                return daoMethod.oneMethod(sql, data);
            }
            if (data.type == 4) {
                let sql = ` select window_id  from window where window_destination=$window_destination and window_type =4 `;
                return daoMethod.oneMethod(sql, data);
            }
            if (data.type == 5) {
                let sql = ` select window_id  from window where window_destination=$window_destination and window_type =5 `;
                return daoMethod.oneMethod(sql, data);
            }
            if (data.type == 6) {
                let sql = ` select window_id  from window where window_destination=$window_destination and window_type =6 `;
                return daoMethod.oneMethod(sql, data);
            }
            if (data.type == 7) {
                let sql = ` select window_id  from window where window_destination=$window_destination and window_type =7 `;
                return daoMethod.oneMethod(sql, data);
            }
            if (data.type == 8) {
                let sql = ` select window_id  from window where window_destination=$window_destination and window_type =8 `;
                return daoMethod.oneMethod(sql, data);
            }
            if (data.type == 9) {
                let sql = ` select window_id  from window where window_destination=$window_destination and window_type =9 `;
                return daoMethod.oneMethod(sql, data);
            }
            if (data.type == 10) {
                let sql = ` select window_id  from window where window_destination=$window_destination and window_type =10 `;
                return daoMethod.oneMethod(sql, data);
            }
            if (data.type == 11) {
                let sql = ` select window_id  from window where window_destination=$window_destination and window_type =11 `;
                return daoMethod.oneMethod(sql, data);
            }
            if (data.type == 12) {
                let sql = ` select window_id  from window where window_destination=$window_destination and window_type =12 `;
                return daoMethod.oneMethod(sql, data);
            }
            if (data.type == 13) {
                let sql = ` select window_id  from window where window_destination=$window_destination and window_type =13 `;
                return daoMethod.oneMethod(sql, data);
            }
            return Promise.reject({code: 2, msg: "参数错误"});
        },
        /**
         * 查询橱窗
         * @param data
         * @return {*}
         */
        searchWindow: (data) => {
            let name = `    `;
            if (data.window_destination) {
                name = ` and a.window_destination  like concat ('%',$window_destination,'%')  `;
            }
            let first = ` select a.*, b.productName from window as a left join scenic_product as b on a.product_id = b.productId  where 1=1 and a.window_type=$window_type `;
            let end = ` order by a.window_number  limit ${data.page},${data.size} `;
            if (data.counts) {
                let sql = first + name;
                return daoMethod.oneMethod(sql, data);
            }
            let sql = first + name + end;
            return daoMethod.oneMethod(sql, data);
        },

        /**
         * 更改橱窗信息
         * @param data
         * @return {*}
         */
        updateWindow: (data) => {
            let sql = ` update window set product_id=$product_id ,window_destination=$window_destination, window_pictrue=$window_pictrue,window_link=$window_link,window_price=$window_price,window_class=$window_class where window_id =$window_id `;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 操作橱窗信息
         * @param data
         * @return {*}
         */
        upWindow: (data) => {
            let states = `   `;
            if (data.states == 1) {
                states = ` update window set window_isable=1  where window_id=$window_id `;//启用
            }
            if (data.states == 0) {
                states = ` update window set window_isable=0  where window_id=$window_id  `;//停用
            }
            if (data.states == 2) {
                states = ` delete from window  where window_type=$window_type   `;//删除所有类型
            }
            if (data.states == 3) {
                states = ` delete from window  where window_id=$window_id   `;//删除单个
            }
            return daoMethod.oneMethod(states, data);
        },
        /**
         * 查询所有橱窗信息 类型(1,目的地 2,精选景点 3,主图 4,首页图片 5,酒店广告 6,机票广告 7,门票广告 8,火车票广告 9,意外险广告 10,航意险广告 11,旅游险广告 12,交通险广告 13,你可能想去橱窗)
         * @param data
         * @return {*}
         */
        searchAllWindow: (data) => {
            let sql = ``;
            if (data.type == 1) {
                sql = ` select window_id,window_destination,window_class, window_link, window_pictrue,window_number,window_createtime ,product_id from window where window_type=1 and window_isable =1  order by window_createtime desc   `;
            }
            if (data.type == 2) {
                sql = ` select window_id,window_destination,window_class, window_link, window_pictrue,window_number,window_createtime ,product_id from window where window_type=2 and window_isable =1  order by window_createtime desc   `;
            }
            if (data.type == 3) {
                sql = ` select window_id,window_destination,window_class, window_link, window_pictrue,window_number,window_createtime ,product_id from window where window_type=3 and window_isable =1  order by window_createtime desc   `;
            }
            if (data.type == 4) {
                sql = ` select window_id,window_destination,window_class, window_link, window_pictrue,window_number,window_createtime ,product_id from window where window_type=4 and window_isable =1  order by window_createtime desc   `;
            }
            if (data.type == 5) {
                sql = ` select window_id,window_destination,window_class, window_link, window_pictrue,window_number,window_createtime ,product_id from window where window_type=5 and window_isable =1  order by window_createtime desc   `;
            }
            if (data.type == 6) {
                sql = ` select window_id,window_destination,window_class, window_link, window_pictrue,window_number,window_createtime ,product_id from window where window_type=6 and window_isable =1  order by window_createtime desc   `;
            }
            if (data.type == 7) {
                sql = ` select window_id,window_destination,window_class, window_link, window_pictrue,window_number,window_createtime ,product_id from window where window_type=7 and window_isable =1  order by window_createtime desc   `;
            }
            if (data.type == 8) {
                sql = ` select window_id,window_destination,window_class, window_link, window_pictrue,window_number,window_createtime ,product_id from window where window_type=8 and window_isable =1  order by window_createtime desc   `;
            }
            if (data.type == 9) {
                sql = ` select window_id,window_destination,window_class, window_link, window_pictrue,window_number,window_createtime ,product_id from window where window_type=9 and window_isable =1  order by window_createtime desc   `;
            }
            if (data.type == 10) {
                sql = ` select window_id,window_destination,window_class, window_link, window_pictrue,window_number,window_createtime ,product_id from window where window_type=10 and window_isable =1  order by window_createtime desc   `;
            }
            if (data.type == 11) {
                sql = ` select window_id,window_destination,window_class, window_link, window_pictrue,window_number,window_createtime ,product_id from window where window_type=11 and window_isable =1  order by window_createtime desc   `;
            }
            if (data.type == 12) {
                sql = ` select window_id,window_destination,window_class, window_link, window_pictrue,window_number,window_createtime ,product_id from window where window_type=12 and window_isable =1  order by window_createtime desc   `;
            }
            if (data.type == 13) {
                sql = ` select window_id,window_destination,window_class, window_link, window_pictrue,window_number,window_createtime ,product_id from window where window_type=13 and window_isable =1  order by window_createtime desc   `;
            }
            return daoMethod.oneMethod(sql, data);
        }
    };
module.exports = dao;