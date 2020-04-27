/**
 * @author Richard
 */

var logger = new function () {
    this.getLogger = function () {
        var loggerObj = new Array();
        if (currentStorage != null) {
            var loggerObjStr = currentStorage.getItem("logger");
            if (loggerObjStr == null || loggerObjStr == undefined || loggerObjStr == "") {
                loggerObj = new Array();
            }
            else {
                try {
                    loggerObj = JSON.parse(loggerObjStr);
                }
                catch (e) {
                    loggerObj = new Array();
                }
            }
        }
        return loggerObj;
    },

        this.clear = function () {
            var loggerObj = this.getLogger();
            if (loggerObj != null && currentStorage != null) {
                currentStorage.removeItem("logger");
            }
        },

        this.info = function (msg) {
            this.log("INFO", msg);
        },

        this.warning = function (msg) {
            this.log("WARNING", msg);
        },

        this.error = function (msg) {
            this.log("ERROR", msg);
        },

        this.log = function (type, msg) {
            let loggerObj = this.getLogger();
            if (loggerObj != null) {
                let logStr = "";
                //var userName=storage.getItem("currentUser");
                let dateTime = dateTimeString = getDateTimeAsString(new Date(), true, "_", true, true);
                logStr = logStr + dateTime + ", " + (type == null ? "INFO" : type) + ": " + (msg == null ? "---" : msg);
                loggerObj.push(logStr);
                currentStorage.setItem("logger", JSON.stringify(loggerObj));
            }
        },

        this.print = function (consoleOnly) {
            var loggerObj = this.getLogger();
            if (loggerObj != null) {
                if (consoleOnly) {
                    console.log(loggerObj);
                }
                else {
                    var logString = loggerObj.length == 0 ? "- no entries -" : loggerObj.join("\r\n");
                    var blob = new Blob([logString], {type: "text/plain;charset=utf-8"});
                    saveAs(blob, "logging_" + getDateTimeAsString(new Date(), false, "_", true, true).replace(/\./g, '').replace(/:/g, '') + ".txt");
                }
            }
        };
};

// END --------------------------------------------------------------------------------------------------
