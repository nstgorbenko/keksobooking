'use strict';
(function () {
  var TYPES_LIST = ['palace', 'flat', 'house', 'bungalo'];
  var MAP_LEFT = 0;
  var MAP_RIGHT = 1200;
  var MAP_TOP = 130;
  var MAP_BOTTOM = 630;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var PINS_NUMBER = 8;

  /**
   * Возвращает случайное целое число между min (включительно) и max (включительно)
     * @param {Number} min
     * @param {Number} max
     * @return {Number}
   */
  var getRandomNumber = function (min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  /**
   * Генерирует объект, описывающий похожее объявление неподалеку
     * @param {Number} index - число, указывающее на адрес изображения
     * @return {Object}
   */
  var createAd = function (index) {
    return {
      author: {
        avatar: 'img/avatars/user0' + index + '.png'
      },
      offer: {
        type: TYPES_LIST[Math.floor(Math.random() * TYPES_LIST.length)]
      },
      location: {
        x: getRandomNumber(MAP_LEFT + PIN_WIDTH / 2, MAP_RIGHT - PIN_WIDTH / 2),
        y: getRandomNumber(MAP_TOP, MAP_BOTTOM)
      }
    };
  };

  /**
   * Возвращает массив объектов похожих объявлений
   * @return {Array.<object>}
   */
  var createAds = function () {
    var adsList = [];

    for (var i = 1; i <= PINS_NUMBER; i++) {
      adsList.push(createAd(i));
    }

    return adsList;
  };

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
   * Возвращает фрагмент c DOM-элементами
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

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var pinsList = createPinsList(createAds());

  window.data = {
    pinsList: pinsList,
    MAP_LEFT: MAP_LEFT,
    MAP_RIGHT: MAP_RIGHT,
    MAP_TOP: MAP_TOP,
    MAP_BOTTOM: MAP_BOTTOM
  };
})();
