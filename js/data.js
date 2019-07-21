'use strict';
(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var ESC_KEYCODE = 27;
  var FIRST_AD_NUMBER = 0;
  var LAST_AD_NUMBER = 5;
  var ROOM_PLURAL = ['комната', 'комнаты', 'комнат'];
  var GUEST_PLURAL = ['гостя', 'гостей', 'гостей'];
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
   * Создает DOM-элемент метки на карте на основе объекта с данными
   * @param {Object} pinData - объект, описывающий похожее объявление неподалеку
   * @return {Node}
   */
  var createPin = function (pinData) {
    var pin = pinTemplate.cloneNode(true);

    pin.style.left = pinData.location.x - PIN_WIDTH / 2 + 'px';
    pin.style.top = pinData.location.y - PIN_HEIGHT + 'px';
    pin.querySelector('img').src = pinData.author.avatar;
    pin.querySelector('img').alt = '';

    pin.addEventListener('click', function () {
      map.insertBefore(createCard(pinData), mapFilters);
      document.addEventListener('keydown', onPopupEscPress);
    });

    return pin;
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
  var closePopup = function () {
    var popup = map.querySelector('.popup');
    map.removeChild(popup);
    card.querySelector('.popup__close').removeEventListener('click', onClosePopupClick);
    document.removeEventListener('keydown', onPopupEscPress);
  };

  /**
   * Закрывает карточку объявления по клику
   */
  var onClosePopupClick = function () {
    closePopup();
  };

  /**
   * Закрывает карточку объявления по нажатию на ESC
   * @param {Object} evt - объект события 'keydown'
   */
  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  };

  /**
   * Создает DOM-элемент карточки объявления на основе объекта с данными
   * @param {Object} ad - объект, описывающий похожее объявление неподалеку
   * @return {Node}
   */
  var createCard = function (ad) {
    card.querySelector('.popup__title').innerHTML = ad.offer.title;
    card.querySelector('.popup__text--address').innerHTML = ad.offer.address;
    card.querySelector('.popup__text--price').innerHTML = ad.offer.price + '₽/ночь';
    card.querySelector('.popup__type').innerHTML = HouseTypeMap[ad.offer.type];
    card.querySelector('.popup__text--capacity').innerHTML = getPluralForm(ad.offer.rooms, ROOM_PLURAL) + ' для ' + getPluralForm(ad.offer.guests, GUEST_PLURAL);
    card.querySelector('.popup__text--time').innerHTML = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    card.querySelector('.popup__features').innerHTML = ad.offer.features.map(getHouseFeature).join(', ');
    card.querySelector('.popup__description').innerHTML = ad.offer.description;
    card.querySelector('.popup__avatar').src = ad.author.avatar;
    renderPhotos(ad.offer.photos);
    card.querySelector('.popup__close').addEventListener('click', onClosePopupClick);

    return card;
  };

  /**
   * Возвращает фрагмент c 5 DOM-элементами похожих объявлений
   * @param {Array.<object>} ads - массив объектов похожих объявлений
   * @return {NodeList}
   */
  var createPinsList = function (ads) {
    var pinsFragment = document.createDocumentFragment();

    ads.forEach(function (newPin) {
      pinsFragment.appendChild(createPin(newPin));
    });

    return pinsFragment;
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
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var card = cardTemplate.cloneNode(true);
  var errorMessage = errorTemplate.querySelector('.error__message');
  var main = document.querySelector('main');
  var mapPins = document.querySelector('.map__pins');
  var photoAlbum = card.querySelector('.popup__photos');
  var picture = photoAlbum.querySelector('.popup__photo');
  var map = document.querySelector('.map');
  var mapFilters = map.querySelector('.map__filters-container');

  window.data = {
    map: map,

    onSuccessLoad: onSuccessLoad,
    onErrorLoad: onErrorLoad,
    renderAds: renderAds,
    createCard: createCard
  };
})();
