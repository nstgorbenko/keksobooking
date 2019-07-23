'use strict';
(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var ESC_KEYCODE = 27; // повтор
  var FIRST_AD_NUMBER = 0;
  var LAST_AD_NUMBER = 5;

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
      var activePin = window.adCard.mapPins.querySelector('.map__pin--active');
      if (activePin) {
        activePin.classList.remove('map__pin--active');
      }
      pin.classList.add('map__pin--active');
      window.adCard.map.insertBefore(window.adCard.createAdCard(pinData), mapFiltersContainer);
      document.addEventListener('keydown', window.adCard.onAdCardEscPress);
    });

    return pin;
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
   * Очищает карту от объявлений
   */
  var clearAds = function () {
    window.adCard.mapPins.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (ad) {
      window.adCard.mapPins.removeChild(ad);
    });
  };

  /**
   * Отрисовывает похожие объявления на карте
   * @param {Array.<object>} ads - массив объектов с объявлениями
   */
  var renderAds = function (ads) {
    clearAds();
    window.adCard.mapPins.appendChild(createPinsList(ads.slice(FIRST_AD_NUMBER, LAST_AD_NUMBER)));
  };

  /**
   * Коллбэк-функция, сохраняет серверные данные
   * @param {Array.<object>} data - массив объектов с объявлениями
   */
  var onSuccessLoad = function (data) {
    window.data.ads = data.slice().filter(function (ad) {
      return ad.offer;
    });
    window.map.mainPin.addEventListener('mousedown', window.map.onFirstMouseDown);
    window.map.mainPin.addEventListener('mousedown', window.map.onMouseDown);
    window.map.mainPin.addEventListener('click', window.map.onFirstMouseUp);
  };

  /**
   * Переводит страницу в неактивное состояние
   */
  var makePageInactive = function () {
    clearAds();
    window.adCard.closeAdCard();
    window.form.adForm.reset();

    window.map.mainPin.style = 'left: 570px; top: 375px';
    window.form.address.value = window.form.MAIN_PIN_START_ADDRESS;

    window.adCard.map.classList.add('map--faded');
    window.form.adForm.classList.add('ad-form--disabled');
    window.form.makeDisabled(window.form.mapFiltersFields);
    window.form.makeDisabled(window.form.adFormFields);
    submitButton.disabled = true;
    resetButton.disabled = true;

    window.form.mapFilters.removeEventListener('change', window.filter.onMapFiltersChange);
    window.form.houseType.removeEventListener('change', window.form.onHouseTypeChange);
    window.form.timeIn.removeEventListener('change', window.form.onInOutTimeChange);
    window.form.timeOut.removeEventListener('change', window.form.onInOutTimeChange);
    window.form.capacity.removeEventListener('change', window.form.onRoomsGuestsChange);
    window.form.roomNumber.removeEventListener('change', window.form.onRoomsGuestsChange);
    window.form.adForm.removeEventListener('submit', onFormSubmit);
    resetButton.removeEventListener('click', onResetButtonClick);

    window.map.mainPin.addEventListener('mousedown', window.map.onFirstMouseDown);
    window.map.mainPin.addEventListener('click', window.map.onFirstMouseUp);
  };

  /**
   * Коллбэк-функция, показывает сообщение об успешной отправке данных, переводит страницу в неактивное состояние
   */
  var onSuccessSubmit = function () {
    successTemplate.classList.add('screen-popup');
    main.appendChild(successTemplate);
    addErrorPopupListeners();
    makePageInactive();
  };

  /**
   * Отправляет данные на сервер
   * @param {Object} evt - объект события 'submit'
   */
  var onFormSubmit = function (evt) {
    evt.preventDefault();
    window.backend.send(new FormData(window.form.adForm), onSuccessSubmit, onErrorLoad);
    submitButton.disabled = true;
  };

  /**
   * Закрывает окно с сообщением по клику
   */
  var onRandomClick = function () {
    var screenPopup = main.querySelector('.screen-popup');

    main.removeChild(screenPopup);
    removeErrorPopupListeners();
  };

  /**
   * Закрывает окно с сообщением по нажатию на ESC
   * @param {Object} evt - объект события 'keydown'
   */
  var onEscPress = function (evt) {
    var screenPopup = main.querySelector('.screen-popup');

    if (evt.keyCode === ESC_KEYCODE) {
      main.removeChild(screenPopup);
      removeErrorPopupListeners();
    }
  };

  /**
   * Добавляет обработчики закрытия окна с сообщением
   */
  var addErrorPopupListeners = function () {
    document.addEventListener('keydown', onEscPress);
    document.addEventListener('click', onRandomClick);
  };

  /**
   * Удаляет обработчики закрытия окна с сообщением
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
    errorTemplate.classList.add('screen-popup');
    main.appendChild(errorTemplate);
    addErrorPopupListeners();
    submitButton.disabled = false;
  };

  /**
   * Сбрасывает страницу в исходное состояние
   * @param {Object} evt - объект события 'click'
   */
  var onResetButtonClick = function (evt) {
    evt.preventDefault();
    makePageInactive();
  };

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var errorMessage = errorTemplate.querySelector('.error__message');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var main = document.querySelector('main');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var submitButton = document.querySelector('.ad-form__submit');
  var resetButton = document.querySelector('.ad-form__reset');

  submitButton.disabled = true;
  resetButton.disabled = true;

  window.data = {
    submitButton: submitButton,
    resetButton: resetButton,

    onSuccessLoad: onSuccessLoad,
    onErrorLoad: onErrorLoad,
    onFormSubmit: onFormSubmit,
    renderAds: renderAds,
    onResetButtonClick: onResetButtonClick
  };
})();
