'use strict';
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAP_LEFT = 0;
var MAP_RIGHT = 980;
var MAP_TOP = 130;
var MAP_BOTTOM = 630;
var PINS_NUMBER = 8;
var TYPES_LIST = ['palace', 'flat', 'house', 'bungalo'];
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 81;
var MAIN_PIN_START_X = 603;
var MAIN_PIN_START_Y = 456;
var MIN_PRICE = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var createAd = function (index) {
  return {
    author: {
      avatar: 'img/avatars/user0' + index + '.png'
    },
    offer: {
      type: TYPES_LIST[Math.floor(Math.random() * TYPES_LIST.length)]
    },
    location: {
      x: getRandomNumber(MAP_LEFT, MAP_RIGHT),
      y: getRandomNumber(MAP_TOP, MAP_BOTTOM)
    }
  };
};

var createAds = function () {
  var adsList = [];

  for (var i = 1; i <= PINS_NUMBER; i++) {
    adsList.push(createAd(i));
  }

  return adsList;
};

var createPin = function (pinData) {
  var pin = pinTemplate.cloneNode(true);

  pin.style.left = pinData.location.x - PIN_WIDTH / 2 + 'px';
  pin.style.top = pinData.location.y - PIN_HEIGHT + 'px';
  pin.querySelector('img').src = pinData.author.avatar;
  pin.querySelector('img').alt = '';

  return pin;
};

var createPinsList = function (ads) {
  var fragment = document.createDocumentFragment();

  ads.forEach(function (newPin) {
    fragment.appendChild(createPin(newPin));
  });

  return fragment;
};

var makeDisabled = function (elements) {
  elements.forEach(function (newElement) {
    newElement.disabled = true;
  });
};

var makeActive = function (elements) {
  elements.forEach(function (newElement) {
    newElement.disabled = false;
  });
};

var onMainPinClick = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  makeActive(mapFiltersFields);
  makeActive(adFormFields);
  mapPins.appendChild(pinsList);

  mainPin.removeEventListener('click', onMainPinClick);
  mainPin.addEventListener('mouseup', onMainPinMouseUp);
  houseType.addEventListener('change', onHouseTypeChange);
  timeIn.addEventListener('change', onInOutTimeChange);
  timeOut.addEventListener('change', onInOutTimeChange);
};

var onMainPinMouseUp = function () {
  address.value = mainPinAddress();
};

var mainPinAddress = function () {
  return Math.round((mainPin.offsetLeft + MAIN_PIN_WIDTH / 2)) + ', ' + Math.round((mainPin.offsetTop + MAIN_PIN_HEIGHT));
};

var onHouseTypeChange = function () {
  var chosenTypePrice = MIN_PRICE[houseType.value];

  price.min = chosenTypePrice;
  price.placeholder = chosenTypePrice;
};

var onInOutTimeChange = function (evt) {
  if (evt.target === timeIn) {
    timeOut.selectedIndex = timeIn.selectedIndex;
  } else {
    timeIn.selectedIndex = timeOut.selectedIndex;
  }
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

address.value = MAIN_PIN_START_X + ', ' + MAIN_PIN_START_Y;
makeDisabled(adFormFields);
makeDisabled(mapFiltersFields);
var pinsList = createPinsList(createAds());
mainPin.addEventListener('click', onMainPinClick);
