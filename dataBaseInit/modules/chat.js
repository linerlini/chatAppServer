const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../index');

const data = {
  friendaccount: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  word: {
    type: DataTypes.STRING,
  },
  isSend: {
    type: DataTypes.INTEGER,
  },
  datetime: {
    type: DataTypes.DATE,
    primaryKey: true,
  },
  // uid: {
  //   type: DataTypes.UUIDV1,
  // },
};

async function createChatTable(account) {
  class Chat extends Model {};
  Chat.init(data, {
    sequelize,
    createdAt: false,
    updatedAt: false,
    tableName: `${account}chat`,
  });
  await Chat.sync();
  console.log(`${account}聊天表关联`);
  return Chat;
}

function recordMessage(account, message, isSend, tb, time) {
  return tb.create({
    friendaccount: account,
    word: message,
    isSend,
    datetime: time,
  });
}

module.exports.chatTBConnect = createChatTable;
exports.recordMessage = recordMessage;
