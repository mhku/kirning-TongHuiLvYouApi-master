let daoMethod = require("../utils/daoCommon");
let dao =
    {
        /**
         * 查询用户是否有token
         * @param data
         * @return {*}
         */
        searchTokenById: (data) => {
            let sql = `select token from token where user_id = $user_id`;
            return daoMethod.oneMethod(sql, data);
        }
    };

module.exports = dao;
