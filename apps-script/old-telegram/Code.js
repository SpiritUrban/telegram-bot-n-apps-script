// 290
const log = console.log
const token = '5974247189:AAF5e4ArjN99brcD7bkZ8_a-MQsd8TszRJU'
const chat = '-836748512'

// https://script.google.com/macros/s/AKfycbz0muZsFbS........2wONwoCg102OV5g/exec
// https://script.google.com/macros/s/AKfycbxGzF0QORnBQUEj2CoYBDxrj_IPJLseVusGzpWbxisQCSJ5bvsT_L_4XLXZbfUF-9lL6g/exec
// const webUrl = ScriptApp.getService().getUrl();
// const webUrl = 'https://script.google.com/macros/s/AKfycbzbZ0KIUzEfFZANXfwh2ivr5VeiWHnw3Vns3JsoIhpJ/dev'
const webUrl = 'https://script.google.com/macros/s/AKfycbyGpec--JcQ6j5usA_8hOsD6Li5_ijQ4thecgGpUb1MfvfLMYjAbsZpmnf0yDoX4qBv_A/exec'

log(' webUrl = ', webUrl)


const sendMessage = (msg) => {
  const finalText = encodeURIComponent(msg)
  const url = "https://api.telegram.org/bot" + token + "/sendMessage?chat_id=" + chat + "&text=" + finalText;
  const open1 = UrlFetchApp.fetch(url).getContentText()
  log(open1)
}

function myFunction() {
  // sendMessage('yo!')
  log('Go!')
}


/**
 * Настройки Бота
 */
const config = {
  sheet: "1bYc4jHUYz0qQGal05ugFmIUO2xiD1JpbYZ24ru2bSFo",              // id Google Таблицы, где мы будем хранить данные бота
  webUrl,                                                             // адрес вашего приложения Google Apps Script
  token,                                                              // токен вашего бота
  userNameBot: "......FeedBackBot",                                   // username вашего бота
  apiUrl: "https://api.telegram.org/bot",                             // адрес Telegram API
  botAdmin: 428521383,                                               // ваш личный id в Telegram
  botAdmin2: 382627421,
  langParams: {                                                       // языковые настройки
    ru: {
      admin: {
        hello: "Начинаем ждать сообщений от пользователей",
        answer: {
          self: "Ответ на свое сообщение",
          bot: "Ответ на сообщение бота",
          button: {
            reply: "Надо поставить сообщение пользователя в ответ.",
          },
          error: {
            send: "Не удалось отправить сообщение пользователю"
          }
        }
      },
      user: {
        hello: "Приветствую Вас, {name}.\nЯ очень жду вашего сообщения.\n------\nСпасибо."
      }
    }
  },
  linkCommands: [
    {
      template: /^\/start$/,
      method: 'start'
    }
  ],
  db: {                   // настройки хранения данных, названия листов в таблице и порядковые номера столбцов в которых хранятся свойства сущностей
    users: {
      table: "Users",
      uid: 1,
      name: 2,
      userName: 3,
      lang: 4,
      created_at: 5,
      updated_at: 6
    }
  }
}

/**
 * Helpers
 */

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
 * Получаем данные от Телеграм
 */
function doPost(request) {
  // получаем данные
  let update = JSON.parse(request.postData.contents);
  // направляем данные в объект WebHook
  new WebHook(update);
}

const doGet = (e) => {
  // sendMessage('Web hook success!')
  e.greeting = 'Hello motherfacker!'
  return ContentService.createTextOutput(JSON.stringify(e))
}


/**
 * Класс Helper
 */
class Helper {
  /**
   * Проверяем на существование
   */
  static isSet(variable) {
    return typeof variable !== "undefined";
  }
  /**
   * Проверяем на null
   */
  static isNull(variable) {
    return variable === null;
  }
}


// constructor() - определяем необходимые объекты
// route() - метод, который определяет исходя из пришедших данных куда их направлять для обработки. В основном это проверка на текстовые команды, в нашем наборе в настройках указана только одна команда /start, но при необходимости можно добавить, а также проверка кто написал: пользователь или админ, от этого зависит каким методом будут копироваться сообщения (sendCopyToAdmin() или copyMessage()). 
// checkCommand() - проверяет на совпадение с шаблоном команды, в случае совпадения передает название метода для обработки
// isAdmin() - проверяет пользователя, является ли он владельцем бота исходя из настроек
// isBot() - дает информацию сообщение, на которое идет ответ от администратора, принадлежит боту или пользователю
// start() - метод обработки команды /start
// prepareMethod() - метод который преобразует строку типа video_note в VideoNote
// sendCopyToAdmin() - вот он то самый метод, который в дуэте с методом route() позволяет обойти настройку Telegram, которая запрещает пересылать сообщения. 



// !!! В предыдущих версиях бота я использовал метод forwardMessage(), но при обновлении Telegram появилась возможность пользователям запретить пересылку своих сообщений, и при установке данной настройки, при попытках пересылки ботом сообщений владельцу бота, id пользователя отсутствовал, и при прежнем алгоритме бота выпадало исключение (ошибка).


/**
 * Класс WebHook
 */
class WebHook {
  /**
  * Создаем объект WebHook
  */
  constructor(update) {
    // создаем объект бота
    this.bot = new Bot(config.token, update);
    // создаем объект пользователя
    this.user = new User(this.bot.getUserData());
    // создаем объект языковых настроек
    this.lang = new Lang(this.user.lang);
    // получаем набор команд с шаблонами
    this.linkCommands = config.linkCommands;
    // запускаем роутер
    this.route();
  }

  /**
   * Получаем объект команды
   */
  checkCommand(text) {
    // текстовые ссылки
    if (this.linkCommands.length > 0) {
      // перебираем команды
      for (let linkCommand of this.linkCommands)
        // если есть совпадения
        if (linkCommand.template.test(text)) {
          // добавим флаг 
          linkCommand.result = true;
          // вернем объект с методом
          return linkCommand;
        }
    }
    // если дошли до этой строчки то вернем флаг false
    return {
      result: false
    };
  }

  /**
   * Маршрутизируем
   */
  route() {

    // sendMessage('Whole bot object: ' + JSON.stringify(this.bot) )


    // проверим на частный запрос 
    if (this.bot.data.message.chat.type != "private") {
      // выйдем если это группа или канал
      return;
    }

    // если это сообщение
    if (Helper.isSet(this.bot.data.message)) {

      // sendMessage('Got some msg: ' + this.bot.data.message.text)


      // если это текстовое сообщение
      if (Helper.isSet(this.bot.data.message.text)) {

        // проверяем на команды
        let command = this.checkCommand(this.bot.data.message.text);

        // если есть совпадение по шаблону
        if (command.result) {
          // вызываем метод
          this[command.method]();
          // выходим
          return;
        }
      }


      // если пишет админ
      if (this.isAdmin()) {
        // если это ответ на сообщение
        if (Helper.isSet(this.bot.data.message.reply_to_message)) {
          // получаем текст из отвечаемого сообщения
          let text_ = Helper.isSet(this.bot.data.message.reply_to_message.text)
            ? this.bot.data.message.reply_to_message.text // текстовое сообщение
            : this.bot.data.message.reply_to_message.caption; // медиа сообщение
          // если ответ самому себе
          if (this.user.uid == this.bot.data.message.reply_to_message.from.id) {
            // уведомляем админа, что ответ самому себе
            this.bot.sendMessage(config.botAdmin, this.lang.getParam("admin.answer.self"));
          } // если ответ на сообщение бота
          else if (this.isReplyBot() && !/^USER_ID::[\d]+::/.test(text_)) {
            // уведомляем, что ответ боту
            this.bot.sendMessage(config.botAdmin, this.lang.getParam("admin.answer.bot"));
          }
          else {
            // получить id пользователя из сообщения
            let matches = text_.match(/^USER_ID::(\d+)::/);
            // проверяем
            if (matches) {
              // все нормально отправляем копию сообщения пользователю
              this.bot.copyMessage(matches[1], config.botAdmin, this.bot.data.message.message_id);
              this.bot.copyMessage(matches[1], config.botAdmin2, this.bot.data.message.message_id);
            } else {
              // уведомляем, что не удалось направить сообщение пользователю
              this.bot.sendMessage(config.botAdmin, this.lang.getParam("admin.answer.error.send"));
            }
          }
        } else {
          // уведомление нажать кнопку ответить
          this.bot.sendMessage(config.botAdmin, this.lang.getParam("admin.answer.button.reply"));
        }
      } else {
        // Если это написал пользователь то отправляем копию админу
        this.sendCopyToAdmin();
      }

      // test dev !!!
      this.sendCopyToAdmin();


    }
  }

  /**
   * Проверяем на Админа
   */
  isAdmin() {
    // сравним текущего пользователя с админом из настроек
    return config.botAdmin == this.user.uid || config.botAdmin2 == this.user.uid;
  }

  /**
   * Локальная проверка на бота
   */
  isReplyBot() {
    // вернем кто владелец сообщения на которое отвечаем
    return this.bot.data.message.reply_to_message.from.is_bot;
  }

  /**
   * Старт бота
   */
  start() {
    // определяем текст
    let text = this.isAdmin() // проверяем кто стартанул
      ? this.lang.getParam("admin.hello") // если стартанул админ
      : this.lang.getParam("user.hello", { // если стартанул пользователь
        name: this.user.name // добавим для парсинга его имя
      });
    // выводим сообщение
    this.bot.sendMessage(this.user.uid, text);
    this.bot.sendMenu(this.user.uid);
  }

  /**
   * Отправляем копию
   */
  sendCopyToAdmin() {
    // создаем ссылку на просмотр профиля
    let link = (this.user.userName.length > 0)
      ? "@" + this.user.userName // если есть username
      : "<a href='tg://user?id=" + this.user.uid + "'>" + this.user.name + "</a>";
    // дополнение к сообщению с id пользователя
    let dop = "USER_ID::" + this.user.uid + "::\nот <b>" + this.user.name + "</b> | " + link + "\n-----\n";
    // определяем данные по умолчанию
    let typeMessage = this.bot.getMessageType(); // тип сообщения
    let dopSend = false; // по умолчанию доп отправлять отдельно не нужно
    let data = { // формируем данные сообщения
      chat_id: String(config.botAdmin), // пользователь админ
      disable_web_page_preview: true, // закроем превью ссылок
      parse_mode: "HTML", // форматирование html
      method: null // метод по умолчанию не определен
    };
    // если это текстовое сообщение
    if (typeMessage == "text") {
      // формируем доп с текстом
      data.text = dop + this.bot.prepareMessageWithEntities(this.bot.getMessageText(), this.bot.getEntities());
      // переопределяем метод
      data.method = "sendMessage";
    } else { // если это остальные типы сообщений
      // проверяем нужно ли отправлять dop отдельным сообщением
      dopSend = Helper.isNull(this.bot.getMessageText());
      // заполняем данные
      if (typeMessage == "location") {
        // определяем координаты
        data.longitude = this.bot.data.message.location.longitude;
        data.latitude = this.bot.data.message.location.latitude;
      } else {
        // запоняем файлом
        data[typeMessage] = this.bot.getMessageFileId();
      }
      // если не надо доп, значит описание не пустое
      if (!dopSend) {
        // дополняем описание
        data.caption = dop + this.bot.prepareMessageWithEntities(this.bot.getMessageText(), this.bot.getEntities());
      }
      // переопределяем метод
      data.method = "send" + this.prepareMethod(typeMessage);
    }
    // если метод определен
    if (!Helper.isNull(data.method)) {
      // и нужно отправить доп отдельным сообщением
      if (dopSend) {
        // отправляем админу доп
        this.bot.sendMessage(config.botAdmin, dop);
      }
      // отправляем копию
      this.bot.query({
        method: "post",
        payload: data
      });
    }
  }

  /**
   * Преобразуем переданную строку в camelCase
   */
  prepareMethod(method) {
    return method.split('_') // разделяем по знаку _ в массив
      .map(function (word, index) { // перебираем все значения
        // преобразуем первый символ в верхний регистр, остальное в нижний
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(''); // собираем в одно слово без пробелов
  }
}



// constructor() - принимаем и добавляем в свойства объекта класса необходимые и важные данные, такие как токен бота и объект от Телеграм
// getUserData() - метод для выдачи данных пользователя переданных от Телеграм
// getEntities() - получаем набор форматирования из объекта сообщения
// getMessageText() - получаем текст из сообщения или описание медиа 
// getMessageType() - получаем тип сообщения, очень удобная штука
// getMessageFileId() - если это медиа сообщение, то метод нам поможет из него получить file_id 
// prepareMessageWithEntities() - метод форматирования текста по переданному набору Entities
// sendMessage() - один из методов отправки, описан отдельно в виду его частого использования
// copyMessage() - этот метод помогает скопировать сообщение и отправить его в указанный чат
// query() - основной метод отправки в Телеграм данных, метод доставки данных определяется в наборе переданной ему конфигурации


/**
 * Класс Бот
 */
class Bot {
  /**
   * Создаем объект класса
   */
  constructor(token, data) {
    // записываем токен бота
    this.token = token;
    // и полученный объект с данными от Телеграм
    this.data = data;
  }

  /**
   * Получаем данные пользователя
   */
  getUserData() {
    // вернем данные для создания обновления пользователя
    return {
      // его uid
      uid: this.data.message.from.id ?? 0,
      // его первое имя
      firstName: this.data.message.from.first_name ?? "",
      // его второе имя
      lastName: this.data.message.from.last_name ?? "",
      // его username
      userName: this.data.message.from.username ?? "",
      // его языковую настройку
      lang: this.data.message.from.language_code ?? "ru"
    }
  }

  /**
   * Entities - форматировние
   */
  getEntities() {
    // если это сообщение
    if (Helper.isSet(this.data.message)) {
      // если это текствое сообщение
      if (Helper.isSet(this.data.message.text)) {
        // вернем текстовое форматирование если оно существует
        return this.data.message.entities ?? null;
      } else {
        // если это не текствое сообщение, тогда вернем форматирование описания
        return this.data.message.caption_entities ?? null;
      }
    } else {
      // если это другой тип данных вернем null
      return null;
    }
  }

  /**
   * MessageText - получаем текст или описание объекта
   */
  getMessageText() {
    // медиа объекты с возможным описанием
    let medias = [
      'audio',
      'document',
      'photo',
      'animation',
      'video',
      'voice'
    ];
    // если это текствое сообщение
    if (Helper.isSet(this.data.message.text)) {
      // вернем текст сообщения
      return this.data.message.text ?? null;
    } // если это медиа сообщение с описанием
    else if (medias.includes(this.getMessageType())) {
      // вернем описание объекта
      return this.data.message.caption ?? null;
    } else {
      // если не подходит условия вернем null
      return null;
    }
  }

  /**
   * Message Type
   */
  getMessageType() {
    // получаем объект сообщения
    let message = this.data.message;
    // начинаем проверки и при совпадении вернем тип сообщения
    if (Helper.isSet(message.text)) {
      return "text"; // текстовое сообщение
    } else if (Helper.isSet(message.photo)) {
      return "photo"; // картинка
    } else if (Helper.isSet(message.audio)) {
      return "audio"; // аудио файл
    } else if (Helper.isSet(message.document)) {
      return "document"; // документ
    } else if (Helper.isSet(message.animation)) {
      return "animation"; // анимация
    } else if (Helper.isSet(message.sticker)) {
      return "sticker"; // стикер
    } else if (Helper.isSet(message.voice)) {
      return "voice"; // голосовая заметка
    } else if (Helper.isSet(message.video_note)) {
      return "video_note"; // видео заметка
    } else if (Helper.isSet(message.video)) {
      return "video"; // видео файл
    } else if (Helper.isSet(message.location)) {
      return "location"; // местоположение
    }
    // по умолчанию вернем null
    return null;
  }

  /**
   * Message File Id
   */
  getMessageFileId() {
    // получаем объект сообщения
    let message = this.data.message;
    // определяем тип с вернем соответствующий file_id
    if (Helper.isSet(message.photo)) {
      // получаем массив картинок
      let photo = message.photo;
      // вернем самую последнюю - максимальный размер
      return photo[photo.length - 1].file_id;
    } else if (Helper.isSet(message.audio)) {
      // аудио файл
      return message.audio.file_id;
    } else if (Helper.isSet(message.document)) {
      // документ
      return message.document.file_id;
    } else if (Helper.isSet(message.animation)) {
      // анимация
      return message.animation.file_id;
    } else if (Helper.isSet(message.sticker)) {
      // стикер
      return message.sticker.file_id;
    } else if (Helper.isSet(message.voice)) {
      // голосовая заметка
      return message.voice.file_id;
    } else if (Helper.isSet(message.video_note)) {
      // видео заметка
      return message.video_note.file_id;
    } else if (Helper.isSet(message.video)) {
      // видео файл
      return message.video.file_id;
    }
    // по умолчанию вернем null
    return null;
  }

  /**
   * Форматирование текста
   */
  prepareMessageWithEntities(text, entities) {
    // проверяем наличие форматирования
    if (entities != null && entities.length > 0) {
      // готовим переменную в нее будем добавлять
      let prepareText = "";
      // перебираем форматирование
      entities.forEach(function (entity, idx, arr) {
        // добавляем все что между форматированием
        if (entity.offset > 0) {
          /*
            * старт = если начало больше 0 и это первый элемент то берем сначала с нуля
            * если не первый то берем сразу после предыдущего элемента
            *
            * длина = это разница между стартом и текущим началом
            */
          // определяем начало
          let start = (idx == 0)
            ? 0
            : (arr[idx - 1].offset + arr[idx - 1].length);
          // определяем длину
          let length = entity.offset - start;
          // добавляем
          prepareText = prepareText + text.substr(start, length);
        }
        // выбираем текущий элемент форматирования
        let charts = text.substr(entity.offset, entity.length);
        // обрамляем в необходимый формат
        if (entity.type == "bold") {
          // полужирный
          charts = "<b>" + charts + "</b>";
        } else if (entity.type == "italic") {
          // курсив
          charts = "<i>" + charts + "</i>";
        } else if (entity.type == "code") {
          // код
          charts = "<code>" + charts + "</code>";
        } else if (entity.type == "pre") {
          // inline код
          charts = "<pre>" + charts + "</pre>";
        } else if (entity.type == "strikethrough") {
          // зачеркнутый
          charts = "<s>" + charts + "</s>";
        } else if (entity.type == "underline") {
          // подчеркнутый
          charts = "<u>" + charts + "</u>";
        } else if (entity.type == "spoiler") {
          // скрытый
          charts = "<tg-spoiler>" + charts + "</tg-spoiler>";
        } else if (entity.type == "text_link") {
          // ссылка текстовая
          charts = "<a href='" + entity.url + "'>" + charts + "</a>";
        }
        // добавляем в переменную
        prepareText = prepareText + charts;
      })
      // добавляем остатки текста если такие есть
      prepareText = prepareText + text.substr((entities[entities.length - 1].offset + entities[entities.length - 1].length));
      // возвращаем результат
      return prepareText;
    }
    // по умолчанию вернем не форматированный текст
    return text;
  }

  /**
  * Отправляем меню
  */
  sendMenu(chat_id) {
    // готовим данные
    let data = {
      method: "post",
      payload: {
        method: "sendMessage",
        chat_id: String(chat_id),
        // text: text,
        // parse_mode: "HTML",

        reply_markup: {
          inline_keyboard: [[{
            text: 'Share with your friends',
            switch_inline_query: 'share'
          }]]
        }

      }
    }
    // вернем результат отправки
    return this.query(data);
  }


  /**
  * Отправляем сообщение
  */
  sendMessage(chat_id, text) {
    // готовим данные
    let data = {
      method: "post",
      payload: {
        method: "sendMessage",
        chat_id: String(chat_id),
        text: text,
        parse_mode: "HTML"
      }
    }
    // вернем результат отправки
    return this.query(data);
  }

  /**
   * Отправляем копию сообщения
   */
  copyMessage(to_id, from_id, message_id) {
    // готовим данные
    let data = {
      method: "post",
      payload: {
        method: "copyMessage",
        chat_id: String(to_id), // кому
        from_chat_id: String(from_id), // откуда
        message_id: message_id // что
      }
    }
    // вернем результат отправки
    return this.query(data);
  }

  /**
   * Запрос в Телеграм
   */
  query(data) {
    return JSON.parse(UrlFetchApp.fetch(config.apiUrl + this.token + "/", data).getContentText());
  }
}


// Class User
// Класс Пользователя, нам нужен только для тестирования по хранению данных в Google таблице. Как оказалось, это не сложно, при беглом взгляде у Google API для этого очень много инструментов. Надо будет потом написать класс по типу ActiveRecord, не искал, но скорее всего уже есть такие на GitHub. Но опять же мне для теста.

// Методы класса:

// constructor() - в конструкторе сразу наполняем свойства пользователя полученными данными
// getRowByUid() - получаем номер строки по uid
// save() - добавляем или обновляем данные о пользователе


/**
 * Класс Пользователь
 */
class User {
  /**
   * Создаем объект пользователя
   */
  constructor(userData) {
    // заполняем uid
    this.uid = userData.uid;
    // name сразу склеиваем из первого и второго имени
    this.name = (userData.firstName + " " + userData.lastName).trim();
    // заполняем lang из телеги
    this.lang = userData.lang;
    // username если есть 
    this.userName = userData.userName;
    // сохраняем данные
    this.save()
  }

  /**
   * Получаем строку в таблице по uid
   */
  getRowByUid(sheet, uid, range_ = "A1:A") {
    // определяем диапазон ячеек в таблице
    const range = sheet.getRange(range_);
    // получаем через поиск по переданному uid
    const result = range.createTextFinder(uid).matchEntireCell(true).findNext();
    // вернем результат
    return result // если он не null
      ? result.getRow() // вернем номер строки
      : null; // или null
  }

  /**
   * Обновляем или добавляем пользователя в таблицу
   */
  save() {
    // определяем таблицу и в ней лист
    const sheet = SpreadsheetApp.openById(config.sheet).getSheetByName(config.db.users.table);
    // получаем номер строки или null
    const row = this.getRowByUid(sheet, this.uid);
    // получаем текущую дату-время
    const date = new Date();
    // проверяем строку
    if (row) { // если есть то обновляем данные пользователя - могли быть изменены
      // обновляем имя пользователя
      sheet.getRange(row, config.db.users.name).setValue(this.name);
      // обновляем username
      sheet.getRange(row, config.db.users.userName).setValue(this.userName);
      // обновляем lang
      sheet.getRange(row, config.db.users.lang).setValue(this.lang);
      // обновляем дату-время последнего посещения
      sheet.getRange(row, config.db.users.updated_at).setValue(date.toString());
    } else {
      // если строка не найдена, значит добавляем пользователя в лист
      sheet.appendRow([this.uid, this.name, this.userName, this.lang, date.toString(), date.toString()]);
    }
  }
}


// Class Lang
// Этот класс позволит очень просто сделать нашего бота полиглотом. Текстовые настройки мы храним ближе к началу файла, чтобы было удобно вносить изменения.

// Методы класса:

// constructor() - получаем набор текстовых настроек и устанавливаем пользовательскую настройку
// setLang() - устанавливаем если присутствует пользовательский набор настроек или по умолчанию
// getParamByDot() - этот метод позволяет удобно указывать какую настройку брать по типу "admin.answer.error.send", он по точке разбивает в массив и через рекурсию добирается до нужного значения
// getParam() - метод возвращает окончательно сформированную текстовую часть с учетом подстановки динамических значений


/**
 * Класс Lang
 */
class Lang {
  /**
   * Создаем объект Lang
   */
  constructor(userLang = 'ru') {
    // получаем данные из общих настроек
    this.langParams = config.langParams;
    // записываем языковую настроку пользователя
    this.setLang(userLang);
  }

  /**
   * Уставнавливаем параметр lang
   */
  setLang(userLang) {
    // если настроки по переданному параметру существуют
    this.lang = Helper.isSet(this.langParams[userLang])
      ? userLang // то устанавливаем
      : 'ru'; // иначе вернем по умолчанию
  }

  /**
   * Получаем значение из массива
   */
  getParamByDot(arr, obj) {
    // получаем первый элемент массива
    let name = arr.shift();
    // проверяем есть ли еще в массиве другие параметры
    if (arr.length > 0) {
      // направляем на рекурсию
      return this.getParamByDot(arr, obj[name]);
    }
    // вернем настройку
    return obj[name];
  }

  /**
   * Готовим значение
   */
  getParam(param, data = {}) {
    // получаем текстовую настройку
    let text = this.getParamByDot(param.split('.'), this.langParams[this.lang]);
    // если настройка не найдена
    if (!Helper.isSet(text)) {
      // то вернем заглушку
      return "Unknown Text";
    } // Если настройка найдена
    else {
      // проверяем переданы ли значения под замену
      if (Object.keys(data).length > 0) {
        // перебираем значения
        for (let key in data) {
          // создаем шаблон
          let template = new RegExp('{' + key + '}', 'gi');
          // заменяем
          text = text.replace(template, data[key]);
        }
      }
      // вернем настройку
      return text;
    }
  }
}

