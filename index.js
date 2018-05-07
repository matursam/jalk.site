var express = require('express');  
var app = express();  
var server = require('http').createServer(app); 
var io = require('socket.io')(server); 

var fs = require("fs");
var text = fs.readFileSync("./public/users/userlist.txt").toString('utf-8');
var textByLine = text.split("\n")

var port = 80;

server.listen(port);
console.log('listening on *:' + port);

app.use(express.static(__dirname + '/public')); 

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});


io.on('connection', function(socket){
  var address = socket.handshake.address;
  var username = textByLine[Math.floor(Math.random() * (textByLine.length - 1))];
  console.log('New connection from ' + address.address + ':' + address.port + ', assigned username ' + username);
  io.emit('jalk message', 'jalk_: Ah, i see a new user has joim. Welcome.');
  socket.on('chat message', function(msg){

    //Before we send the msg, we have some modifications to make
    //The message needs to be "jalk-ified", so we must tweak some of the words to be misspelled as jalk generally does
    if(msg.indexOf('join') !== -1)  {
        msg = setCharAt(msg,index,'joim');
        var index = msg.indexOf('join');
    }
	
	//Add in "heyo" occasionally to the message
	if(Math.random() < 0.2) {
		var randomLocation = Math.floor(Math.random() * (msg.length - 1));
		msg = setCharAt(msg,randomLocation,' - HEEEEEYOOOOO!!!!!!!! - ');
	}
    io.emit('chat message', username + ': ' + msg);
	console.log(address + ' ' + username + ' ' + ': ' + msg);
    if(msg.indexOf('hentai') !== -1)  {
        io.emit('jalk message', 'jalk_: Oh good grief...');
    }
  });
});
/*
http.listen(port, function(){
  console.log('listening on *:' + port);
});
*/
function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+chr.length);
}
