var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(__dirname));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.post('/chat-room', (req, res) => {
  res.render(__dirname + '/chat-room',{ data: req.body})
})

app.get('/chat-room', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

io.on('connection', function(socket){

  socket.on('disconnect', function(){
    console.log('disconnected');
  });

  socket.emit('server-to-client', {
    type: 'server',
    username: '',
    message: 'Server Connected'
  });

  socket.on('client-to-server', function (data) {
    // socket.emit('server-to-client', { server: data.message }); //คือการส่งหาคน คนนั้นคนเดียว
    console.log(data);
    io.emit('server-to-client', {
      type: 'user',
      username: data.username,
      message: data.message
    }); // คือการ Board Cast ทุกคนที่อยู่ใน Socket ตัวนี้
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
