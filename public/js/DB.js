App.database = (function () {
    'use strict';

    var smallDatabase;

    function runQuery(query, data, successCallback, errorCallback) {
        var i, l, remaining;

        if (!(data[0] instanceof Array)) {
            data = [data];
        }

        remaining = data.length;

        function innerSuccessCallback(tx, rs) {
            var i, l, output = [];
            remaining = remaining - 1;
            if (!remaining) {

                // HACK Convert row object to an array to make our lives easier
                for (i = 0, l = rs.rows.length; i < l; i = i + 1) {
                    output.push(rs.rows.item(i));
                }
                if (successCallback) {
                    successCallback(output);
                }
            }
        }

        function innererrorCallback(tx, e) {
            if (errorCallback) {
                errorCallback(tx);
            }else{
                alert("An error has occurred");
            }
        }

        smallDatabase.transaction(function (tx) {
            for (i = 0, l = data.length; i < l; i = i + 1) {
                tx.executeSql(query, data[i], innerSuccessCallback, innererrorCallback);
            }
        });
    }

    function open(successCallback) {
        smallDatabase = openDatabase("APP", "1.0", "Not The FT Web App", (5 * 1024 * 1024));
        runQuery("CREATE TABLE IF NOT EXISTS articles(id INTEGER PRIMARY KEY ASC, title TEXT, lang INTEGER, body TEXT, length INTEGER)", [], successCallback);
    }

    return {
        open: open,
        runQuery: runQuery
    };
}());