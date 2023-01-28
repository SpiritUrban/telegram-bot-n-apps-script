const log = console.log

/**
 * Common
 */
const apiUrl = "https://api.telegram.org/bot"  // Telegram API url
const webUrl = 'https://script.google.com/macros/s/AKfycbzQ_XfYxriLymQUYMCqSWFqVtIYIK8BmKFzf3oNYSUOi8poxJeR5WDHIDze8WV_NMNh8Q/exec' // url to this Google Apps Script

/**
 * GUBUS GASH Bot
 */
const token = '5974247189:AAF5e4ArjN99brcD7bkZ8_a-MQsd8TszRJU'
const chat = '-836748512'
const sheet = "1bYc4jHUYz0qQGal05ugFmIUO2xiD1JpbYZ24ru2bSFo"              // Google Sheet id 

/**
 * QuuuuuuuuuuuuuBot - Q Bot
 */
// const token = '5908656306:AAGGTAJXnPqmBsxO6SrlZhYnq4LBgSTQewM'


/**
 * Persones
 */
const admin = 428521383
const admin2 = 382627421

/**
*  ------------------------------------------- Tools ------------------------------------------- 
*/

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

function setWebHook() {
  let response = UrlFetchApp.fetch(apiUrl + token + "/setWebHook?url=" + webUrl);
  console.log(response.getContentText());
}

/**
*  ------------------------------------------- Router ------------------------------------------- 
*/

/**
 * Receiving of Post request
 */
function doPost(request) {
  try {
    const contents = JSON.parse(request.postData.contents);
    webHook(contents);
  } catch (err) {
    sendMessage(admin, 'ERR in doPost() ' + JSON.stringify(err), keyboard.example)
  } finally {
    return HtmlService.createHtmlOutput();
  }
}

/**
 * Receiving of Get request
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify(e))
}

/**
*  ------------------------------------------- webHook ------------------------------------------- 
*/

function webHook(contents) {
  // logBot('WTF' + JSON.stringify(contents) ) // Important to somtimes on
  const isMsg = !!contents.message
  const isButton = !!contents.callback_query
  const sender = (isMsg) ? contents?.message?.from?.id : contents?.callback_query?.from?.id 
  const msg = (isMsg) ? contents?.message?.text.toString().trim() : contents?.callback_query?.data // ............... take msg and remove spaces
  logBot('Log >>> ID: ' + sender + ' say ' + msg)
  const isCommand = msg.charAt(0) == '/'
  if (!isCommand) return sendMessage(sender, "I understand only commands yet!", keyboard.basic) // ................... if mo command
  const command = msg.substring(1, msg.length) // .................................................................... example: '/start'
  if (commands[command]) commands[command](sender) // ................................................................ start the command
  else return sendMessage(sender, "I do not understand this command! Do you wont get help?.", keyboard.basic)
}

/**
*  ------------------------------------------- Messages ------------------------------------------- 
*/
const helpMsg = `
  <b>A lot of help:</b>
  <a href="https://core.telegram.org/bots/api">The main/oficial Telegram API</a>
  <a href="https://dou.ua/forums/topic/30653/">DOU about Telegram and Google Apps Script</a>
  <a href="https://core.telegram.org/bots">About Telegram with pictures</a>
  <a href="https://telegram-bot-sdk.readme.io/reference/removewebhook">Perfect examples and Telegram documentation</a>
`

/**
*  ------------------------------------------- Commands ------------------------------------------- 
*/
const commands = {
  start: (to) => sendMessage(to, "Hello! Let's get started. Choose an action.", keyboard.basic),
  help: (to) => sendMessage(to, helpMsg, keyboard.chats),
}

/**
*  ------------------------------------------- Keyboards ------------------------------------------- 
*/
const keyboard = {
  /**
  * Basic
  */
  basic: {
    inline_keyboard: [
      [{
        text: 'Start',
        callback_data: '/start'
      }, {
        text: 'Help',
        callback_data: '/help'
      }],
    ]
  },
  /**
  * Chats
  */
  chats: {
    inline_keyboard: [
      [{
        text: 'Dev',
        switch_inline_query: 'DevChat'
      }, {
        text: 'Heap',
        switch_inline_query: 'HeapDraft'
      }]
    ]
  }
}

/**
*  ------------------------------------------- Lib ------------------------------------------- 
*/

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

function logBot(msg) {
  sendMessage(admin, msg)
}






