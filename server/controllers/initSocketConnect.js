const store = require('../../store');
const { eventHandleMap } = require('./socketHandle');

function initSocketConnect(account, device, ws) {
    const oldWs = store.getUserConnect(account, device);
    // 清除相同设备其他登陆
    if (oldWs) {
        oldWs.send(JSON.stringify({
            type: 'OTHER_DEVICE_LOGIN',
        }));
        oldWs.close();
        store.deleteUserConnect(account, device);
    }
    console.log(device);
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
    store.addUserConnect(account, ws, device);
}
exports.initSocketConnect = initSocketConnect;
