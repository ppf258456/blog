// socketService.js
module.exports = function(io) {
    io.on('connection', (socket) => {
      console.log('a user connected');
      
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
  
      // 监听和处理其他事件
      socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
      });
    });
    return {
        emitToUser: (user_id, event, message) => {
            // 假设每个用户连接时都有一个唯一的socket id
            const socket = io.sockets.connected[user_id];
            if (socket) {
              socket.emit(event, message);
            }
          }
    }

  };
  