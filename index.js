var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 80;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  io.emit('jalk message', 'jalk_: Ah, i see a new user has joim. Welcome.');
  socket.on('chat message', function(msg){

    //Before we send the msg, we have some modifications to make
    //The message needs to be "jalk-ified", so we must tweak some of the words to be misspelled as josh generally does
    if(msg.indexOf('join') !== -1)  {
        var index = msg.indexOf('join');
        msg = setCharAt(msg,index,'joim');
    }

    io.emit('chat message', 'not jalk_: ' + msg);
    if(msg.indexOf('hentai') !== -1)  {
        io.emit('jalk message', 'jalk_: Oh good grief...');
    }
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+chr.length);
}
