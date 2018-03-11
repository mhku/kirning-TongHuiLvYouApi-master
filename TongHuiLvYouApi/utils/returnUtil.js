/**
 * Created by Administrator on 2017/9/2.
 */
const xml2js = require('xml2js');
const parser = xml2js.Parser();
const builder = new xml2js.Builder();

const util = {
    /**
     * xml转JSON对象
     * @param xml
     * @returns {Promise}
     */
    toJson: (xml) => {
        return new Promise((resolve, reject) => {
            xml2js.parseString(xml, { explicitArray : false, ignoreAttrs : true } ,(err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    },

    strSplit: (str, char)=>{
        let array = str.split(char);
    },
    /**
     * JSON对象转xml
     * @param json
     * @returns {Promise}
     */
    toXml: (json) => {
        return new Promise((resolve) => {
            let xml = builder.buildObject(json);
            resolve(xml);
        });
    }
};
module.exports = util;