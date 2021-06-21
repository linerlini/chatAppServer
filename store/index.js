const userConnect = new Map();

function addUserConnect(account, socketId, device) {
  const key = `${account}:${device}`;
  deleteUserConnect(account, device);
  userConnect.set(key, socketId);
}
function deleteUserConnect(account, device) {
  const key = `${account}:${device}`;
  if (userConnect.has(key)) {
    userConnect.delete(key);
  }
}
function getUserConnect(account, device) {
  return userConnect.get(`${account}:${device}`);
}
function hasUserConnect(account) {
  return getUserConnect(account, 0) || getUserConnect(account, 1);
}

module.exports = {
  addUserConnect,
  deleteUserConnect,
  getUserConnect,
  hasUserConnect,
};
