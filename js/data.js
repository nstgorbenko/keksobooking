'use strict';
(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var ESC_KEYCODE = 27;
  var FIRST_AD_NUMBER = 0;
  var LAST_AD_NUMBER = 5;

  /**
   * Создает DOM-элемент на основе объекта с данными
   * @param {Object} pinData - объект, описывающий похожее объявление неподалеку
   * @return {Node}
   */
  var createPin = function (pinData) {
    var pin = pinTemplate.cloneNode(true);

    pin.style.left = pinData.location.x - PIN_WIDTH / 2 + 'px';
    pin.style.top = pinData.location.y - PIN_HEIGHT + 'px';
    pin.querySelector('img').src = pinData.author.avatar;
    pin.querySelector('img').alt = '';

    return pin;
  };

  /**
   * Возвращает фрагмент c 5 DOM-элементами
   * @param {Array.<object>} ads - массив объектов похожих объявлений
   * @return {NodeList}
   */
  var createPinsList = function (ads) {
    var fragment = document.createDocumentFragment();

    ads.forEach(function (newPin) {
      fragment.appendChild(createPin(newPin));
    });

    return fragment;
  };

  /**
   * Отрисовывает похожие объявления на карте
   * @param {Array.<object>} ads - массив объектов с объявлениями
   */
  var renderAds = function (ads) {
    mapPins.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (ad) {
      mapPins.removeChild(ad);
    });
    mapPins.appendChild(createPinsList(ads.slice(FIRST_AD_NUMBER, LAST_AD_NUMBER)));
  };

  /**
   * Коллбэк-функция, сохраняет серверные данные
   * @param {Array.<object>} data - массив объектов с объявлениями
   */
  var onSuccessLoad = function (data) {
    window.data.ads = data.slice();
  };

  /**
   * Закрывает окно с сообщением об ошибке по клику
   */
  var onRandomClick = function () {
    main.removeChild(errorTemplate);
    removeErrorPopupListeners();
  };

  /**
   * Закрывает окно с сообщением об ошибке по нажатию на ESC
   * @param {Object} evt - объект события 'keydown'
   */
  var onEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      main.removeChild(errorTemplate);
      removeErrorPopupListeners();
    }
  };

  /**
   * Добавляет обработчики закрытия окна с сообщением об ошибке
   */
  var addErrorPopupListeners = function () {
    document.addEventListener('keydown', onEscPress);
    document.addEventListener('click', onRandomClick);
  };

  /**
   * Удаляет обработчики закрытия окна с сообщением об ошибке
   */
  var removeErrorPopupListeners = function () {
    document.removeEventListener('keydown', onEscPress);
    document.removeEventListener('click', onRandomClick);
  };

  /**
   * Коллбэк-функция, выводит сообщение об ошибке
   * @param {String} error - сообщение об ошибке
   */
  var onErrorLoad = function (error) {
    errorMessage.innerHTML = error;
    main.appendChild(errorTemplate);
    addErrorPopupListeners();
  };

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var errorMessage = errorTemplate.querySelector('.error__message');
  var main = document.querySelector('main');
  var mapPins = document.querySelector('.map__pins');

  window.data = {
    onSuccessLoad: onSuccessLoad,
    onErrorLoad: onErrorLoad,
    renderAds: renderAds
  };
})();
