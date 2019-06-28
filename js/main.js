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
var UNACTIVE_MAP_CHILDREN = 2;

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
      x: getRandomNumber(MAP_LEFT + PIN_WIDTH / 2, MAP_RIGHT - PIN_WIDTH / 2),
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

var mainPinAddress = function () {
  return Math.round((mainPin.offsetLeft + MAIN_PIN_WIDTH / 2)) + ', ' + Math.round((mainPin.offsetTop + MAIN_PIN_HEIGHT));
};

var onHouseTypeChange = function () {
  price.min = minPrice[houseType.value];
  price.placeholder = minPrice[houseType.value];
};

var onInOutTimeChange = function (evt) {
  if (evt.target === timeIn) {
    timeOut.selectedIndex = timeIn.selectedIndex;
  } else {
    timeIn.selectedIndex = timeOut.selectedIndex;
  }
};

var onFirstMouseDown = function () {
  var onFirstMouseUp = function () {
    address.value = mainPinAddress();
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    makeActive(mapFiltersFields);
    makeActive(adFormFields);

    houseType.addEventListener('change', onHouseTypeChange);
    timeIn.addEventListener('change', onInOutTimeChange);
    timeOut.addEventListener('change', onInOutTimeChange);

    document.removeEventListener('mouseup', onFirstMouseUp);
    mainPin.removeEventListener('mouseup', onFirstMouseDown);
  };

  document.addEventListener('mouseup', onFirstMouseUp);
};

var onMouseDown = function (evt) {
  var start = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onMouseMove = function (moveEvt) {
    while (mapPins.children.length > UNACTIVE_MAP_CHILDREN) {
      mapPins.removeChild(mapPins.lastChild);
    }

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

    if (mainPinCoords.x > MAP_RIGHT - MAIN_PIN_WIDTH) {
      mainPinCoords.x = MAP_RIGHT - MAIN_PIN_WIDTH;
    } else if (mainPinCoords.x < MAP_LEFT) {
      mainPinCoords.x = MAP_LEFT;
    }

    if (mainPinCoords.y > MAP_BOTTOM - MAIN_PIN_HEIGHT) {
      mainPinCoords.y = MAP_BOTTOM - MAIN_PIN_HEIGHT;
    } else if (mainPinCoords.y < MAP_TOP - MAIN_PIN_HEIGHT) {
      mainPinCoords.y = MAP_TOP - MAIN_PIN_HEIGHT;
    }

    mainPin.style.top = mainPinCoords.y + 'px';
    mainPin.style.left = mainPinCoords.x + 'px';

    address.value = mainPinAddress();
  };

  var onMouseUp = function () {
    if (mapPins.children.length === UNACTIVE_MAP_CHILDREN) {
      var pinsList = createPinsList(createAds());
      mapPins.appendChild(pinsList);
    }

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
