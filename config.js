const databaseOptions = {
  dialect: 'mysql',
  host: 'localhost',
  database: 'mychat',
  username: 'root',
  password: 'root123',
  // retry: {
  //   match: [
  //       /ETIMEDOUT/,
  //       /EHOSTUNREACH/,
  //       /ECONNRESET/,
  //       /ECONNREFUSED/,
  //       /ETIMEDOUT/,
  //       /ESOCKETTIMEDOUT/,
  //       /EHOSTUNREACH/,
  //       /EPIPE/,
  //       /EAI_AGAIN/,
  //       /SequelizeConnectionError/,
  //       /SequelizeConnectionRefusedError/,
  //       /SequelizeHostNotFoundError/,
  //       /SequelizeHostNotReachableError/,
  //       /SequelizeInvalidConnectionError/,
  //       /SequelizeConnectionTimedOutError/
  //   ],
  //   max: 5
  // },
};
// 用于jwt验证
const SECRET = 'lkk200033';
const jwtTimeout = 1800;

exports.databaseOptions = databaseOptions;
exports.SECRET = SECRET;
exports.JWTTIMEOUT = jwtTimeout;
