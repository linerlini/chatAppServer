const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../index');

const tableObj = {
  friendsaccount: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  friendsname: {
    type: DataTypes.STRING,
  },
  friendsgroup: {
    type: DataTypes.INTEGER,
    defaultValue: -1,
  },
  lastword: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  notacceptwordcount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  accept: {
    type: DataTypes.INTEGER,
  },
  signature: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
};

async function friendTable(account) {
  class Friend extends Model {};
  Friend.init(tableObj, {
    tableName: account,
    timestamps: false,
    sequelize,
  });
  await Friend.sync();
  console.log(`${account}朋友表关联`);
  return Friend;
}

exports.friendTable = friendTable;
