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
  OTHER_DEVICE_LOGIN: 'OTHER_DEVICE_LOGIN',
  LOGIN_IN_PHONE_PC: 'LOGIN_IN_PHONE_PC',
  FRIEND_ONLINE: 'FRIEND_ONLINE',
  FRIEND_OFFLINE: 'FRIEND_OFFLINE',
  RECEIVE_FRIEND_APPLY: 'RECEIVE_FRIEND_APPLY',
  RECEIVE_FRIEND_APPLY_RESULT: 'RECEIVE_FRIEND_APPLY_RESULT',
};

exports.databaseOptions = databaseOptions;
exports.SECRET = SECRET;
exports.JWTTIMEOUT = jwtTimeout;
exports.wsEvent = wsEvent;
