const log = console.log

const webUrl = 'https://script.google.com/macros/s/AKfycbwiieCo_Otp3hIfL-kRBrIeLTnwOq2Bf84YtvSp4vSelbUGyj03Z3Y588RUduhikOfU5Q/exec' // url to this Google Apps Script
// const webUrl ='https://script.google.com/macros/s/AKfycbzbZ0KIUzEfFZANXfwh2ivr5VeiWHnw3Vns3JsoIhpJ/dev'
const token = '5974247189:AAF5e4ArjN99brcD7bkZ8_a-MQsd8TszRJU'
const chat = '-836748512'
const me = '428521383'
const botAdmin = 428521383
const botAdmin2 = 382627421
const sheet = "1bYc4jHUYz0qQGal05ugFmIUO2xiD1JpbYZ24ru2bSFo"              // Google Sheet id 
const userNameBot = "......FeedBackBot"                                   // username вашего бота
const apiUrl = "https://api.telegram.org/bot"                             // Telegram API url


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
const doGet = (e) => {
  // sendMessage('the get hook !')
  return ContentService.createTextOutput(JSON.stringify(e))
}

// ------------------------------------------------------------------------------------------------------


const webHook = (contents) => {
  const sender = contents?.message?.from?.id
  const text = contents?.message?.text
  sendMessage(sender, 'WTF ' + sender, keyboard.example)

  sendMessage(sender, 'test <b>some</b>  xxx',)


  if (text == '/start') sendMessage(sender, "Hello! Let's get started. Choose an action.", keyboard.example)
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





