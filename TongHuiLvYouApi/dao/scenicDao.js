const moment = require('moment');
const sqlstring = require('sqlstring');
const daoMethod = require('../utils/daoCommon');
const sqlHelper = require('./sqlHelper');

const dao = {
    /**
     * 添加景区数据
     * @param data
     * @returns {*}
     */
    addScenicInfo: (data) => {
        let sql = `insert into scenic(scenicId, scenicName, placeInfo, placeAct, placeLevel, placeImage, placeToAddr, openTimes, 
                   placeTown, placeXian, placeCity, placeProvince, placeCountry, baiduData, googleData, scenic_update_time) values `,
            update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        data.forEach((item, index) => {
            if (item) {
                let placeLevel = item.placeLevel ? sqlstring.escape(`${item.placeLevel}`) : null,
                    placeInfo = item.placeInfo ? sqlstring.escape(`${item.placeInfo}`) : null,
                    placeAct = item.placeAct ? sqlstring.escape(`${item.placeAct}`) : null,
                    placeImage = item.placeImage ? sqlstring.escape(`${JSON.stringify(item.placeImage)}`) : null,
                    placeToAddr = item.placeToAddr ? sqlstring.escape(`${item.placeToAddr}`) : null,
                    openTimes = item.openTimes ? sqlstring.escape(`${JSON.stringify(item.openTimes)}`) : null,
                    placeTown = item.placeTown ? sqlstring.escape(`${item.placeTown}`) : null,
                    placeXian = item.placeXian ? sqlstring.escape(`${item.placeXian}`) : null,
                    placeCity = item.placeCity ? sqlstring.escape(`${item.placeCity}`) : null,
                    placeProvince = item.placeImage ? sqlstring.escape(`${item.placeImage}`) : null,
                    placeCountry = item.placeCountry ? sqlstring.escape(`${item.placeCountry}`) : null,
                    baiduData = item.baiduData ? sqlstring.escape(`${JSON.stringify(item.baiduData)}`) : null,
                    googleData = item.googleData ? sqlstring.escape(`${JSON.stringify(item.googleData)}`) : null;

                sql += (`(${item.scenicId}, '${item.scenicName}', ${placeInfo}, ${placeAct}, ${placeLevel}, ${placeImage}, ${placeToAddr}, ${openTimes}, ${placeTown}, ${placeXian}, ${placeCity}, ${placeProvince}, ${placeCountry}, ${baiduData}, ${googleData}, '${update_time}')`);
                if (index === data.length - 1) {
                    sql += `;`;
                } else {
                    sql += `,\n`;
                }
            }
        });
        return daoMethod.oneMethod(sql);
    },

    /**
     * 添加产品数据
     * @param data
     * @returns {*}
     */
    addScenicProductInfo: (data) => {
        let sqls = [];
        let sql1 = 'insert into scenic_product(productId, placeId, placeName, productName, productType, productStatus, postList, recommendList, bookingInfo, introduction, activities, characteristic, playAttractions, productTheme, serviceGuarantee, images, scenic_product_update_time) values \n',
            update_time = moment().format('YYYY-MM-DD HH:mm:ss'),
            sql2 = `insert into scenic_goods (goodsId, standardName, goodsSort, paymentType, ticketType, adultTicket, childTicket, goodsType, certificate, settlementMethod, \`status\`, effective, rules, otherRule, minimum, maximum, costInclude, notice, needTicket, visitAddress, Ticketdescription, passTimeLimit, importentPoint, importantNotice, refundRuleNotice, limitation, booker, traveller, productId, goodsName, scenic_goods_update_time) values\n`,
            count = 0;
        data.forEach((item, index) => {
            if (item) {
                let productId = item.productId,
                    postList = item.postList ? sqlstring.escape(`${JSON.stringify(item.postList)}`) : null,
                    recommendList = item.recommendList ? sqlstring.escape(`${JSON.stringify(item.recommendList)}`) : null,
                    placeName = item.placeName ? sqlstring.escape(`${JSON.stringify(item.placeName)}`) : null,
                    bookingInfo = item.bookingInfo ? sqlstring.escape(`${JSON.stringify(item.bookingInfo)}`) : null,
                    introduction = item.introduction ? sqlstring.escape(`${item.introduction}`) : null,
                    activities = item.activities ? sqlstring.escape(`${JSON.stringify(item.activities)}`) : null,
                    characteristic = item.characteristic ? sqlstring.escape(`${JSON.stringify(item.characteristic)}`) : null,
                    playAttractions = item.playAttractions ? sqlstring.escape(`${JSON.stringify(item.playAttractions)}`) : null,
                    productTheme = item.productTheme ? sqlstring.escape(`${JSON.stringify(item.productTheme)}`) : null,
                    serviceGuarantee = item.serviceGuarantee ? sqlstring.escape(`${item.serviceGuarantee}`) : null,
                    images = item.images ? sqlstring.escape(`${JSON.stringify(item.images)}`) : null;
                sql1 += (`(${productId}, ${item.placeId}, ${placeName}, '${item.productName}', '${item.productType}', '${item.productStatus}', ` +
                    `${postList}, ${recommendList}, ${bookingInfo}, ${introduction}, ${activities}, ${characteristic}, ${playAttractions}, ` +
                    `${productTheme}, ${serviceGuarantee}, ${images}, '${update_time}')`);

                if (index === data.length - 1) {
                    sql1 += `;`;
                } else {
                    sql1 += `,\n`;
                }
                let goodsList = item.goodsList;
                if (goodsList) {
                    goodsList.forEach((good, i) => {
                        count++;
                        let goodsId = good.goodsId;
                        let standardName = good.standardName ? sqlstring.escape(`${good.standardName}`) : null;
                        let goodsSort = good.goodsSort ? sqlstring.escape(`${good.goodsSort}`) : null;
                        let paymentType = good.paymentType ? sqlstring.escape(`${good.paymentType}`) : null;
                        let ticketType = good.ticketType ? sqlstring.escape(`${good.ticketType}`) : null;
                        let adultTicket = good.adultTicket ? sqlstring.escape(`${good.adultTicket}`) : null;
                        let childTicket = good.childTicket ? sqlstring.escape(`${good.childTicket}`) : null;
                        let goodsType = good.goodsType ? sqlstring.escape(`${good.goodsType}`) : null;
                        let certificate = good.certificate ? sqlstring.escape(`${good.certificate}`) : null;
                        let settlementMethod = good.settlementMethod ? sqlstring.escape(`${good.settlementMethod}`) : null;
                        let status = good.status ? sqlstring.escape(`${good.status}`) : null;
                        let effective = good.effective ? sqlstring.escape(`${good.effective}`) : null;
                        let rules = good.rules ? sqlstring.escape(`${JSON.stringify(good.rules)}`) : null;
                        let otherRule = good.otherRule ? sqlstring.escape(`${JSON.stringify(good.otherRule)}`) : null;
                        let minimum = good.minimum ? good.minimum : null;
                        let maximum = good.maximum ? good.maximum : null;
                        let costInclude = good.costInclude ? sqlstring.escape(`${good.costInclude}`) : null;
                        let notice = good.notice ? sqlstring.escape(`${JSON.stringify(good.notice)}`) : null;
                        let needTicket = good.needTicket ? sqlstring.escape(`${good.needTicket}`) : null;
                        let visitAddress = good.visitAddress ? sqlstring.escape(`${good.visitAddress}`) : null;
                        let Ticketdescription = good.Ticketdescription ? sqlstring.escape(`${good.Ticketdescription}`) : null;
                        let passTimeLimit = good.passTimeLimit ? sqlstring.escape(`${JSON.stringify(good.passTimeLimit)}`) : null;
                        let importentPoint = good.importentPoint ? sqlstring.escape(`${good.importentPoint}`) : null;
                        let importantNotice = good.importantNotice ? sqlstring.escape(`${good.importantNotice}`) : null;
                        let refundRuleNotice = good.refundRuleNotice ? sqlstring.escape(`${good.refundRuleNotice}`) : null;
                        let limitation = good.limitation ? sqlstring.escape(`${JSON.stringify(good.limitation)}`) : null;
                        let booker = good.booker ? sqlstring.escape(`${JSON.stringify(good.booker)}`) : null;
                        let traveller = good.traveller ? sqlstring.escape(`${JSON.stringify(good.traveller)}`) : null;
                        let goodsOnLine = good.goodsOnLine ? sqlstring.escape(`${good.goodsOnLine}`) : null;
                        let goodsName = good.goodsName ? sqlstring.escape(`${good.goodsName}`) : null;
                        sql2 += `(${goodsId}, ${standardName}, ${goodsSort}, ${paymentType}, ${ticketType}, ${adultTicket}, ${childTicket}, ${goodsType}, ${certificate}, ${settlementMethod}, ${status}, ${effective}, ${rules}, ${otherRule}, ${minimum}, ${maximum}, ${costInclude}, ${notice}, ${needTicket}, ${visitAddress}, ${Ticketdescription}, ${passTimeLimit}, ${importentPoint}, ${importantNotice}, ${refundRuleNotice}, ${limitation}, ${booker}, ${traveller}, ${productId}, ${goodsName}, '${update_time}'),\n`;
                    });
                }
            }
        });
        sqls.push(sqlHelper.getNewSql(sql1, {}));
        if (count > 0) {
            sql2 = sql2.substring(0, sql2.lastIndexOf(',')) + `;`;
            sqls.push(sqlHelper.getNewSql(sql2, {}));
        }
        return sqlHelper.execTrans(sqls);
    },

    /**
     * 修改产品数据
     * @param data
     * @returns {*}
     */
    updateScenicProductInfo: (data) => {
        let sqls = [], update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        data.forEach((item) => {
            if (item) {
                let postList = item.postList ? sqlstring.escape(`${JSON.stringify(item.postList)}`) : null,
                    recommendList = item.recommendList ? sqlstring.escape(`${JSON.stringify(item.recommendList)}`) : null,
                    placeName = item.placeName ? sqlstring.escape(`${JSON.stringify(item.placeName)}`) : null,
                    bookingInfo = item.bookingInfo ? sqlstring.escape(`${JSON.stringify(item.bookingInfo)}`) : null,
                    introduction = item.introduction ? sqlstring.escape(`${item.introduction}`) : null,
                    activities = item.activities ? sqlstring.escape(`${JSON.stringify(item.activities)}`) : null,
                    characteristic = item.characteristic ? sqlstring.escape(`${JSON.stringify(item.characteristic)}`) : null,
                    playAttractions = item.playAttractions ? sqlstring.escape(`${JSON.stringify(item.playAttractions)}`) : null,
                    productTheme = item.productTheme ? sqlstring.escape(`${JSON.stringify(item.productTheme)}`) : null,
                    serviceGuarantee = item.serviceGuarantee ? sqlstring.escape(`${item.serviceGuarantee}`) : null,
                    images = item.images ? sqlstring.escape(`${JSON.stringify(item.images)}`) : null,
                    goodsList = item.goodsList ? sqlstring.escape(`${JSON.stringify(item.goodsList)}`) : null;

                sqls.push(sqlHelper.getNewSql(`update scenic_product set placeId=${item.placeId}, placeName=${placeName}, productName='${item.productName}', productType='${item.productType}', 
                           postList=${postList}, recommendList=${recommendList}, bookingInfo=${bookingInfo}, introduction=${introduction}, 
                           activities=${activities}, characteristic=${characteristic}, playAttractions=${playAttractions}, productTheme=${productTheme}, serviceGuarantee=${serviceGuarantee},
                           images=${images}, goodsList=${goodsList}, scenic_product_update_time='${update_time}' where productId=${item.productId}`, {}));
            }
        });
        return sqlHelper.execTrans(sqls);
    },

    /**
     * 添加景区商品价格/库存
     * @param data
     * @returns {*}
     */
    addScenicGood: (data) => {
        if (!data || data.length == 0) {
            return Promise.resolve({code: 1, msg: "商品价格为空"});
        }
        let sql = `insert into scenic_goods (goodsId, standardName, goodsSort, paymentType, ticketType, adultTicket, childTicket, goodsType, certificate, settlementMethod, \`status\`, effective, rules, otherRule, minimum, maximum, costInclude, notice, needTicket, visitAddress, Ticketdescription, passTimeLimit, importentPoint, importantNotice, refundRuleNotice, limitation, booker, traveller, productId, goodsName, scenic_goods_update_time) values\n`,
            update_time = moment().format('YYYY-MM-DD HH:mm:ss'), count = 0;
        data.forEach((good) => {
            if (good) {
                let productId = good.productId;
                let goodsId = good.goodsId;
                let standardName = good.standardName ? sqlstring.escape(`${good.standardName}`) : null;
                let goodsSort = good.goodsSort ? sqlstring.escape(`${good.goodsSort}`) : null;
                let paymentType = good.paymentType ? sqlstring.escape(`${good.paymentType}`) : null;
                let ticketType = good.ticketType ? sqlstring.escape(`${good.ticketType}`) : null;
                let adultTicket = good.adultTicket ? sqlstring.escape(`${good.adultTicket}`) : null;
                let childTicket = good.childTicket ? sqlstring.escape(`${good.childTicket}`) : null;
                let goodsType = good.goodsType ? sqlstring.escape(`${good.goodsType}`) : null;
                let certificate = good.certificate ? sqlstring.escape(`${good.certificate}`) : null;
                let settlementMethod = good.settlementMethod ? sqlstring.escape(`${good.settlementMethod}`) : null;
                let status = good.status ? sqlstring.escape(`${good.status}`) : null;
                let effective = good.effective ? sqlstring.escape(`${good.effective}`) : null;
                let rules = good.rules ? sqlstring.escape(`${JSON.stringify(good.rules)}`) : null;
                let otherRule = good.otherRule ? sqlstring.escape(`${JSON.stringify(good.otherRule)}`) : null;
                let minimum = good.minimum ? good.minimum : null;
                let maximum = good.maximum ? good.maximum : null;
                let costInclude = good.costInclude ? sqlstring.escape(`${good.costInclude}`) : null;
                let notice = good.notice ? sqlstring.escape(`${JSON.stringify(good.notice)}`) : null;
                let needTicket = good.needTicket ? sqlstring.escape(`${good.needTicket}`) : null;
                let visitAddress = good.visitAddress ? sqlstring.escape(`${good.visitAddress}`) : null;
                let Ticketdescription = good.Ticketdescription ? sqlstring.escape(`${good.Ticketdescription}`) : null;
                let passTimeLimit = good.passTimeLimit ? sqlstring.escape(`${JSON.stringify(good.passTimeLimit)}`) : null;
                let importentPoint = good.importentPoint ? sqlstring.escape(`${good.importentPoint}`) : null;
                let importantNotice = good.importantNotice ? sqlstring.escape(`${good.importantNotice}`) : null;
                let refundRuleNotice = good.refundRuleNotice ? sqlstring.escape(`${good.refundRuleNotice}`) : null;
                let limitation = good.limitation ? sqlstring.escape(`${JSON.stringify(good.limitation)}`) : null;
                let booker = good.booker ? sqlstring.escape(`${JSON.stringify(good.booker)}`) : null;
                let traveller = good.traveller ? sqlstring.escape(`${JSON.stringify(good.traveller)}`) : null;
                let goodsOnLine = good.goodsOnLine ? sqlstring.escape(`${good.goodsOnLine}`) : null;
                let goodsName = good.goodsName ? sqlstring.escape(`${good.goodsName}`) : null;
                sql += `(${goodsId}, ${standardName}, ${goodsSort}, ${paymentType}, ${ticketType}, ${adultTicket}, ${childTicket}, ${goodsType}, ${certificate}, ${settlementMethod}, ${status}, ${effective}, ${rules}, ${otherRule}, ${minimum}, ${maximum}, ${costInclude}, ${notice}, ${needTicket}, ${visitAddress}, ${Ticketdescription}, ${passTimeLimit}, ${importentPoint}, ${importantNotice}, ${refundRuleNotice}, ${limitation}, ${booker}, ${traveller}, ${productId}, ${goodsName}, '${update_time}'),\n`;
            }
        });
        sql = sql.substring(0, sql.length - 2) + `;`;
        return daoMethod.oneMethod(sql);
    },

    /**
     * 修改景区商品价格/库存
     * @param data
     * @returns {*}
     */
    updateScenicGood: (data) => {
        let sqls = [], update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        data.forEach((good) => {
            if (good) {
                let productId = good.productId;
                let goodsId = good.goodsId;
                let standardName = good.standardName ? sqlstring.escape(`${good.standardName}`) : null;
                let goodsSort = good.goodsSort ? sqlstring.escape(`${good.goodsSort}`) : null;
                let paymentType = good.paymentType ? sqlstring.escape(`${good.paymentType}`) : null;
                let ticketType = good.ticketType ? sqlstring.escape(`${good.ticketType}`) : null;
                let adultTicket = good.adultTicket ? sqlstring.escape(`${good.adultTicket}`) : null;
                let childTicket = good.childTicket ? sqlstring.escape(`${good.childTicket}`) : null;
                let goodsType = good.goodsType ? sqlstring.escape(`${good.goodsType}`) : null;
                let certificate = good.certificate ? sqlstring.escape(`${good.certificate}`) : null;
                let settlementMethod = good.settlementMethod ? sqlstring.escape(`${good.settlementMethod}`) : null;
                let status = good.status ? sqlstring.escape(`${good.status}`) : null;
                let effective = good.effective ? sqlstring.escape(`${good.effective}`) : null;
                let rules = good.rules ? sqlstring.escape(`${JSON.stringify(good.rules)}`) : null;
                let otherRule = good.otherRule ? sqlstring.escape(`${JSON.stringify(good.otherRule)}`) : null;
                let minimum = good.minimum ? good.minimum : null;
                let maximum = good.maximum ? good.maximum : null;
                let costInclude = good.costInclude ? sqlstring.escape(`${good.costInclude}`) : null;
                let notice = good.notice ? sqlstring.escape(`${JSON.stringify(good.notice)}`) : null;
                let needTicket = good.needTicket ? sqlstring.escape(`${good.needTicket}`) : null;
                let visitAddress = good.visitAddress ? sqlstring.escape(`${good.visitAddress}`) : null;
                let Ticketdescription = good.Ticketdescription ? sqlstring.escape(`${good.Ticketdescription}`) : null;
                let passTimeLimit = good.passTimeLimit ? sqlstring.escape(`${JSON.stringify(good.passTimeLimit)}`) : null;
                let importentPoint = good.importentPoint ? sqlstring.escape(`${good.importentPoint}`) : null;
                let importantNotice = good.importantNotice ? sqlstring.escape(`${good.importantNotice}`) : null;
                let refundRuleNotice = good.refundRuleNotice ? sqlstring.escape(`${good.refundRuleNotice}`) : null;
                let limitation = good.limitation ? sqlstring.escape(`${JSON.stringify(good.limitation)}`) : null;
                let booker = good.booker ? sqlstring.escape(`${JSON.stringify(good.booker)}`) : null;
                let traveller = good.traveller ? sqlstring.escape(`${JSON.stringify(good.traveller)}`) : null;
                let goodsOnLine = good.goodsOnLine ? sqlstring.escape(`${good.goodsOnLine}`) : null;
                let goodsName = good.goodsName ? sqlstring.escape(`${good.goodsName}`) : null;
                let sql = `update scenic_goods set standardName = ${standardName}, goodsSort = ${goodsSort}, paymentType = ${paymentType}, ticketType = ${ticketType}, adultTicket = ${adultTicket},
                           childTicket = ${childTicket}, goodsType = ${goodsType}, certificate = ${certificate}, settlementMethod = ${settlementMethod}, status = ${status}, 
                           effective = ${effective}, rules = ${rules}, otherRule = ${otherRule}, minimum = ${minimum}, maximum = ${maximum}, costInclude = ${costInclude}, notice = ${notice}, 
                           needTicket = ${needTicket}, visitAddress = ${visitAddress}, Ticketdescription = ${Ticketdescription}, passTimeLimit = ${passTimeLimit}, importentPoint = ${importentPoint}, 
                           importantNotice = ${importantNotice}, refundRuleNotice = ${refundRuleNotice}, limitation = ${limitation}, booker = ${booker}, traveller = ${traveller}, productId = ${productId}, 
                           goodsName = ${goodsName}, update_time = '${update_time}' where goodsId = ${goodsId}`;
                sqls.push(sqlHelper.getNewSql(sql, {}));
            }
        });
        return sqlHelper.execTrans(sqls);
    },

    /**
     * 根据关键字及景区查出产品
     * @param data
     */
    // searchScenicProducts: (data) => {
    //     let sql = `select s.*, sp.* from scenic as s,
    //                inner join scenic_product as sp on s.scenicId = sp.placeId
    //                where s.scenicName = $scenicName`;
    //     if (data.productName) {
    //         sql += ` and sp.productName like concat('%', $productName, '%')`;
    //     }
    //     sql += ` limit ${data.start},${data.size}`;
    //     return daoMethod.oneMethod(sql, data);
    // },

    /**
     * 按关键字及景点搜索产品
     * @param data
     * @param data.sort 1升序 2降序
     * @returns {*}
     */
    searchScenicProducts: (data) => {
        let sort = 'asc';
        if (data.sort == 1) {
            sort = 'desc'
        }
        let sql1 = ``;
        if (data.productName) sql1 = ` and sp.productName like concat('%',$productName,'%')`;
        // let sql = `select distinct s.scenicId as si, s.*, sp.* from scenic as s
        //            inner join scenic_product as sp on s.scenicId = sp.placeId and sp.productStatus = 'true'
        //            inner join scenic_goods as sg on sg.productId = sp.productId and sg.\`status\` = 'true'
        //            inner join scenic_goodPrice as g on g.goodsId = sg.goodsId and g.date > now()
        //            where s.placeCity = $scenicName ${sql1}  group by sp.productId order by sp.scenic_product_update_time ${sort} limit ${data.start},${data.size}`;
        let sql = `select distinct s.scenicId as si, s.*, sp.* from scenic as s 
                   inner join scenic_product as sp on s.scenicId = sp.placeId and sp.productStatus = 'true' 
                   inner join scenic_goods as sg on sg.productId = sp.productId and sg.\`status\` = 'true'
                   inner join scenic_goodPrice as g on g.goodsId = sg.goodsId 
                   where s.placeCity = $scenicName ${sql1}  group by sp.productId order by sp.scenic_product_update_time ${sort} limit ${data.start},${data.size}`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 修改产品上下架
     * @param data
     * @returns {*}
     */
    updteProduceOnLine: (data) => {
        let sqls = [], update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        data.productIds.forEach((id) => {
            let sql = `update scenic_product as s set s.productStatus = '${data.productStatus}', 
                       s.scenic_product_update_time = '${update_time}' where s.productId = ${id}`;
            sqls.push(sqlHelper.getNewSql(sql, {}));
        })
        return sqlHelper.execTrans(sqls);
    },

    /**
     * 修改商品上下架
     * @param data
     * @returns {*}
     */
    updteGoodOnLine: (data) => {
        let sqls = [], update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        data.goodsIds.forEach((id) => {
            let sql = `update scenic_goods as s set s.goodsOnLine = '${data.goodsOnLine}', 
                       s.scenic_goods_update_time = '${update_time}' where s.goodsId = ${id}`;
            sqls.push(sqlHelper.getNewSql(sql, {}));
        })
        return sqlHelper.execTrans(sqls);
    },

    /**
     * 删除价格及库存
     * @param data
     */
    deleteGoodPrice: (data) => {
        let sqls = [];
        data.goodsIds.forEach((id) => {
            let sql = `delete from scenic_goodPrice where goodsId = ${id}`;
            sqls.push(sqlHelper.getNewSql(sql, {}));
        });
        return sqlHelper.execTrans(sqls);
    },

    /**
     * 添加价格及库存
     * @param data
     */
    addGoodPrice: (data) => {
        let update_time = moment().format('YYYY-MM-DD HH:mm:ss'),
            sql = `insert into scenic_goodPrice(goodsId, \`date\`, marketPrice, sellPrice, b2bPrice, stock, aheadHour, scenic_goodPrice_update_time) values\n`;
        data.forEach((item) => {
            item.goodsList.goods.forEach((good) => {
                let goodsId = good.goodsId, prices = good.prices.price;
                prices.forEach((price) => {
                    let date = moment(price.date).format('YYYY-MM-DD HH:mm:ss');
                    let marketPrice = price.marketPrice ? parseInt(parseFloat(price.marketPrice) * 100) : 0;
                    let sellPrice = price.sellPrice ? parseInt(parseFloat(price.sellPrice) * 100) : 0;
                    let b2bPrice = price.b2bPrice ? parseInt(parseFloat(price.b2bPrice) * 100) : 0;
                    let stock = price.stock ? price.stock : 0;
                    let aheadHour = price.aheadHour ? price.aheadHour : 0;
                    sql += `(${goodsId},'${date}',${marketPrice},${sellPrice},${b2bPrice},${stock},${aheadHour},'${update_time}'),\n`;
                });
            });
        });
        sql = sql.substring(0, sql.lastIndexOf(',')) + `;`;
        return daoMethod.oneMethod(sql);
    },

    /**
     * 添加价格及库存
     * @param data
     */
    addGoodPrice2: (data) => {
        let update_time = moment().format('YYYY-MM-DD HH:mm:ss'),
            sql = `insert into scenic_goodPrice(goodsId, \`date\`, marketPrice, sellPrice, b2bPrice, stock, aheadHour, scenic_goodPrice_update_time) values\n`;
        data.forEach((price) => {
            let goodsId = price.goodsId;
            let date = moment(price.date).format('YYYY-MM-DD HH:mm:ss');
            let marketPrice = price.marketPrice ? parseInt(parseFloat(price.marketPrice) * 100) : 0;
            let sellPrice = price.sellPrice ? parseInt(parseFloat(price.sellPrice) * 100) : 0;
            let b2bPrice = price.b2bPrice ? parseInt(parseFloat(price.b2bPrice) * 100) : 0;
            let stock = price.stock ? price.stock : 0;
            let aheadHour = price.aheadHour ? price.aheadHour : 0;
            sql += `(${goodsId},'${date}',${marketPrice},${sellPrice},${b2bPrice},${stock},${aheadHour},'${update_time}'),\n`;
        });
        sql = sql.substring(0, sql.lastIndexOf(',')) + `;`;
        return daoMethod.oneMethod(sql);
    },

    /**
     * 根据商品ID查找信息
     * @param data.goodsId
     */
    findGoodById: (data) => {
        let sql = `select s.goodsId, sg.productId, sp.placeId, s.\`date\`, s.sellPrice, s.stock, sg.goodsName, sp.placeName ->> '$.mainName' as mainName, sp.productName from scenic_goodPrice as s 
                   join scenic_goods as sg on sg.goodsId = s.goodsId and sg.\`status\` = 'true'
                   join scenic_product as sp on sp.productId = sg.productId and sp.productStatus = 'true'
                   where s.goodsId = $goodsId and s.\`date\` = $visitDate`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 根据产品ID查找商品
     * @param data.productId
     */
    findGoodByProductId: (data) => {
        let sql = `select distinct sg.goodsId as gi, sg.* from scenic_goods as sg 
                   join scenic_product as sp on sp.productId = sg.productId and sp.productStatus = 'true'
                   join scenic_goodPrice as g on g.goodsId = sg.goodsId and g.date > now()
                   where sp.productId = $productId and sg.\`status\` = 'true'`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查找产品
     * @param data.goodsId
     */
    findProductById: (data) => {
        let sql = `select sp.*, s.* from scenic_product as sp 
                   left join scenic as s on s.scenicId = sp.placeId
                   where sp.productId = $productId and sp.productStatus = 'true'`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 根据商品ID查找价格
     * @param data.goodsId
     */
    findPriceByGoodId: (data) => {
        let sql = `select s.* from scenic_goodPrice as s 
                   join scenic_goods as sg on sg.goodsId = s.goodsId and sg.\`status\` = 'true'
                   join scenic_product as sp on sp.productId = sg.productId and sp.productStatus = 'true'
                   where s.goodsId = $goodsId and s.date > now() group by s.date order by s.date`;
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 查询所有商品
     * @returns {*}
     */
    searchAllGoods: (data) => {
        let sql = ``;
        if (data.count) {
            sql = `select count(s.goodsId) as good_count from scenic_goods as s where s.\`status\` = 'true'`;
        } else {
            const start = (data.page - 1) * 50;
            sql = `select s.goodsId as goodsIds from scenic_goods as s where s.\`status\` = 'true' limit ${start}, 50`;
        }
        return daoMethod.oneMethod(sql, data);
    },

    /**
     * 删除所有商品价格
     * @returns {*}
     */
    deleteGoods: () => {
        let sql = `delete from scenic_goodPrice`;
        return daoMethod.oneMethod(sql, {});
    }
};
module.exports = dao;