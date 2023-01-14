//
// DEV
//
const server = 'my-pc'
const log = (server == 'my-pc') ? console.log : (msg) => sendMessage(me, msg);

import express from 'express';
import axios, { isCancel, AxiosError } from 'axios';
const app = express()
const port = 3005

// parsers
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: '11111111mb' }));
app.use(bodyParser.json({ limit: '11111111mb' }));

app.get('/', (req, res) => {
    res.send('qwerty')
})

app.post('/api/web-hook', (req, res) => {

    console.log('HOOK', req.body)

    const entry = req.body.entry;
    entry.forEach(msg => {
        log('----the one message', msg)
        msg.changes.forEach( change => {
            log('----the one change', change)
            change.value.messages.forEach( msg => {
                log('----the one message', msg)
                const {from, id, timestamp, text, type} = msg;
                const theMessage =text.body;
                log( 'theMessage--->', theMessage)

                // from: '380967465486',
                // id: 'wamid.HBgMMzgwOTY3NDY1NDg2FQIAEhgUM0VCMDE0MzRDMzk4Q0Q4RkNBNzcA',
                // timestamp: '1673686367',
                // text: { body: 'lol!!!!' },
                // type: 'text'

                
            })
        })
    })
    res.send('qwerty')
})

app.get('*', (req, res) => {
    console.log('ANY', req.query, req.query['hub.challenge'])


    res.send(req.query['hub.challenge'])
})

app.listen(port, () => {
    console.log(`WhatsApp Bot listening on port ${port} !!!`)
})


const webUrl = 'https://134.249.153.7/api/web-hook';
// const token = '5974247189:AAF5e4ArjN99brcD7bkZ8_a-MQsd8TszRJU'

/**
 * GUBUS GASH Bot
 */
const chat = '-836748512'
const me = '428521383'
const botAdmin = 428521383
const botAdmin2 = 382627421
const sheet = "1bYc4jHUYz0qQGal05ugFmIUO2xiD1JpbYZ24ru2bSFo"              // Google Sheet id 
const userNameBot = "......FeedBackBot"                                   // Bot username  
const apiUrl = "https://api.telegram.org/bot"                             // Telegram API url


/**
 * QuuuuuuuuuuuuuBot - Q Bot
 */
const token = '5908656306:AAGGTAJXnPqmBsxO6SrlZhYnq4LBgSTQewM'


/**
 * resetBot - Very important! If the bot hangs!
 */
function resetBot() {
    let response = UrlFetchApp.fetch(apiUrl + token + "/setWebHook?remove");
    console.log(response.getContentText());
    let response2 = UrlFetchApp.fetch(apiUrl + token + "/getUpdates?offset=-1");
    console.log(response2.getContentText());
}

function testMessage() {
    let response = UrlFetchApp.fetch(apiUrl + token + "/sendMessage&text=test");
    console.log(response.getContentText());
}

function getMe() {
    let response = UrlFetchApp.fetch(apiUrl + token + "/getMe");
    console.log(response.getContentText());
}

function getWebHookInfo() {
    let response = UrlFetchApp.fetch(apiUrl + token + "/getWebHookInfo");
    console.log(response.getContentText());
}

async function setWebHook() {
    // let response = UrlFetchApp.fetch(apiUrl + token + "/setWebHook?url=" + webUrl);

    const answer = await axios.get(apiUrl + token + "/setWebHook?url=" + webUrl);
    console.log(answer);

    // console.log(response.getContentText());
}
setWebHook()



/**
 * Receiving of Post request
 */
function doPost(request) {
    try {
        // sendMessage(me, 'BEGIN2 ' + JSON.stringify(request), keyboard.example)
        const contents = JSON.parse(request.postData.contents);
        // sendMessage(me, '2')
        webHook(contents);
        // sendMessage(me, '3')
        return ContentService.createTextOutput(JSON.stringify(request))
    } catch (err) {
        sendMessage(me, 'ERR in doPost() ' + JSON.stringify(err), keyboard.example)
    }
}

/**
 * Receiving of Get request
 */
function doGet(e) {
    // sendMessage('the get hook !')
    return ContentService.createTextOutput(JSON.stringify(e))
}

// ------------------------------------------------------------------------------------------------------


function webHook(contents) {
    const sender = contents?.message?.from?.id
    const text = contents?.message?.text

    sendMessage(sender, 'WTF>>> ' + sender + 'say' + text)

    sendMessage(sender, 'WTF3>>> ' + JSON.stringify(contents))


    // sendMessage(sender, 'test <b>some</b>  xxx',)


    // if (text == '/start') sendMessage(sender, "Hello! Let's get started. Choose an action.", keyboard.example)
    // else sendMessage(sender, "I do not understand this command! Do you wont get help?.")
}


/**
* Keyboards
*/
const keyboard = {
    /**
    * Example
    */
    example: {
        inline_keyboard: [
            [{
                text: 'Super button!!!',
                callback_data: 'button-1'
            }, {
                text: 'Start',
                callback_data: '/start'
            }],
            [{
                text: 'Go to chat 2',
                switch_inline_query: 'chat-2'
            }, {
                text: 'Go to chat 3',
                switch_inline_query: 'chat-2'
            }]
        ]
    }
}

/**
* Send message
*/
function sendMessage(chat_id, text, keyboard) {
    let data = {
        method: "post",
        payload: {
            method: "sendMessage",
            chat_id: String(chat_id),
            text: text,
            parse_mode: "HTML",
            reply_markup: JSON.stringify(keyboard),
            // disable_web_page_preview: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm81XoZa9dFFAFPY-LjxgJ-XAj-KeySicSvw&usqp=CAU'
        }
    }
    return query(data);
}

/**
 * Send COPY of message
 */
function sendMessageCopy(to_id, from_id, message_id) {
    let data = {
        method: "post",
        payload: {
            method: "copyMessage",
            chat_id: String(to_id), // кому
            from_chat_id: String(from_id), // откуда
            message_id: message_id // что
        }
    }
    return query(data);
}

/**
 * Request to Telegram
 */
function query(data) {
    return JSON.parse(UrlFetchApp.fetch(apiUrl + token + "/", data).getContentText());
}





