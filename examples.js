const x = {
  "update_id":66389017,
  "message":{
    "message_id":839,
    "from":{
      "id":428521383,
      "is_bot":false,
      "first_name":"Виталий",
      "last_name":"Дячук",
      "language_code":"en"
    },
    "chat":{
      "id":428521383,
      "first_name":"Виталий",
      "last_name":"Дячук",
      "type":"private"
    },
    "date":1673364945,
    "text":"S"
  }
}


const startMsg = { 
  "message_id": 761, 
  "from": { 
    "id": 428521383, 
    "is_bot": false, 
    "first_name": "Виталий", 
    "last_name": "Дячук", 
    "language_code": "en" 
  }, 
  "chat": { 
    "id": 428521383, 
    "first_name": "Виталий", 
    "last_name": "Дячук", 
    "type": "private" 
  }, 
  "date": 1673360358, 
  "text": "/start", 
  "entities": [
    { 
      "offset": 0, 
      "length": 6, 
      "type": "bot_command" 
    }
  ] 
}



const answer = {
  "ok": true,
  "result": {
    "message_id": 267,
    "from": {
      "id": 5974247189,
      "is_bot": true,
      "first_name": "GUBUS GASH",
      "username": "GUBUSfirstbot"
    },
    "chat": {
      "id": -836748512,
      "title": "GUBUS test",
      "type": "group",
      "all_members_are_administrators": true
    },
    "date": 1673179312,
    "text": "yo!"
  }
}


// set webHook -> {"ok":true,"result":true,"description":"Webhook was set"}

const getMeInfo = {
  "ok": true,
  "result": {
    "id": 5974247189,
    "is_bot": true,
    "first_name": "GUBUS GASH",
    "username": "GUBUSfirstbot",
    "can_join_groups": true,
    "can_read_all_group_messages": false,
    "supports_inline_queries": false
  }
}

const getWebHookInfoResults = [
  {
    "ok": true,
    "result": {
      "url": "https://script.google.com/macros/s/AKfycbyf8YLRHNUaHcdRgcI08Dek5D2ngZe9Y32rt1CS77XkcRnp22_l/exec",
      "has_custom_certificate": false,
      "pending_update_count": 8,
      "last_error_date": 1673237615,
      "last_error_message": "Wrong response from the webhook: 404 Not Found",
      "max_connections": 40,
      "ip_address": "142.251.39.110"
    }
  },

  {
    "ok": true,
    "result": {
      "url": "https://script.google.com/macros/s/AKfycbzbZ0KIUzEfFZANXfwh2ivr5VeiWHnw3Vns3JsoIhpJ/dev",
      "has_custom_certificate": false,
      "pending_update_count": 8,
      "last_error_date": 1673239704,
      "last_error_message": "Wrong response from the webhook: 401 Unauthorized",
      "max_connections": 40,
      "ip_address": "142.251.36.46"
    }
  },

]

const data = {
  "update_id": 66388883,
  "message": {
    "message_id": 313,
    "from": {
      "id": 428521383,
      "is_bot": false,
      "first_name": "Виталий",
      "last_name": "Дячук",
      "language_code": "en"
    },
    "chat": {
      "id": 428521383,
      "first_name": "Виталий",
      "last_name": "Дячук",
      "type": "private"
    },
    "date": 1673251157,
    "text": "Хеллоу БОТ!!!"
  }
}

const theBotObj = {
  "token": "5974247189:AAF5e4ArjN99brcD7bkZ8_a-MQsd8TszRJU",
  "data": {
    "update_id": 66388884,
    "message": {
      "message_id": 316,
      "from": {
        "id": 428521383,
        "is_bot": false,
        "first_name": "Виталий",
        "last_name": "Дячук",
        "language_code": "en"
      }, "chat": {
        "id": 428521383,
        "first_name": "Виталий",
        "last_name": "Дячук",
        "type": "private"
      },
      "date": 1673251581,
      "text": "Yo!"
    }
  }
}
