/**
 * Created by gu on 2017/2/10.
 */

const util = {
    createUUID:()=>{
        let s = [];
        const hexDigits = "0123456789abcdef";
        for (var i = 0; i < 32; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);

        let uuid = s.join("");
        return uuid;
    }
};

module.exports = util;