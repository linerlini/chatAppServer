const { Op } = require('sequelize');
const store = require('../../store');
const { eventHandleMap } = require('./socketHandle');
const { friendTable } = require('../../dataBaseInit/modules/friends');

function initSocketConnect(account, device, ws) {
    // // 增强ws
    // ws.userAccount = account;
    // ws.userDevice = device;    
    const oldWs = store.getUserConnect(account, device);
    // 清除相同设备其他登陆
    if (oldWs) {
        oldWs.send(JSON.stringify({
            type: 'OTHER_DEVICE_LOGIN',
        }));
        oldWs.close();
        store.deleteUserConnect(account, device);
    }
    // 通知其他设备，该账号在其他设备登陆
    const otherDeviceWs = store.getUserConnect(account, device ? 0 : 1);
    if (otherDeviceWs) {
        otherDeviceWs.send(JSON.stringify({
            type: 'LOGIN_IN_PHONE_PC',
        }));
    }
    // 添加事件处理
    ws.on('message', (req) => {
        const { type, data } = JSON.parse(req);
        const handle = eventHandleMap.get(type);
        if (handle) {
            handle({ ws, data });
        }
    });
    // 连接关闭处理
    ws.on('close', (code, reason) => {
        console.log('***********************');
        console.log(`${account} is close`);
        console.log(code, reason);
        console.log('***********************');
        const wsArr = store.getUserConnect(account);
        // 如果只有该设备在线，就通知好友，他离线了
        if (wsArr.length === 1) {
            friendTable(account+'')
            .then((tb) => {
                return tb.findAll({
                    where: {
                        accept: 1,
                    },
                    attributes: ['friendsaccount'],
                });
            })
            .then((res) => {
                res.forEach((item) => {
                    const { friendsaccount } = item.dataValues;
                    if (store.hasUserConnect(friendsaccount)) {
                        const wsArr = store.getUserConnect(friendsaccount);
                        wsArr.forEach((ws) => {
                            ws.send(JSON.stringify({
                                type: 'FRIEND_OFFLINE',
                                data: {
                                    account,
                                    device,
                                },
                            }));
                        });
                    }
                });
            })
            .catch((err) => {
                console.log(err);
            });
        }
        store.deleteUserConnect(account, device);
    })
    // 通知好友上线了
    friendTable(account+'')
        .then((tb) => {
            return tb.findAll({
                where: {
                    accept: 1,
                },
                attributes: ['friendsaccount'],
            });
        })
        .then((res) => {
            res.forEach((item) => {
                const { friendsaccount } = item.dataValues;
                if (store.hasUserConnect(friendsaccount)) {
                    const wsArr = store.getUserConnect(friendsaccount);
                    wsArr.forEach((ws) => {
                        ws.send(JSON.stringify({
                            type: 'FRIEND_ONLINE',
                            data: {
                                account,
                                device,
                            },
                        }));
                    });
                }
            });
        })
        .catch((err) => {
            console.log(err);
        });
    store.addUserConnect(account, ws, device);
}
exports.initSocketConnect = initSocketConnect;
