const { User } = require('../../dataBaseInit/modules/users');
const { chatTBConnect } = require('../../dataBaseInit/modules/chat');
const { friendTable } = require('../../dataBaseInit/modules/friends');
const jwt = require('../utils/jwt');

async function registerHandle({account, password, name}) {
  const accountAlreadyExist = await User.findAll({
    where: {
      account,
    },
  });
  if (accountAlreadyExist.length !== 0) {
    return false;
  }
  await User.create({
    account,
    password,
    name,
    word: '这个人很懒,什么都没留下',
  });
  chatTBConnect(account);
  friendTable(account);
  const friends = Array.from({ length: 5 }, () => []); 
  const token = jwt.sign({
    data: account,
  });
  return {
    token,
    groups: friends,
    groupNames: ['我的好友', '我的家人', '我的同学', '我的同事', '黑名单',],
    applyRecords: [],
    word: 'hello world',
  };
}

module.exports = registerHandle;
