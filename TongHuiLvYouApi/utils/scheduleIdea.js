const schedule = require('node-schedule');
const moment = require('moment');
const scenicService = require('../service/scenicService');
const luck_drawService = require('../service/luck_drawService');
const auto = {
    test: () => {
        //* 0 11 * * *
        schedule.scheduleJob('0 0 12 * * *', () => {
            console.log(moment().format("HH:mm:ss"));
        })
    },
    /**
     * 自动批量处理数据
     */
    autoUpdate: () => {
        schedule.scheduleJob('0 0 2 * * 7', () => {
            // let funArray = [];
            // funArray.push(scenicService.scenicInfoListByPage(1));
            // funArray.push(scenicService.productInfoListByPage(1));
            require('../service/scenicService').productPriceListByPage(1)
            // funArray.push(scenicService.productPriceListByPage(1));
            // Promise.all(funArray).then((res) => {
            //     console.log(res);
            // }).catch((err) => {
            //     console.log(err.message);
            // });
        });
    },

    /**
     * 每晚自动添加抽奖数
     */
    autoAddLuckCount: () => {
        schedule.scheduleJob('0 0 0 * * *', () => {
            luck_drawService.deleteAllLuckDrawCount().then((res) => {
                console.log(res);
                return luck_drawService.addAllLuckDrawCount().then((res) => {
                    console.log('autoAddLuckCount 已添加抽奖数');
                }).catch((err) => {
                    console.log(err.message);
                });
            }).catch((err) => {
                console.log(err.message);
            });
        });
    }
};
module.exports = auto;