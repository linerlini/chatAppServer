const { User } = require('../../dataBaseInit/modules/users');
const { friendTable } = require('../../dataBaseInit/modules/friends');
const FriendInfo = require('../models/friendInfo');
const jwt = require('../utils/jwt');
const store = require('../../store');

async function loginHandle(account, password) {
  const result = await getUserInfo({account, password});
  if (!result) {
    return false;
  }
  // 生成token
  const token = jwt.sign({
    data: account,
  });
  // 获取个人好友和聊天信息
  const {
    groups,
    applyRecords,
  } = await getUserFirendAndChat(account);
  return {
    token,
    applyRecords,
    groups,
    ...result,
  };
}

async function loginRefreshHandle(token) {
  try {
    const result = await jwt.verify(token);
    const userInfo = await getUserInfo({
      account: result.data,
      isRefresh: true,
    });
    const newToken = jwt.sign({
      data: userInfo.account,
    });
    const {
      groups,
      applyRecords,
    } = await getUserFirendAndChat(userInfo.account);
    return {
      token: newToken,
      groups,
      applyRecords,
      ...userInfo,
    };
  } catch (err) {
    if (err === jwt.TOKEN_INVALID) {
      return Promise.reject('token无效');
    }
    return Promise.reject('token过期');
  }
}

function refreshJWT(account) {
  const token = jwt.sign({
    data: account,
  });
  return token;
}

async function getUserFirendAndChat(account) {
  account = account.toString();
  const friendTB = await friendTable(account);
  const friends = await friendTB.findAll();
  const groups = Array.from({ length: 5 }, () => []);
  const applyRecords = [];
  friends.forEach((item) => {
    const { dataValues } = item; 
    const {
      friendsaccount: account,
      friendsname: name,
      friendsgroup: groupIndex,
      lastword,
      notAcceptWordCount,
      accept,
      signature,
    } = dataValues;
    // 添加到申请好友列表
    if (accept !== 1) {
      applyRecords.push(new FriendInfo({
        account,
        name,
        signature,
        relationship: accept,
      }));
    } else { 
      let loginStatus = 0;
      if (store.hasUserConnect(account)) {
        loginStatus = 1
      }
      groups[groupIndex - 1].push(new FriendInfo({
        account,
        name,
        lastword,
        notAcceptWordCount,
        signature,
        groupIndex,
        loginStatus,
      }));
    }
  });
  return {
    groups,
    applyRecords,
  };
}

async function getUserInfo({account, password, isRefresh}) {
  let result;
  if (!isRefresh) {
    if (!password) {
      return false;
    }
    result = await User.findAll({
      where: {
        account,
        password,
      },
    });
  } else {
    result = await User.findAll({
      where: {
        account,
      },
    });
  }
  if (result.length === 0) {
    return false;
  }
  result = result[0].dataValues;
  const {
    name,
    word,
  } = result;
  const groupNames = new Array(5).fill('');
  [...new Array(5).keys()].forEach((item) => {
    groupNames[item] = result[`group${item + 1}`] || '';
  });
  return {
    account,
    name,
    word,
    groupNames,
  };
}

module.exports = {
  loginHandle,
  loginRefreshHandle,
  refreshJWT,
};
