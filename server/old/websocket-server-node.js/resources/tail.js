var sys = require('sys');

var filename = process.ARGV[2];
if (!filename)
  throw new Error("Usage: node server.js filename");

var child_process = process.createChildProcess("tail", ["-f", filename]);

exports.handleData = function(connection, data) {
  var output = function (output_data) {
    connection.send('\u0000' + output_data + '\uffff');
  }
  
  connection.addListener('eof', function(data) {
   child_process.removeListener("output", output)
  })
  
  child_process.addListener("output", output);
}
