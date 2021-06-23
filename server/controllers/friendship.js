const {friendTable} = require('../../dataBaseInit/modules/friends');
const store = require('../../store');
const { wsEvent } = require('../../config');

async function addFriend({ account, addAccount, name, addName, group, signature, friendSignature }) {
  try {
    const accountTBConnect = friendTable(account+'');
    const addAccountTBConnect = friendTable(addAccount+'');
    const [ userTB, addUserTB ] = await Promise.all([accountTBConnect, addAccountTBConnect]);
    const [ record1, record2 ] = await Promise.all([userTB.findOrCreate({
      where: {
        friendsaccount: addAccount,
      },
    }), addUserTB.findOrCreate({
      where: {
        friendsaccount: account,
      },
    })]);
    const user = record1[0];
    const addUser = record2[0];
    // 修改申请方的数据库记录
    user.friendsname = addName;
    user.friendsgroup = group;
    user.accept = -1;
    user.signature = friendSignature;
    // 修改被申请方的数据库记录
    addUser.friendsname = name;
    addUser.accept = 0;
    addUser.signature = signature;
    user.save();
    addUser.save();
    // 如果对方在线就通知他
    if (store.hasUserConnect(addAccount)) {
      const wsArr = store.getUserConnect(addAccount);
      wsArr.forEach((ws) => {
        ws.send(JSON.stringify({
          type: wsEvent.RECEIVE_FRIEND_APPLY,
          data: {
            fromAccount: account,
            fromName: name,
            fromSignature: signature,
          },
        }));
      });
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

// 接受或者拒绝好友申请，options里是接受的时候，附加信息。
async function acceptOrReject({ account, addAccount, type, options }) {
  const [accountTB, addAccountTB ] = await Promise.all([friendTable(account+''), friendTable(addAccount+'')])
  const userPro = accountTB.findOne({
    where: {
      friendsaccount: addAccount,
    },
  });
  const addUserPro = addAccountTB.findOne({
    where: {
      friendsaccount: account,
    },
  });
  const [user, addUser] = await Promise.all([userPro, addUserPro]);
  if (+type === 1) {
    // 接受
    user.accept = 1;
    addUser.accept = 1;
    user.friendsgroup = options.groupIndex;
  } else {
    // 拒绝
    user.accept = 2;
    addUser.accept = 3;
  }
  // 如果申请人在线就通知他
  if (store.hasUserConnect(addAccount)) {
    const wsArr = store.getUserConnect(addAccount);
    wsArr.forEach((ws) => {
      ws.send(JSON.stringify({
        type: wsEvent.RECEIVE_FRIEND_APPLY,
        data: {
          fromAccount: account,
        },
      }));
    });
  }  
  user.save();
  addUser.save();
}

exports.addFriend = addFriend;
exports.acceptOrReject = acceptOrReject;
