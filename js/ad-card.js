'use strict';
(function () {
  var ROOM_PLURALS = ['комната', 'комнаты', 'комнат'];
  var GUEST_PLURALS = ['гостя', 'гостей', 'гостей'];
  var HouseTypeMap = {
    'bungalo': 'Бунгало',
    'flat': 'Квартира',
    'house': 'Дом',
    'palace': 'Дворец'
  };
  var HouseFeatureMap = {
    'wifi': 'бесплатный WI-FI',
    'dishwasher': 'посудомоечная машина',
    'parking': 'парковка',
    'washer': 'стиральная машина',
    'elevator': 'лифт',
    'conditioner': 'кондиционер'
  };

  /**
   * Переводит значение удобства на русский язык
   * @param {String} feature - значение на английском
   * @return {String} - значение на русском
   */
  var getHouseFeature = function (feature) {
    return HouseFeatureMap[feature];
  };

  /**
   * Возвращает число и единицу измерения с правильным окончанием
   * @param {Number} number - число
   * @param {Array.<string>} options - варианты слова
   * @return {String}
   */
  var getPluralForm = function (number, options) {
    var cases = [2, 0, 1, 1, 1, 2];

    return number + ' ' + options[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
  };

  /**
   * Отрисовывает фото в карточке объявления
   * @param {Array.<string>} photos - массив с адресами изображений
   */
  var renderPhotos = function (photos) {
    var photosFragment = document.createDocumentFragment();

    photoAlbum.innerHTML = '';
    photos.forEach(function (photo) {
      var newPhoto = picture.cloneNode(true);
      newPhoto.src = photo;
      photosFragment.appendChild(newPhoto);
    });
    photoAlbum.appendChild(photosFragment);
  };

  /**
   * Закрывает карточку объявления
   */
  var closeAdCard = function () {
    var adCard = map.querySelector('.popup');
    if (adCard) {
      map.removeChild(adCard);
      mapPins.querySelector('.map__pin--active').classList.remove('map__pin--active');
      card.querySelector('.popup__close').removeEventListener('click', onCloseAdCardClick);
      document.removeEventListener('keydown', onAdCardEscPress);
    }
  };

  /**
   * Закрывает карточку объявления по клику
   */
  var onCloseAdCardClick = function () {
    closeAdCard();
  };

  /**
   * Закрывает карточку объявления по нажатию на ESC
   * @param {Object} evt - объект события 'keydown'
   */
  var onAdCardEscPress = function (evt) {
    window.util.isEscEvent(evt, closeAdCard);
  };

  /**
   * Создает DOM-элемент карточки объявления на основе объекта с данными
   * @param {Object} ad - объект, описывающий похожее объявление неподалеку
   * @return {Node}
   */
  var createAdCard = function (ad) {
    card.querySelector('.popup__title').innerHTML = ad.offer.title;
    card.querySelector('.popup__text--address').innerHTML = ad.offer.address;
    card.querySelector('.popup__text--price').innerHTML = ad.offer.price + '₽/ночь';
    card.querySelector('.popup__type').innerHTML = HouseTypeMap[ad.offer.type];
    card.querySelector('.popup__text--capacity').innerHTML = getPluralForm(ad.offer.rooms, ROOM_PLURALS) + ' для ' + getPluralForm(ad.offer.guests, GUEST_PLURALS);
    card.querySelector('.popup__text--time').innerHTML = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    card.querySelector('.popup__features').innerHTML = ad.offer.features.map(getHouseFeature).join(', ');
    card.querySelector('.popup__description').innerHTML = ad.offer.description;
    card.querySelector('.popup__avatar').src = ad.author.avatar;
    renderPhotos(ad.offer.photos);
    card.querySelector('.popup__close').addEventListener('click', onCloseAdCardClick);

    return card;
  };

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var card = cardTemplate.cloneNode(true);
  var photoAlbum = card.querySelector('.popup__photos');
  var picture = photoAlbum.querySelector('.popup__photo');

  window.adCard = {
    map: map,
    mapPins: mapPins,

    create: createAdCard,
    close: closeAdCard,
    onEscPress: onAdCardEscPress
  };
})();
