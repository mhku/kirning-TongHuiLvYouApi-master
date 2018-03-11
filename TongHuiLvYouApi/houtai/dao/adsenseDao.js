let daoMethod = require("../../utils/daoCommon");


let dao =
    {
        /**
         * 增加广告位
         * @param data
         * @return {*}
         */
        addAdsense: (data) => {
            let sql = ` insert into adsense(adsense_id,adsense_name,adsense_number,adsense_code,adsense_creator,adsense_createtime,adsense_isable) 
            values ($adsense_id,$adsense_name,${data.adsense_number},$adsense_code,$adsense_creator,now(),1) `;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 查询广告位存在
         *@param data
         * @return {*}
         */
        findAdsense: (data) => {
            let sql = ` select adsense_id from adsense where adsense_name=$adsense_name and adsense_isable=1 `;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 停用广告位
         *@param data
         * @return {*}
         */
        delAdsense: (data) => {
            let sql = ` update adsense set adsense_isable =$adsense_isable where adsense_id=$adsense_id `;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 广告位列表
         *@param data
         * @return {*}
         */
        searchAdsense: (data) => {
            let first = ` select adsense_id,adsense_name,adsense_number,adsense_code,adsense_createtime ,adsense_isable from adsense  `;
            let end = ` order by adsense_createtime desc  limit ${data.page},${data.size}  `;
            if (data.counts) {
                return daoMethod.oneMethod(first, data);
            }
            let sql = first + end;
            return daoMethod.oneMethod(sql, data);
        },

        /**
         * 添加广告
         *@param data
         * @return {*}
         */
        addAdvertisement: (data) => {
            let sql = ` insert into advertisement (advertisement_id,adsense_id,advertisement_page,advertisement_interval,advertisement_picture,advertisement_url,advertisement_creator,advertisement_createtime,advertisement_isable) 
             values($advertisement_id,$adsense_id,${data.advertisement_page},${data.advertisement_interval},$advertisement_picture,$advertisement_url,$advertisement_creator,now(),1) `;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 广告列表
         *@param data
         * @return {*}
         */
        searchAdvertisement: (data) => {
            let adsense_id = `    `;//广告位ID
            let advertisement_page = `    `;//页码
            let time = `    `;//发布日期
            if (data.adsense_id) {
                adsense_id = ` and a.adsense_id = $adsense_id `;//广告位名称
            }
            if (data.advertisement_page) {
                advertisement_page = ` and adt.advertisement_page = $advertisement_page   `;//广告页码
            }
            if (data.ago && data.end) {
                time = ` and adt.advertisement_createtime between  date_format(adt.advertisement_createtime,'%Y-%m-%d') AND date_format(adt.advertisement_createtime,'%Y-%m-%d') `;
            }
            let frist = ` select a.adsense_name,adt.advertisement_id, adt.advertisement_page,adt.advertisement_interval,adt.advertisement_picture,adt.advertisement_url,adt.advertisement_createtime,adt.advertisement_isable 
            from adsense a  join advertisement adt on a.adsense_id=adt.adsense_id 
            where 1 =1   `;
            let end = ` order by advertisement_createtime desc limit ${data.page},${data.size} `;
            if (data.counts) {
                let sql = frist + adsense_id + advertisement_page + time + end;
                return daoMethod.oneMethod(sql, data);
            }
            let sql = frist + adsense_id + advertisement_page + time;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 停用广告
         *@param data
         * @return {*}
         */
        delAdvertisement: (data) => {
            let sql = `update advertisement set advertisement_isable =$advertisement_isable where advertisement_id=$advertisement_id `;
            return daoMethod.oneMethod(sql, data);
        },
        /**
         * 查询广告是否存在
         *@param data
         * @return {*}
         */
        findAdvertisement: (data) => {
            let sql = ` select advertisement_id from advertisement where adsense_id=$adsense_id and advertisement_page=$advertisement_page and advertisement_isable =1 `;
            return daoMethod.oneMethod(sql, data);
        }
    }

;
module.exports = dao;