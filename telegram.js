const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '716173730:AAFGzthDnzDSPKpi4fDk4X-97Z6zKhv-n9E';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {
    polling: true
});

const dataEndlessTower = require('./scraping')

const groupBy = (list, keyGetter) => {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

const getSearch = (res, resp) => {
    const grouped = groupBy(res, r => r.name);
    const rs = grouped.get(resp);
    return JSON.stringify(rs);
}

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1].trim().toUpperCase(); // the captured "whatever"

    let data = async () => {
        let rs = await dataEndlessTower.scraping()
        return rs
    }

    data().then((result) => {
        const arr = getSearch(result,resp)
        if (arr) bot.sendMessage(chatId, arr);
        else bot.sendMessage(chatId, "No Result");
    });

});