/**
 * Created by gu on 2017/7/7.
 */

const sqlHelper = require("../dao/sqlHelper");
const logger = require("../utils/logHelper").helper;
// const Promise = require('bluebird');

const daoMethod = {
    oneMethod: (sql, value) => {
        return new Promise((resolve, reject) => {
            sqlHelper.pool.getConnection((err, con) => {
                if (value) {
                    con.query(sql, value, (error, results) => {
                        logger.writeInfo(sql);
                        if (error) {
                            logger.writeErr(error);
                            con.release();
                            reject(error);
                        } else {
                            con.release();
                            resolve(results);
                        }
                    });
                } else {
                    con.query(sql, (error, results) => {
                        logger.writeInfo(sql);
                        if (error) {
                            logger.writeErr(error);
                            con.release();
                            reject(error);
                        } else {
                            con.release();
                            resolve(results);
                        }
                    });
                }
            });
        });
    }
};

module.exports = daoMethod;