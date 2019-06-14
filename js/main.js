'use strict';
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAP_LEFT = 0;
var MAP_RIGHT = 980;
var MAP_TOP = 130;
var MAP_BOTTOM = 630;
var PINS_NUMBER = 8;

var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var createAd = function (index) {
  var newAd = {};

  newAd.author = {'avatar': 'img/avatars/user0' + index + '.png'};
  newAd.offer = {'type': typesList[Math.floor(Math.random() * typesList.length)]};
  newAd.location = {};
  newAd.location.x = getRandomNumber(MAP_LEFT, MAP_RIGHT);
  newAd.location.y = getRandomNumber(MAP_TOP, MAP_BOTTOM);
  return newAd;
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

var typesList = ['palace', 'flat', 'house', 'bungalo'];
var map = document.querySelector('.map');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');

map.classList.remove('map--faded');
var nearbyAds = createAds();
var pinsList = createPinsList(nearbyAds);
mapPins.appendChild(pinsList);
