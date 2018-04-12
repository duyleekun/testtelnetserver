var net = require('net');
const PROMPT = 'PPSVNM33P,>';
let sessionId = 1000;

var server = net.createServer(function (socket) {
  // socket.setEncoding('binary');
  socket.setNoDelay(true);
  sessionId++;
  console.log('new socket', sessionId)
  socket.write('login: ');
  let buffer = '';
  let stage = 0;
  socket.on('data', function(data) {

    buffer = buffer.concat(data)
    console.log(data);
    if (data.equals(Buffer.from([0xff,0xf6]))) {
      console.log("AYT")
      buffer = '';
      socket.write('AYTBACK\n')
    } else {
      if (buffer.indexOf("\n") >= 0) {
        switch (stage) {
          case 0:
          socket.write('INPwd: ');
          break;

          case 1:
          socket.write((sessionId).toString()+'\n')
          socket.write(PROMPT)
          break;

          default:
          if (stage > 5) {
            console.log("drop on purpose")
          } else {
            socket.write('Some bull shit for'.concat(buffer).concat('\n'))
            socket.write(PROMPT)
          }
        }
        buffer = '';
        stage++;
      }
    }

  })
}).listen(23);
