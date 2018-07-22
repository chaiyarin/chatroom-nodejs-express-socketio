var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.post('/chat-room', (req, res) => {
  res.sendFile(__dirname + '/chat-room.html');
})

app.get('/chat-room', (req, res) => {
  res.sendFile(__dirname + '/chat-room.html');
})

io.on('connection', function(socket){

  socket.on('disconnect', function(){
    console.log('disconnected');
  });

  socket.emit('server-to-client', { server: 'server connected' });
  socket.on('client-to-server', function (data) {
    // socket.emit('server-to-client', { server: data.message });
    io.emit('server-to-client', { server: data.message });
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
