const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../index');

const data = {
  friendaccount: {
    type: DataTypes.INTEGER,
  },
  word: {
    type: DataTypes.STRING,
  },
  isSend: {
    type: DataTypes.INTEGER,
  },
};

async function createChatTable(account) {
  class Chat extends Model {};
  Chat.init(data, {
    sequelize,
    createdAt: 'datetime',
    updatedAt: false,
    tableName: `${account}chat`,
  });
  await Chat.sync();
  console.log(`${account}聊天表关联`);
  return Chat;
}

function recordMessage(account, message, isSend, tb) {
  tb.create({
    friendaccount: account,
    word: message,
    isSend,
  });
}

module.exports.chatTBConnect = createChatTable;
exports.recordMessage = recordMessage;
