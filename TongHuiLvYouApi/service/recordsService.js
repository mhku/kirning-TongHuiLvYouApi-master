/**
 * Created by Administrator on 2018/1/12.
 */
const recordsDao = require('../dao/recordsDao');
const serviceMethod = require('../utils/serviceCommon');
const uuid = require('../utils/uuid');
const tokenService = require('../service/tokenService');
const service = {
    /**
     * 查询浏览记录
     * @param data
     * @returns {*}
     */
    queryRecords: (data) => {
        return tokenService.queryUserIdByToken(data).then((result) => {
            data.user_id = result.user_id;
            data.size = parseInt(data.size);
            data.start = (parseInt(data.page) - 1) * data.size;
            return serviceMethod.searchMethod(recordsDao, 'queryRecords', data);
        })
    },
    /**
     * 添加浏览记录
     * @param data
     * @returns {*}
     */
    insertRecords: (data) => {
        data.records_id = uuid.createUUID();
        return tokenService.queryUserIdByToken(data).then((result) => {
            data.user_id = result.user_id;
            return recordsDao.selRecords(data).then((res1) => {
                if (res1.length > 0) {
                    return serviceMethod.updateMethod(recordsDao, 'updateRecords', data);
                } else {
                    return serviceMethod.searchMethod(recordsDao, 'countRecords',data).then((res) => {
                        let counts = res.data[0].count;
                        if (counts > 9) {
                            return serviceMethod.delMethod(recordsDao, 'deleteRecords',data).then((val) => {
                                    return serviceMethod.addMethod(recordsDao, 'insertRecords', data);
                                }
                            )
                        }
                        return serviceMethod.addMethod(recordsDao, 'insertRecords', data);
                    })
                }
            })
        });
    },
    /**
     * 删除浏览记录
     * @param data
     * @returns {*}
     */
    deleteRecords: (data) => {
        return serviceMethod.delMethod(recordsDao, 'deleteRecords', data)
    }
}
module.exports = service;