# node-websocket-activity-monitor

[Show, don't tell](http://screenr.com/A1U)

## Prerequisite

* [node.js](http://nodejs.org)
* [ruby](www.ruby-lang.org) - just to server static files. Can be anything
* OS which runs "[iostat](http://www.linuxcommand.org/man_pages/iostat1.html)". Most linux and osx should be okay. Don't know about windows.
* A browser which supports HTML5 canvas

## How to get this

    git clone git://github.com/makoto/node-websocket-activity-monitor.git

## How to setup on WebSocket supported browsers

    node server/websocket-server-node.js/server.js
    open client/web-socket-js/iostat-client.html # in Websocke supported browser (eg: Chromium, OSX Chrome)

## How to setup on NON WebSocket supported browsers (tested on firefox, and safari)

    node server/websocket-server-node.js/server.js
    cd client/web-socket-js
    ruby server.rb
    open http://localhost:10080/iostat-client.html

## How to make your cpu 100%

From console, type the following

    while true; do echo 'a'; done
  
Crtl + c will terminate the command.

## My bits and bobs

* README.md
* client/web-socket-js/iostat-client.html
* client/web-socket-js/style.css
* client/web-socket-js/server.rb
* server/websocket-server-node.js/resources/iostat.js

## Others (Thanks !!)

* [jquery](jquery.com) - The Write Less, Do More, JavaScript Library
* [underscore](http://documentcloud.github.com/underscore/) - Functional Programming Aid for Javascript. Works well with jQuery.
* [RGraph](http://www.rgraph.net/) - A canvas graph library based on the HTML5 canvas tag
* [web-socket-js](http://github.com/gimite/web-socket-js) - HTML5 Web Socket implementation powered by Flash
* [websocket-server-node.js](http://github.com/alexanderte/websocket-server-node.js) - A Web Socket server for local use written in JavaScript, using node.js

**NOTE**: I [forked websocket-server-node.js](http://github.com/makoto/websocket-server-node.js) and implemented support for websocket-server-node.js


## Todo

  * Tidy up file structures
  * Remove ruby (please someone let me know nice ways to server static files from node.js)
  * Write a blog post

## License 

 My bits and bobs are [MIT](http://en.wikipedia.org/wiki/MIT_License), but be aware of others. Especially RGraph has its own license, and you can not use it for commercial purpose, I think...

