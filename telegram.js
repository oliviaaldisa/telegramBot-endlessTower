require('dotenv').config({path:__dirname+'/.env'}); 
const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {
    polling: true
});

const dataEndlessTower = require('./scraping')
const searching = require('./searching')

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
        const arr = searching(result,resp)
        if (arr) bot.sendMessage(chatId, arr);
        else bot.sendMessage(chatId, "No Result");
    });

});