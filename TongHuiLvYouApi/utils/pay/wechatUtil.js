const util = {
    /**
     * 排序
     * @param args
     * @returns {string}
     */
    raw: function (args) {
        var keys = Object.keys(args);
        keys = keys.sort();
        var newArgs = {};
        keys.forEach(function (key) {
            newArgs[key] = args[key];
        });
        var string = '';
        for (var k in newArgs) {
            let value = newArgs[k];
            if (!value) {
                continue;
            }
            string += '&' + k + '=' + value;
        }
        string = string.substr(1);
        return string;
    }
};
module.exports = util;