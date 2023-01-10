const log = console.log

const webUrl = 'https://script.google.com/macros/s/AKfycbxE_fugIp6MjT9NXNuxKFuk4wsTfPtA87QikXx-BXtHuxnWBBtzyFSOB2-pcY2PhTP8xw/exec' // url to this Google Apps Script
const token = '5974247189:AAF5e4ArjN99brcD7bkZ8_a-MQsd8TszRJU'
const chat = '-836748512'
const me = '428521383'
const botAdmin = 428521383
const botAdmin2 = 382627421
const sheet = "1bYc4jHUYz0qQGal05ugFmIUO2xiD1JpbYZ24ru2bSFo"              // Google Sheet id 
const userNameBot = "......FeedBackBot"                                   // username вашего бота
const apiUrl = "https://api.telegram.org/bot"                             // Telegram API url


function testMessage() {
  let response = UrlFetchApp.fetch(config.apiUrl + config.token + "/sendMessage&text=test");
  console.log(response.getContentText());
}

function getMe() {
  let response = UrlFetchApp.fetch(config.apiUrl + config.token + "/getMe");
  console.log(response.getContentText());
}

function getWebHookInfo() {
  let response = UrlFetchApp.fetch(config.apiUrl + config.token + "/getWebHookInfo");
  console.log(response.getContentText());
}

function setWebHook() {
  let response = UrlFetchApp.fetch(config.apiUrl + config.token + "/setWebHook?url=" + config.webUrl);
  console.log(response.getContentText());
}


/**
 * Receiving of Post request
 */
function doPost(request) {
  // sendMessage('the post hook ! ' + request.postData.contents)
  const contents = JSON.parse(request.postData.contents);
  webHook(contents)
  // new WebHook(contents);
  return ContentService.createTextOutput(JSON.stringify(request))
}

/**
 * Receiving of Get request
 */
const doGet = (e) => {
  sendMessage('the get hook !')
  return ContentService.createTextOutput(JSON.stringify(e))
}

// ------------------------------------------------------------------------------------------------------

const webHook = (contents) => {
  // sendMessage(me, ':::: log :::::webHook contents : ' + JSON.stringify(contents), keyboard.example)
  const sender = contents.from.id
  if (contents.text == '/start') sendMessage(sender, "Hello! Let's get started. Choose an action.", keyboard.example)
  else sendMessage(sender, "I do not understand this command! Do you wont get help?.")

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
      reply_markup: JSON.stringify(keyboard)
    }
  }
  return this.query(data);
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
  return this.query(data);
}

/**
 * Request to Telegram
 */
function query(data) {
  return JSON.parse(UrlFetchApp.fetch(config.apiUrl + this.token + "/", data).getContentText());
}





