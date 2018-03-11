/**
 * Created by gu on 2017/7/7.
 */
const mysql = require('mysql');
const async = require('async');
const logger = require('../utils/logHelper').helper;
// const Promise = require('bluebird');
let pool;

pool = mysql.createPool({
    connectionLimit: 1000,
    host: '116.62.129.226',
    user: 'root',
    password: 'qq@303269789',
    database: 'db_hly',
    waitForConnections: false,
    multipleStatements:true,
    queryFormat: (query, values) => {
        if (!values) return query;
        let sql = query.replace(/\$(\w+)/g, function (txt, key) {
            if (values[key] != undefined && values[key] != null) {
                values[key] = values[key].toString();
                const val = mysql.escape(`${values[key]}`);
                return val;
            } else {
                return 'null';
            }
        }.bind(this));
        console.log("执行的SQL语句：" + sql + "  使用的参数: " + JSON.stringify(values));
        return sql;
    }
});
let execTrans = (sqlparamsEntities) => {
    let affectedRows = 0;
    let result = [];
    let i = 0;
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }
            connection.beginTransaction((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                logger.writeInfo("开始执行transaction，共执行" + sqlparamsEntities.length + "条数据");
                sqlparamsEntities.forEach((sql_param) => {
                    let sql = sql_param.sql;
                    let param = sql_param.params;
                    connection.query(sql, param, (tErr, rows) => {
                        logger.writeInfo(sql);
                        if (tErr) {
                            connection.rollback(() => {
                                logger.writeErr("事务失败，" + sql_param + "，ERROR：" + tErr);
                                connection.release();
                                reject(tErr);
                            });
                        } else {
                            logger.writeInfo("sql执行完成");
                            if (rows['affectedRows'] != undefined) {
                                affectedRows += rows.affectedRows;
                            } else {
                                result.push(rows[0]);
                                affectedRows = -100;
                            }
                            i++;
                            if (i == sqlparamsEntities.length) {
                                connection.commit((err, info) => {
                                    if (err) {
                                        logger.writeErr("执行事务失败，" + err);
                                        connection.rollback((err) => {
                                            logger.writeErr("transaction error: " + err);
                                            connection.release();
                                            reject(err);
                                        });
                                    } else {
                                        connection.release();
                                        if (affectedRows < 0) {
                                            resolve(result);
                                        } else {
                                            resolve({affectedRows: affectedRows})
                                        }
                                    }
                                })
                            }
                        }
                    })
                });
            });
        });
    });
};

let getNewSql = (sql, params, callback) => {
    if (callback) {
        return callback(null, {
            sql: sql,
            params: params
        });
    }
    return {
        sql: sql,
        params: params
    };
};

module.exports = {
    pool: pool,
    getNewSql: getNewSql,
    execTrans: execTrans
};
