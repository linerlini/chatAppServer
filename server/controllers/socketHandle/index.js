const { wsEvent } = require('../../../config');
const store = require('../../../store');
const {chatTBConnect, recordMessage} = require('../../../dataBaseInit/modules/chat');

const eventHandleMap = new Map();
function pingpongHandle({data, ws}) {
    console.log('pingpong')
    ws.send(JSON.stringify({
        type: wsEvent.PING_PONG,
        data: 'pong',
    }));
}
async function privateChatHandle({data, ws}) {
    const { fromAccount, toAccount, message, device } = data;
    console.log(`${fromAccount}给${toAccount} send ${message}`);
    const timeNow = new Date();
    // 如果对方在线就发送信息
    if (store.hasUserConnect(toAccount)) {
        const toWSArr = store.getUserConnect(toAccount);
        toWSArr.forEach((ws) => {
            ws.send(JSON.stringify({
                type: wsEvent.PRIVATE_CHAT_RECEIVE,
                data: {
                    fromAccount,
                    message,
                    receiveTime: timeNow,
                },
            }));
        });
    }
    // 如果fromAccount在其他设备上也登陆了，就同步
    const otherDeviceWs = store.getUserConnect(fromAccount, device ? 0 : 1);
    if (otherDeviceWs) {
        otherDeviceWs.send(JSON.stringify({
            type: wsEvent.PRIVATE_CHAT_SEND_OTHER_DEVICE,
            data: {
                toAccount,
                message,
                sendTime: timeNow,
            },
        }));
    }
    // 保存消息记录到数据库
    try {
        const fromAccountChatTBPromise = chatTBConnect(fromAccount+'');
        const toAccountChatTBPromise = chatTBConnect(toAccount+'');
        const [fromAccountChatTB, toAccountChatTB] = await Promise.all([fromAccountChatTBPromise, toAccountChatTBPromise]);
        const [r1, r2] = await Promise.all([
            recordMessage(toAccount, message, 0, toAccountChatTB, timeNow),
            recordMessage(fromAccount, message, 1, fromAccountChatTB, timeNow),
        ]);
        ws.send(JSON.stringify({
            type: wsEvent.PRIVATE_CHAT_SEND_RESPONSE,
            data: true,
        }));
    } catch (err) {
        console.log('****** socket err');
        console.log(err);
        ws.send(JSON.stringify({
            type: wsEvent.PRIVATE_CHAT_SEND_RESPONSE,
            data: false,
        }));
    }
}

eventHandleMap.set(wsEvent.PING_PONG, pingpongHandle);
eventHandleMap.set(wsEvent.PRIVATE_CHAT_SEND, privateChatHandle);

exports.eventHandleMap = eventHandleMap;
