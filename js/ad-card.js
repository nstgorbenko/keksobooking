'use strict';
(function () {
  var ROOM_PLURALS = ['комната', 'комнаты', 'комнат'];
  var GUEST_PLURALS = ['гостя', 'гостей', 'гостей'];

  /**
   * Возвращает число и единицу измерения с правильным окончанием
   * @param {Number} number - число
   * @param {Array.<string>} options - варианты слова
   * @return {String}
   */
  var getPluralForm = function (number, options) {
    var cases = [2, 0, 1, 1, 1, 2];
    var choice;

    if (number % 100 > 4 && number % 100 < 20) {
      choice = 2;
    } else if (number % 10 < 5) {
      choice = cases[number % 10];
    } else {
      choice = cases[5];
    }

    return number + ' ' + options[choice];
  };

  /**
   * Возвращает коллбэк-функцию, которая добавляет фото во фрагмент
   * @param {DocumentFragment} fragment - контейнер для вставки фото
   * @return {RequestCallback} коллбэк-функция для вставки фото
   */
  var getFragment = function (fragment) {
    return function (photo) {
      var newPhoto = picture.cloneNode(true);
      newPhoto.src = photo;
      fragment.appendChild(newPhoto);
    };
  };

  /**
   * Отрисовывает фото в карточке объявления
   * @param {Array.<string>} photos - массив с адресами изображений
   */
  var renderPhotos = function (photos) {
    var photosFragment = document.createDocumentFragment();

    photoAlbum.innerHTML = '';
    photos.forEach(getFragment(photosFragment));
    photoAlbum.appendChild(photosFragment);
  };

  /**
   * Добавляет список удобств в карточку объявления
   * @param {Array.<string>} features - массив с перечислением удобств
   * @return {DocumentFragment} - контейнер для вставки карточек удобств
   */
  var addFeatures = function (features) {
    var featuresFragment = document.createDocumentFragment();

    features.forEach(function (feature) {
      var newFeature = document.createElement('li');
      newFeature.classList.add('popup__feature', 'popup__feature--' + feature);
      featuresFragment.appendChild(newFeature);
    });

    return featuresFragment;
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
    card.querySelector('.popup__title').textContent = ad.offer.title;
    card.querySelector('.popup__text--address').textContent = ad.offer.address;
    card.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
    card.querySelector('.popup__type').textContent = window.util.HouseTypeMap[ad.offer.type].name;
    card.querySelector('.popup__text--capacity').textContent = getPluralForm(ad.offer.rooms, ROOM_PLURALS) + ' для ' + getPluralForm(ad.offer.guests, GUEST_PLURALS);
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    card.querySelector('.popup__features').innerHTML = '';
    card.querySelector('.popup__features').appendChild(addFeatures(ad.offer.features));
    card.querySelector('.popup__description').textContent = ad.offer.description;
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
