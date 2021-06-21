const databaseOptions = {
  dialect: 'mysql',
  host: '119.29.189.246',
  database: 'mychat',
  username: 'root',
  password: 'lkk200033',
};
// 用于jwt验证
const SECRET = 'lkk200033';
const jwtTimeout = 1800;
exports.databaseOptions = databaseOptions;
exports.SECRET = SECRET;
exports.JWTTIMEOUT = jwtTimeout;
