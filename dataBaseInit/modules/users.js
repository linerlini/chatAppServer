const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../index');

class User extends Model {
};

User.init({
  account: {
    type: DataTypes.INTEGER(15),
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  word: {
    type: DataTypes.STRING(255),
  },
  groupCount: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
  },
  group1: {
    type: DataTypes.STRING,
    defaultValue: '我的好友',
  },
  group2: {
    type: DataTypes.STRING,
    defaultValue: '我的家人',
  },
  group3: {
    type: DataTypes.STRING,
    defaultValue: '我的同学',
  },
  group4: {
    type: DataTypes.STRING,
    defaultValue: '我的同事',
  },
  group5: {
    type: DataTypes.STRING,
    defaultValue: '黑名单',
  },
}, {
  tableName: 'user',
  sequelize,
  modelName: 'User',
  timestamps: false,
});

User.sync();
console.log('user表关联');

exports.User = User;
