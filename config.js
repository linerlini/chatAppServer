const databaseOptions = {
  dialect: 'mysql',
  host: 'localhost',
  database: 'mychat',
  username: 'root',
  password: 'root123',
};
// 用于jwt验证
const SECRET = 'lkk200033';
const jwtTimeout = 1800;
// socket事件
const wsEvent = {
  PING_PONG: 'pingpong',
  PRIVATE_CHAT_RECEIVE: 'PRIVATE_CHAT_RECEIVE',
  PRIVATE_CHAT_SEND_OTHER_DEVICE: 'PRIVATE_CHAT_SEND_OTHER_DEVICE',
  PRIVATE_CHAT_SEND: 'PRIVATE_CHAT_SEND',
  PRIVATE_CHAT_SEND_RESPONSE: 'PRIVATE_CHAT_SEND_RESPONSE',
};

exports.databaseOptions = databaseOptions;
exports.SECRET = SECRET;
exports.JWTTIMEOUT = jwtTimeout;
exports.wsEvent = wsEvent;
