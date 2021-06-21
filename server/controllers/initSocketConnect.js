const userConnectRecord = require('../../store/index');

module.exports = function(socket) {
  const { account, device, friendsAccount = [] } = socket.handshake.query;
  const { io } = global;
  const onlineFriend = [];
  // 断开相同平台的其他登录
  const otherSocketID = userConnectRecord.getUserConnect(account, device);
  if (otherSocketID) {
    console.log(io.of("/").adapter.rooms);
    io.in(otherSocketID).disconnectSockets(true);
    userConnectRecord.deleteUserConnect(account, device);
  }
  userConnectRecord.addUserConnect(account, socket.id, device);
  socket.join(account);
  socket.to(account).emit('login-in-other-device', device);
  // 上线通知好友
  friendsAccount.forEach(friendAccount => {
    if (userConnectRecord.hasUserConnect(friendAccount)) {
      onlineFriend.push(friendAccount);
      io.to(friendAccount).emit('friend-login', account);
    }
  });
  // 发送已经在线的好友名单
  socket.emit('islogined-friend', onlineFriend);
};
