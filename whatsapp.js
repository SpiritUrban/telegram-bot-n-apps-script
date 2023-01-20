/*
Що потрібно розуміти:
    * Токен (у режимі розробки) протухає за добу
    * Хук прописується в адмінці фейсбуку (https://developers.facebook.com/apps/)
    * Щоб підтвердити хук - потрібно хитро відповісти (res.send(req.query['hub.challenge']))
    * Не можливо відправити довільне повідомлення першим. Лише після відповіді юзера. Відправляєм шаблонне (формується в адмінці)
    * Пермішенси відразу в адмінці потрібно мабуть відкрити (клацнути всі)
*/


//
// DEV
//
const server = 'my-pc'
const log = (server == 'my-pc') ? console.log : (msg) => sendMessage(me, [...args].concat());

import express from 'express';
import qs from 'qs';
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
    res.send('The API of WhatsApp Bot')
})

const admin = '380967465486'

function messageReaction(msg) {
    const { from, id, timestamp, text, type } = msg;
    const theMessage = text?.body;
    log('4)----theMessage--->', theMessage);

    // sendMessage(from, theMessage, keyboard)
    if (theMessage == '1') sendMessage(from, theMessage, keyboard.basic)
    else if (theMessage == '2') sendMessage(from, theMessage, keyboard.second)
    else if (theMessage == '3') sendMessageButtonsList(from, theMessage)
    else sendMessage(from, theMessage);

    // from: '380967465486',
    // id: 'wamid.HBgMMzgwOTY3NDY1NDg2FQIAEhgUM0VCMDE0MzRDMzk4Q0Q4RkNBNzcA',
    // timestamp: '1673686367',
    // text: { body: 'lol!!!!' },
    // type: 'text'
}

function interactiveReaction(msg) {
    const { from, id, timestamp, type, interactive } = msg;
    // { type: 'button_reply', button_reply: { id: 'b2', title: 'Bbb 2' } }

    if (interactive.type == 'button_reply') {
        const { id, title } = interactive.button_reply;
        log('|');
        log(`[${title}]`);
        log('|');

    }


}

app.post('/api/web-hook', (req, res) => {
    try {
        log('\n HOOK', req.body);

        const entry = req.body.entry;
        entry.forEach((oneEntry, i) => {
            log('1)----the oneEntry--' + i, oneEntry);
            oneEntry.changes.forEach((change, ii) => {
                log('2)----the one change--' + ii, change);

                // log('----the one change STATUSES', change.value.statuses);

                // if (!change.value.messages) return log('Reject!!! This is no message!!!')

                //msg
                if (change.value.messages) {
                    change.value.messages.forEach((msg, iii) => {
                        log('3)----the one message--' + iii, msg);
                        if (msg?.text) messageReaction(msg)
                        if (msg?.interactive) interactiveReaction(msg)
                    })
                } else log('Something else !!!');

            })
        })
        res.send('qwerty');

    } catch (error) {
        sendMessage(admin, error)
    }
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
// const token = '5908656306:AAGGTAJXnPqmBsxO6SrlZhYnq4LBgSTQewM'
const token = 'EAAMVeXYpmN4BAKyZCuJgZBgjWaxYqd3wfZCC4nlTgRE0zsGkHUcylgcA1einHq9twq5sBJG24YLRHo3mCTviIoumXAZBxUIME7rvnPnCU7jPh7oJIfh6JBWZCcJKHILnLKU47ANrmeORZAU5qdefSwapbex8EuZBbaghw60GVf85qabvCAYFTsSRyUT1hyJfGDioQYk9ROrBAZDZD'



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
*  ------------------------------------------- Keyboards ------------------------------------------- 
*/
const keyboard = {
    /**
    * Basic
    */
    basic: [
        {
            "type": "reply",
            "reply": {
                "id": "b1",
                "title": "Bbbb 1"
            }
        },
        {
            "type": "reply",
            "reply": {
                "id": "b2",
                "title": "Bbb 2"
            }
        }
    ],
    /**
    * Some
    */
    second: [
        {
            "type": "reply",
            "reply": {
                "id": "s1",
                "title": "Ssss 1"
            }
        }
    ]
}


/**
* Send message
*/
async function sendMessage(phone, text, keyboard) {
    const response = keyboard ? await sendMessageButtons(phone, text, keyboard) : sendMessageOnly(phone, text)
    log(response.data);
    return response
    // return query(data);
}

/**
* Send message
*/
async function sendMessageOnly(phone, text) {
    let data = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": "380967465486",
        "type": "text",
        "text": {
            "preview_url": false,
            "body": "Echo:" + text
        }
    };
    return queryNode(data);
    // return query(data);
}

/**
* Send message
*/
async function sendMessageButtons(phone, text, keyboard) {
    const data = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": "380967465486",
        "type": "interactive",
        "interactive": {
            "type": "button",
            "body": {
                "text": "Echo:" + text
            },
            "action": {
                "buttons": keyboard
            }
        }
    };
    return queryNode(data);
    // return query(data);
}

/**
* Send message
*/
async function sendMessageButtonsList(phone, text, keyboard) {

    const data = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": "380967465486",
        "type": "interactive",
        "interactive": {
            "type": "list",
            "header": {
                "type": "text",
                "text": "HEADER_TEXT"
            },
            "body": {
                "text": "BODY_TEXT"
            },
            "footer": {
                "text": "FOOTER_TEXT"
            },
            "action": {
                "button": "BUTTON_TEXT",
                "sections": [
                    {
                        "title": "SECTION_1_TITLE",
                        "rows": [
                            {
                                "id": "SECTION_1_ROW_1_ID",
                                "title": "SECTION_1_ROW_1_TITLE",
                                "description": "SECTION_1_ROW_1_DESCRIPTION"
                            },
                            {
                                "id": "SECTION_1_ROW_2_ID",
                                "title": "SECTION_1_ROW_2_TITLE",
                                "description": "SECTION_1_ROW_2_DESCRIPTION"
                            }
                        ]
                    },
                    {
                        "title": "SECTION_2_TITLE",
                        "rows": [
                            {
                                "id": "SECTION_2_ROW_1_ID",
                                "title": "SECTION_2_ROW_1_TITLE",
                                "description": "SECTION_2_ROW_1_DESCRIPTION"
                            },
                            {
                                "id": "SECTION_2_ROW_2_ID",
                                "title": "SECTION_2_ROW_2_TITLE",
                                "description": "SECTION_2_ROW_2_DESCRIPTION"
                            }
                        ]
                    }
                ]
            }
        }
    }
    return queryNode(data);
    // return query(data);
}


/**
 * Request to Telegram
 */
function query(data) {
    return JSON.parse(UrlFetchApp.fetch(apiUrl + token + "/", data).getContentText());
}

function queryNode(data) {
    const url = 'https://graph.facebook.com/v15.0/113203361661968/messages';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + token
        },
        data: qs.stringify(data),
        url,
    };
    return axios(options);
}






