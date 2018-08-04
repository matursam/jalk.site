var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var fs = require("fs");
var userListFile = fs.readFileSync("./public/users/userlist.txt").toString('utf-8');
var userList = userListFile.split("\n");
var keywordsFile = fs.readFileSync("./public/users/keywords.txt").toString('utf-8');
var keywords = keywordsFile.split("\n");

var chatfile = fs.readFileSync(__dirname + "/public/chatlogs/chat.txt").toString('utf-8');
var chat = chatfile.split("\n");

var port = 3000;

server.listen(port);
console.log('listening on *:' + port);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});


io.on('connection', function(socket) {
    var address = socket.client.conn.remoteAddress;
    var username = getUsername();
    console.log('New connection from ' + address + ', assigned username ' + username);
    io.emit('jalk message', 'jalk_: Ah, i see a new user has joim. Welcome.');
    socket.on('chat message', function(msg){

    //Before we send the msg, we have some modifications to make
    //The message needs to be "jalk-ified", so we must tweak some of the words to be misspelled as jalk generally does
    if(msg.indexOf('join') !== -1)  {
        var index = msg.toLowerCase().indexOf('join');
        msg = replaceStringInMessage(msg,index,'joim');
    }

	  //Add in "heyho" occasionally to the message
	  if(Math.random() < 0.1) {
        var randomLocation = Math.floor(Math.random() * (msg.length - 1));
        msg = insertStringInMessage(msg,randomLocation,' - HEYHOOOOO!!!!!!!! - ');
	  }
    var message = username + ': ' + msg;
    io.emit('chat message', address + " - " + username + ': ' + msg);
    chat.push(message + '\n');
    fs.writeFileSync(__dirname + "/public/chatlogs/chat.txt",chat,{encoding:'utf8',flag:'w'});

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
function insertStringInMessage(message, locationToInsert, string) {
	if(locationToInsert > message.length-1) return str;
	return message.substring(0,locationToInsert) + string + message.substring(locationToInsert);
}

function replaceStringInMessage(message, locationToInsert, string) {
	if(locationToInsert > message.length-1) return str;
	return message.substring(0,locationToInsert) + string + message.substring(locationToInsert + string.length);
}

function getUsername() {
	return userList[Math.trunc(Math.random() * (userList.length - 1))];
}