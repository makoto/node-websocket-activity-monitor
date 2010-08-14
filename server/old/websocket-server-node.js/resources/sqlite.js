var sys = require('sys');

exports.handleData = function(connection, data) {
    function parseRows(data) {
        var rows = [];
        var row = 0;

        var lines = data.split('\n');

        for (var i = 0; i < lines.length; i++) {
            if (lines[i] === '') {
                row++;
                continue;
            }

            if (rows[row] === undefined)
                rows[row] = {};

            var separator = lines[i].indexOf(' = ');

            // Separate column and value, and remove leading whitespace
            // from column.

            var column = lines[i].substring(0, separator)
                .replace(/^\s*/g, '');
            var value = lines[i].substring(separator + 3);

            rows[row][column] = value;
        }

        return rows;
    }

    sys.exec('sqlite3 -line ./resources/' + data)
    .addCallback(function(stdout, stderr) {
        connection.send('\u0000' + JSON.stringify(parseRows(stdout)) +
            '\uffff');
    });
}

