const { createChatTable } = require('../../dataBaseInit/modules/chat');
const userConnectRecord = require('../../store/index');

async function receivePrivateMessage({
  from,
  to,
  message,
  socket,
}) {
  const currentTime = Date.now();
  // 向在其他设备登录的账号发送这条信息
  socket.to(from).emit('send-message', message, time, from , to);
  // 向接收方发送信息
  const { io } = global;
  io.to(to).emit('receive-message', message, time, from, to);
  // 数据库存储信息记录
  const [ fromChatTB, toChatTB ] = await Promise.all([createChatTable(from), createChatTable(to)]);
  fromChatTB.create({
    friendaccount: to,
    word: message,
    isSend: 1,
  });
  toChatTB.create({
    friendaccount: from,
    word: message,
    isSend: 0,
  });
}
/*
  发送信息后，存到数据库中，再判断对方是否在线，如果在线就发送这条信息，否则不发送。
*/