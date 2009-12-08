var sys = require('sys');

exports.handleData = function(connection, data) {
    sys.exec(data).addCallback(function(stdout, stderr) {
        connection.send('\u0000' + stdout + '\uffff');
    });
}

