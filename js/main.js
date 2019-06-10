'use strict';
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAP_LEFT = 0;
var MAP_RIGHT = 980;
var MAP_TOP = 130;
var MAP_BOTTOM = 630;

var createArray = function () {
  var array = [];
  var typesList = ['palace', 'flat', 'house', 'bungalo'];
  var randomNumber = function (min, max) {
    var random = min + Math.random() * (max + 1 - min);
    random = Math.floor(random);
    return random;
  };

  for (var i = 1; i <= 8; i++) {
    var newObject = {};
    newObject.author = {'avatar': 'img/avatars/user0' + i + '.png'};
    newObject.offer = {'type': typesList[Math.floor(Math.random() * typesList.length)]};
    newObject.location = {};
    newObject.location.x = randomNumber(MAP_LEFT, MAP_RIGHT);
    newObject.location.y = randomNumber(MAP_TOP, MAP_BOTTOM);
    array.push(newObject);
  }
  return array;
};

var nearbyAds = createArray();

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var createMapMark = function (mapMarkObject) {
  var mapMark = pinTemplate.cloneNode(true);
  mapMark.style.left = mapMarkObject.location.x - PIN_WIDTH / 2 + 'px';
  mapMark.style.top = mapMarkObject.location.y - PIN_HEIGHT + 'px';
  mapMark.querySelector('img').src = mapMarkObject.author.avatar;
  mapMark.querySelector('img').alt = '';
  return mapMark;
};

var createMapMarksElement = function (mapMarksArray) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < mapMarksArray.length; i++) {
    var newMapMark = createMapMark(mapMarksArray[i]);
    fragment.appendChild(newMapMark);
  }
  return fragment;
};

var mapMarksElement = createMapMarksElement(nearbyAds);

var mapPins = document.querySelector('.map__pins');
mapPins.appendChild(mapMarksElement);
