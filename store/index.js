const userConnect = new Map();

function addUserConnect(account, socket, device) {
  const key = `${account}:${device}`;
  deleteUserConnect(account, device);
  userConnect.set(key, socket);
}
function deleteUserConnect(account, device) {
  const key = `${account}:${device}`;
  if (userConnect.has(key)) {
    userConnect.delete(key);
  }
}
function getUserConnect(account, device = -1) {
  if (device === -1) {
    const wsArr = [];
    const phoneWS = getUserConnect(account, 0);
    const pcWS = getUserConnect(account, 1);
    if (pcWS) {
      wsArr.push(pcWS);
    }
    if (phoneWS) {
      wsArr.push(phoneWS);
    }
    return wsArr;
  }
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
