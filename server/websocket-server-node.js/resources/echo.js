exports.handleData = function(connection, data) {
    connection.send('\u0000' + data + '\uffff');
}

