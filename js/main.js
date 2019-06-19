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
var MAIN_PIN_START_ADDRESS = 603 + ', ' + 456;

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

var activePage = function () {
  mapPins.appendChild(pinsList);
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  makeActive(adFormFields);
  makeActive(mapFiltersFields);
};

var mainPinAddress = function () {
  return Math.round((mainPin.offsetLeft + MAIN_PIN_WIDTH / 2)) + ', ' + Math.round((mainPin.offsetTop + MAIN_PIN_HEIGHT));
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

makeDisabled(adFormFields);
makeDisabled(mapFiltersFields);
address.value = MAIN_PIN_START_ADDRESS;
var nearbyAds = createAds();
var pinsList = createPinsList(nearbyAds);

mainPin.addEventListener('click', function () {
  activePage();
});

mainPin.addEventListener('mouseup', function () {
  activePage();
  address.value = mainPinAddress();
});
