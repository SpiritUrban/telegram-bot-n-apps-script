/*
Що потрібно розуміти:
    * Токен (у режимі розробки) протухає за добу
    * Хук прописується в адмінці фейсбуку (https://developers.facebook.com/apps/)
    * Щоб підтвердити хук - потрібно хитро відповісти (res.send(req.query['hub.challenge']))
    * Не можливо відправити довільне повідомлення першим. Лише після відповіді юзера. Відправляєм шаблонне (формується в адмінці)
    * Пермішенси відразу в адмінці потрібно мабуть відкрити (клацнути всі)
*/

const log = console.log;
const admin = '380967465486'
const apiUrl = 'https://graph.facebook.com/v15.0/113203361661968/messages';
const WHATSAPP_ACCESS_TOKEN = 'EAAMVeXYpmN4BAJpPOHCqCfZBsGxkuUF1uTO1ahvHMfoS9szj6qzIE3ZAKMs8iLPpOffi2gNZAfDXbQgGPkFk5cD6Jz4yZBjzIWsLFJDlhPBiSVl8VT5BLLgk2u8tG3K3qYLaxRfcseoP5yhZAMwhLRv9keFVy5XuiO5Go0QM5bDV2mxwg7EghGaG78ENqMEfF9xpPnR9pygZDZD'


/**
 * Receiving of Post request
 */
function doPost(request) {
  try {
    const contents = JSON.parse(request.postData.contents);
    webHook(contents);
    return ContentService.createTextOutput(JSON.stringify(request))
  } catch (err) {
    sendMessage(me, 'ERR in doPost() ' + JSON.stringify(err), keyboard.example)
  }
}

/**
 * Receiving of Get request
 */
function doGet(request) {
  write(2, 1, 'the Get 1')
  write(2, 2, JSON.stringify(request))
  return ContentService.createTextOutput(request.parameter['hub.challenge']) // the web-hook aprovement
}


/**
*  ------------------------------------------- webHook ------------------------------------------- 
*/

function webHook(contents) {
  try {
    const entry = contents.entry;
    entry.forEach((oneEntry, i) => {
      write(4, 1, JSON.stringify(oneEntry))
      // log('1)----the oneEntry--' + i, oneEntry);
      oneEntry.changes.forEach((change, ii) => {
        // log('2)----the one change--' + ii, change);
        //msg
        if (change.value.messages) {
          change.value.messages.forEach((msg, iii) => {
            // log('3)----the one message--' + iii, msg);
            if (msg?.text) messageReaction(msg)
            if (msg?.interactive) interactiveReaction(msg)
          })
        } else { } // log('Something else !!!');
      })
    })
  } catch (error) {
    sendMessage(admin, error)
  }
  return
}

function messageReaction(msg) {
  write(5, 1, 'msg: ' + JSON.stringify(msg))
  const { from, id, timestamp, text, type } = msg;
  const theMessage = text?.body;
  runCommand(from, theMessage);
}

function interactiveReaction(msg) {
  const msgExample = {
    context: {
      from: '15550231633',
      id: 'wamid.HBgMMzgwOTY3NDY1NDg2FQIAERgSNkQxRDI0RDJBMzBDNDE2MzY4AA=='
    },
    from: '380967465486',
    id: 'wamid.HBgMMzgwOTY3NDY1NDg2FQIAEhgUM0VCMDhCMTYwOTQ5NDNGRkE0MTQA',
    timestamp: '1674837953',
    type: 'interactive',
    interactive: { type: 'button_reply', button_reply: { id: 'b2', title: 'Bbb 2' } }
  };
  const { from, id, timestamp, type, interactive } = msg;
  if (interactive.type == 'button_reply') {
    const { id, title } = interactive.button_reply;
    runCommand(from, id);
  };
};

function runCommand(from, text) {
  if (text.charAt(0) == '/') text.substring(1, text.length) // remove '/'
  const command = text.toLowerCase();
  if (commands[command]) commands[command](from) // ................................................................ start the command
  else return sendMessage(from, "I do not understand this command! Do you wont get help?.", keyboard.basic)
}

/**
*  ------------------------------------------- Messages ------------------------------------------- 
*/
const helpMsg = `
  Some usefull articles:
  https://dev.to/arpitvasani/how-to-connect-whatsapp-with-google-sheets-1a2i
  https://www.labnol.org/whatsapp-api-google-sheets-220520
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
  basic: [
    {
      "type": "reply",
      "reply": {
        "id": "start",
        "title": "Start"
      }
    },
    {
      "type": "reply",
      "reply": {
        "id": "help",
        "title": "Help"
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
        "id": "action 1",
        "title": "Action 1"
      }
    },
    {
      "type": "reply",
      "reply": {
        "id": "action 1",
        "title": "Action 1"
      }
    }
  ]
}

/**
* Send message
*/
async function sendMessage(phone, text, keyboard) {
  return keyboard ? await sendMessageButtons(phone, text, keyboard) : sendMessageOnly(phone, text)
}

/**
* Send message
*/
async function sendMessageOnly(phone, text) {
  let data = {
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": phone,
    "type": "text",
    "text": {
      "preview_url": false,
      "body": text
    }
  };
  // return queryNode(data);
  return query(data);
}

/**
* Send message
*/
async function sendMessageButtons(phone, text, keyboard) {
  const data = {
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": phone,
    "type": "interactive",
    "interactive": {
      "type": "button",
      "body": {
        "text": text
      },
      "action": {
        "buttons": keyboard
      }
    }
  };
  // return queryNode(data);
  return query(data);
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
  return query(data);
}

/**
 * Request to WhatsApp
 */
function query(data) {
  const apiUrl = 'https://graph.facebook.com/v15.0/113203361661968/messages';
  const request = UrlFetchApp.fetch(apiUrl, {
    muteHttpExceptions: true,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify(data),
  });
  const { error } = JSON.parse(request);
  if (error) {
    Logger.log(`😞 ${error}`);
  } else {
    Logger.log(`Message sent to ${recipient_number}`);
  }
};

/**
* Write to Sheet
*/
function write(y, x, data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var cell = sheet.getRange(y, x);
  cell.setValue(data);
}

function test() {
  log(sendMessageOnly('', 'test'))
}
