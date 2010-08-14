var sys = require('sys')
  , http = require("http")
  , ws = require('./node-websocket-server/lib/ws');

var iostat = require('child_process').spawn("iostat", ["-w 1"]);

var httpServer = http.createServer();

var server = ws.createServer({
  debug: true
}, httpServer);

server.addListener("listening", function(){
  sys.log("Listening for connections.");
});

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}

function format (data) {
  var output_data = data.toString();
  sys.log(output_data);
  header = 'disk0       cpu     load average'
  if (output_data.match(header)) {
    sys.log("ignore header")
  }else{
    // disk0 cpu load 
    // average kbt tps kbs us sy id 1m 5m 15m
    var output_array = output_data.trim().split(/\s+/);
    for (var i=0; i < output_array.length; i++) {
      output_array[i] = parseFloat( output_array[i]);
    };
    output_hash = {
      date:new Date(),
      disk:{
        kbt:output_array[0],
        tps:output_array[1],
        mbs:output_array[2]
      },
      cpu:{
        us:output_array[3],
        sy:output_array[4],
        id:output_array[5]
      },
      load_average:{
        m1:output_array[6],
        m5:output_array[7],
        m15:output_array[8]
      }
    }
    return JSON.stringify(output_hash);
  }
}

// Handle WebSocket Requests
server.addListener("connection", function(conn){
  sys.log("opened connection: "+conn.id);
  server.send(conn.id, "Connected as: "+conn.id);
  iostat.stdout.on('data', function (data) {
    sys.log(typeof(data));
    sys.log('stdout: ' + data);
    sys.log('stdout: ' + format(data));
    server.send(conn.id, format(data));
  });
  server.send(conn.id, "Connected as: "+conn.id);
});

server.addListener("close", function(conn){
  sys.log("closed connection: "+conn.id);
  conn.broadcast("<"+conn.id+"> disconnected");
});

server.listen(8000);

// 
// exports.handleData = function(connection, data) {
//   
//   connection.addListener('eof', function(data) {
//    child_process.removeListener("output", output)
//   })
// 
//   var output = function (output_data) {
//     sys.puts(output_data);
//     header = 'disk0       cpu     load average'
//     if (output_data.match(header)) {
//       sys.puts("ignore header")
//     }else{
//       // disk0 cpu load 
//       // average kbt tps kbs us sy id 1m 5m 15m
//       var output_array = output_data.trim().split(/\s+/);
//       for (var i=0; i < output_array.length; i++) {
//         output_array[i] = parseFloat( output_array[i]);
//       };
//       output_hash = {
//         date:new Date(),
//         disk:{
//           kbt:output_array[0],
//           tps:output_array[1],
//           mbs:output_array[2]
//         },
//         cpu:{
//           us:output_array[3],
//           sy:output_array[4],
//           id:output_array[5]
//         },
//         load_average:{
//           m1:output_array[6],
//           m5:output_array[7],
//           m15:output_array[8]
//         }
//       }
//       connection.send('\u0000' + JSON.stringify(output_hash) + '\uffff');
//     }
//   }
//   
//   child_process.addListener("output", output);
// }
