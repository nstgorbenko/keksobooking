'use strict';
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAP_LEFT = 0;
var MAP_RIGHT = 1200;
var MAP_TOP = 130;
var MAP_BOTTOM = 630;
var PINS_NUMBER = 8;
var TYPES_LIST = ['palace', 'flat', 'house', 'bungalo'];
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 81;
var MAIN_PIN_START_ADDRESS = '603, 408';

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

/**
 * Добавляет HTML-элементам атрибут disabled
 * @param {NodeList} elements - набор HTML-элементов
 */
var makeDisabled = function (elements) {
  elements.forEach(function (newElement) {
    newElement.disabled = true;
  });
};

/**
 * Удаляет у HTML-элементов атрибут disabled
 * @param {NodeList} elements - набор HTML-элементов
 */
var makeActive = function (elements) {
  elements.forEach(function (newElement) {
    newElement.disabled = false;
  });
};

/**
 * Возвращает адрес метки - координаты, на которые метка указывает своим острым концом
 * @return {String}
 */
var mainPinAddress = function () {
  return Math.round((mainPin.offsetLeft + MAIN_PIN_WIDTH / 2)) + ', ' + Math.round((mainPin.offsetTop + MAIN_PIN_HEIGHT));
};

/**
 * Устанавливает значение атрибутов min и placeholder для поля 'Цена за ночь, руб' в соответствии с выбранным типом жилья
 */
var onHouseTypeChange = function () {
  price.min = minPrice[houseType.value];
  price.placeholder = minPrice[houseType.value];
};

/**
 * Синхронизирует значения полей 'Время заезда' и 'Время выезда'
 * @param {Object} evt - объект события 'change'
 */
var onInOutTimeChange = function (evt) {
  if (evt.target === timeIn) {
    timeOut.selectedIndex = timeIn.selectedIndex;
  } else {
    timeIn.selectedIndex = timeOut.selectedIndex;
  }
};

/**
 * Переводит страницу в активное состояние
 */
var onFirstMouseUp = function () {
  address.value = mainPinAddress();
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  mapPins.appendChild(pinsList);
  makeActive(mapFiltersFields);
  makeActive(adFormFields);

  houseType.addEventListener('change', onHouseTypeChange);
  timeIn.addEventListener('change', onInOutTimeChange);
  timeOut.addEventListener('change', onInOutTimeChange);

  document.removeEventListener('mouseup', onFirstMouseUp);
  mainPin.removeEventListener('mousedown', onFirstMouseDown);
};

/**
 * Переводит страницу в активное состояние после первого перемещения метки
 */
var onFirstMouseDown = function () {
  document.addEventListener('mouseup', onFirstMouseUp);
};

/**
 * Реализует возможность перетаскивания метки
 * @param {Object} evt - объект события 'mousedown'
 */
var onMouseDown = function (evt) {
  var start = {
    x: evt.clientX,
    y: evt.clientY
  };

  /**
   * Задает метке новые координаты
   * @param {Object} moveEvt - объект события 'mousemove'
   */
  var onMouseMove = function (moveEvt) {
    var shift = {
      x: start.x - moveEvt.clientX,
      y: start.y - moveEvt.clientY
    };

    start = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var mainPinCoords = {
      x: mainPin.offsetLeft - shift.x,
      y: mainPin.offsetTop - shift.y
    };

    mainPinCoords.x = mainPinCoords.x > MAP_RIGHT - MAIN_PIN_WIDTH ? MAP_RIGHT - MAIN_PIN_WIDTH : mainPinCoords.x;
    mainPinCoords.x = mainPinCoords.x < MAP_LEFT ? MAP_LEFT : mainPinCoords.x;

    mainPinCoords.y = mainPinCoords.y > MAP_BOTTOM - MAIN_PIN_HEIGHT ? MAP_BOTTOM - MAIN_PIN_HEIGHT : mainPinCoords.y;
    mainPinCoords.y = mainPinCoords.y < MAP_TOP - MAIN_PIN_HEIGHT ? MAP_TOP - MAIN_PIN_HEIGHT : mainPinCoords.y;

    mainPin.style.top = mainPinCoords.y + 'px';
    mainPin.style.left = mainPinCoords.x + 'px';

    address.value = mainPinAddress();
  };

  /**
   * Удаляет обработчики событий 'mousemove' и 'mouseup'
   */
  var onMouseUp = function () {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

var map = document.querySelector('.map');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var adForm = document.querySelector('.ad-form');
var adFormFields = adForm.querySelectorAll('input, select');
var mapFilters = document.querySelector('.map__filters');
var mapFiltersFields = mapFilters.querySelectorAll('input, select');
var mainPin = document.querySelector('.map__pin--main');
var address = document.querySelector('[name = "address"]');
var houseType = document.querySelector('#type');
var price = document.querySelector('#price');
var timeIn = document.querySelector('#timein');
var timeOut = document.querySelector('#timeout');
var minPrice = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

address.value = MAIN_PIN_START_ADDRESS;
makeDisabled(adFormFields);
makeDisabled(mapFiltersFields);
mainPin.addEventListener('mousedown', onFirstMouseDown);
mainPin.addEventListener('mousedown', onMouseDown);
var pinsList = createPinsList(createAds());
