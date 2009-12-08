require 'webrick'
 
document_root =  '.'
server = WEBrick::HTTPServer.new({
  :DocumentRoot => document_root,
  :BindAddress => '0.0.0.0',
  :Port => 10080
})
 
['INT', 'TERM'].each {|signal|
  Signal.trap(signal){ server.shutdown }
}
 
server.start

