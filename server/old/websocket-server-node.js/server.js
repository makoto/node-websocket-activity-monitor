/*
Copyright (c) 2009 Alexander Teinum

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var tcp = require('tcp');
var sys = require('sys');

var server = tcp.createServer(function(connection) {
    if (connection.remoteAddress !== '127.0.0.1') {
        sys.puts('Connection from ' + connection.remoteAddress +
            ' not accepted. Only local connections are currently supported.');
        connection.close();
    }

    connection.setTimeout(0);

    var _doneHandshake = false;
    var _resource = null;

    connection.setEncoding('utf8');


    connection.addListener('receive', function(data) {
        function notAccepted(why) {
            sys.puts('Handshake with ' + connection.remoteAddress +
                ' not accepted. ' + why);
            connection.close();
        }

        function notSupported(why) {
            sys.puts('Handshake with ' + connection.remoteAddress +
                ' has problems. ' + why);
        }

        // Call the first time anything is recieved. Verify handshake from the
        // client and send handshake back if accepted.

        function doHandshake() {
            /*
            These are the lines that are sent as a handshake from the client.
            Chromium sends two blank lines that might be a part of the
            specification.

            0: GET /echo HTTP/1.1
            1: Upgrade: WebSocket
            2: Connection: Upgrade
            3: Host: localhost:8000
            4: Origin: file://
            5:
            6:
            */

            var lines = data.split('\r\n');

            // Line 0
            var request = lines[0].split(' ');
            
            // Return flash policy file for web-socket-js
            // http://github.com/gimite/web-socket-js
            if(request[0].match(/policy-file-request/)){
              sys.puts('requesting flash policy file');
              
              policy_xml = 
              '<?xml version="1.0"?>' +
              '<!DOCTYPE cross-domain-policy SYSTEM ' +
              'ww.macromedia.com/xml/dtds/cross-domain-policy.dtd">' +
              '<cross-domain-policy>' +
              "<allow-access-from domain='*' to-ports='*'/>" +
              '</cross-domain-policy>'
              connection.send(policy_xml);
              connection.close();
            }
            
            if (((request[0] === 'GET') && (request[2] === 'HTTP/1.1'))
                !== true) {
                notAccepted('Request not valid.');
                return;
            }else 
            sys.puts(request.join(','))
            var resource = request[1];

            if (resource[0] !== '/') {
                notAccepted('Request resource not valid.');
                return;
            }

            // Line 1-6

            // Inspired by pywebsocket. If the value is set to anything other
            // than '' here, then it has to be set to the same value by the
            // client.

            var headers = {
                'Upgrade': 'WebSocket',
                'Connection': 'Upgrade',
                'Host': '',
                'Origin': ''
            }

            for (i = 1; i < lines.length; i++) {

                // We should 'continue' if it's acceptable with blank lines
                // between headers.

                if (lines[i] === '')
                    break;

                // Split the header line into a key and a value. Check against
                // the headers hash. Warn the user if the header isn't
                // supported.

                var line = lines[i].split(': ');

                var headerValue = headers[line[0]];

                if (headerValue === undefined) {
                    notSupported('Header \'' + line[0] + '\' not supported.');
                    continue;
                }
                else if ((headerValue !== '') && (line[1] !== headerValue)) {
                    notAccepted('Header \'' + line[0] + '\' is not \'' +
                        headerValue + '\'.');
                    return;
                }
                else
                    headers[line[0]] = line[1];
            }

            // Import requested resource

            try {
                _resource = require('./resources' + resource);
            } catch (e) {
                sys.puts(headers['Host'] + ' tries to connect to resource \'' +
                    resource + '\', but the resource does not exist.');
                connection.close();
                return;
            }

            // Send handshake back

            connection.send('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
                'Upgrade: WebSocket\r\n' +
                'Connection: Upgrade\r\n' +
                'WebSocket-Origin: ' + headers['Origin'] + '\r\n' +
                'WebSocket-Location: ws://' + headers['Host'] + resource +
                    '\r\n' +
                '\r\n');

            _doneHandshake = true;

            return;
        }

        if (!_doneHandshake)
            doHandshake();
        else {
            if (data[0] !== '\u0000' && data[data.length - 1] !== '\ufffd') {
                sys.puts('Invalid message format from client. ' +
                    'Closing connection.');
                connection.close();
                return;
            }
            
            sys.puts("Calling handleData");
            sys.puts(data);
             _resource.handleData(connection, data.substr(1, data.length - 2));
        }
    });
}).listen(8000);

