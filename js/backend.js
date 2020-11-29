'use strict';
(function () {
  var GET_URL = 'https://javascript.pages.academy/keksobooking/data';
  var POST_URL = 'https://javascript.pages.academy/keksobooking/';
  var GET = 'GET';
  var POST = 'POST';
  var LOAD_TIME = 10000;
  var Code = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
  };

  /**
   * Создает объект XMLHttpRequest для связи с сервером
   * @param {RequestCallback} onSuccess - коллбэк-функция для успешного выполнения запроса
   * @param {RequestCallback} onError - коллбэк-функция для неуспешного выполнения запроса
   * @param {String} method - HTTP-метод
   * @param {String} url - адрес сервера
   * @param {*} data - данные для передачи на сервер
   */
  var createXhr = function (onSuccess, onError, method, url, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = LOAD_TIME;

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case Code.SUCCESS: {
          onSuccess(xhr.response);
          break;
        }
        case Code.BAD_REQUEST: {
          error = 'Неверный запрос';
          break;
        }
        case Code.NOT_FOUND: {
          error = 'Ничего не найдено';
          break;
        }
        case Code.SERVER_ERROR: {
          error = 'Внутренняя ошибка сервера';
          break;
        }
        default: {
          error = 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText;
        }
      }
      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open(method, url);
    xhr.send(data);
  };

  /**
   * Загружает данные с сервера
   * @param {RequestCallback} onLoad - коллбэк-функция для успешного выполнения запроса
   * @param {RequestCallback} onError - коллбэк-функция для неуспешного выполнения запроса
   */
  var download = function (onLoad, onError) {
    createXhr(onLoad, onError, GET, GET_URL);
  };

  /**
   * Отправляет данные на сервер
   * @param {*} data - данные для передачи на сервер
   * @param {RequestCallback} onLoad - коллбэк-функция для успешного выполнения запроса
   * @param {RequestCallback} onError - коллбэк-функция для неуспешного выполнения запроса
   */
  var send = function (data, onLoad, onError) {
    createXhr(onLoad, onError, POST, POST_URL, data);
  };

  window.backend = {
    downloadPins: download,
    sendAd: send
  };
})();
