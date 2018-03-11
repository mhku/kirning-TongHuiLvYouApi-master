const serviceMethod = require('../../utils/serviceCommon');
const versionDao = require('../../houtai/dao/versionDao');
const uuid = require('../../utils/uuid');
let tokenService = require('../../service/tokenService');
let md5 = require('blueimp-md5');
let tokenUtil = require('../../utils/tokenUtil');

const service = {

    /**
     * 查找版本
     * @param data
     * @returns {*|Promise}
     */
    searchVersion: (data) => {
        return serviceMethod.searchMethod(versionDao, "searchVersion", data);
    },

    /**
     * 添加版本号
     * @param data
     * @returns {*|Promise}
     */
    addVersion: (data) => {
        data.version_id = uuid.createUUID();
        return serviceMethod.addMethod(versionDao,"addVersion",data);
    }
};

module.exports = service;