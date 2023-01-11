const log = console.log

/**
 * Common
 */
const apiUrl = "https://api.telegram.org/bot"  // Telegram API url
const webUrl = 'https://script.google.com/macros/s/AKfycbzqo6dYrA9dR40foCwnd5PtdHL869uryn7pPBQSIPdfCZIC97_9remSeJEEezWkwe_1IA/exec' // url to this Google Apps Script

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
  // sendMessage('the get hook !')
  return ContentService.createTextOutput(JSON.stringify(e))
}

/**
*  ------------------------------------------- webHook ------------------------------------------- 
*/

function webHook(contents) {
  const sender = contents?.message?.from?.id
  const msg = contents?.message?.text.toString().trim() // ..................................................... take msg and remove spaces
  logBot('ID: ' + sender + ' say ' + text)
  const isCommand = msg.charAt(0) == '/'
  if (!isCommand) return sendMessage(sender, "I do not understand this command! Do you wont get help?.") // .... if mo command
  const command = msg.substring(1, msg.length) // .............................................................. example: '/start'
  commands[command]() // ....................................................................................... start the command
}

/**
*  ------------------------------------------- Commands ------------------------------------------- 
*/

const commands = {
  start: () => sendMessage(sender, "Hello! Let's get started. Choose an action.", keyboard.example)
}

/**
*  ------------------------------------------- Keyboards ------------------------------------------- 
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






