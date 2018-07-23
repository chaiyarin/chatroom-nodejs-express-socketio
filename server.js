var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/chat-room', (req, res) => {
  res.render(__dirname + '/chat-room', { data: req.body })
})

app.get('/chat-room', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

var memberList = new Array();

io.on('connection', function (socket) {
  const _id = socket.id;
  memberList.push({
    key: _id,
    value: socket.handshake.query.username
  });

  socket.broadcast.emit('server-to-client', {
    type: 'user',
    username: socket.handshake.query.username,
    message: 'ฉันเข้ามาแล้วนะคะ'
  });

  socket.on('disconnect', function () {
    Object.keys(memberList).forEach(function (index) {
      // do something with obj[key]
      if(memberList[index].key == _id){
        console.log('คนที่ออกคือ : ' + memberList[index].value);
        socket.broadcast.emit('server-to-client', {
          type: 'user',
          username: memberList[index].value,
          message: 'ฉันออกแล้วนะ'
        });
      }
    });
    console.log('disconnected : ' + _id);
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
var port = process.env.PORT || 3000;
http.listen(port, function () {
  console.log('listening on *:3000');
});
