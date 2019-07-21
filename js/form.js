'use strict';
(function () {
  var MAIN_PIN_START_ADDRESS = '603, 408';
  var NO_GUESTS_HOUSE = '100';
  var minPriceMap = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };
  var RoomGuestsMap = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
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
   * Устанавливает значение атрибутов min и placeholder для поля 'Цена за ночь, руб' в соответствии с выбранным типом жилья
   */
  var onHouseTypeChange = function () {
    price.min = minPriceMap[houseType.value];
    price.placeholder = minPriceMap[houseType.value];
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
   * Проверяет соотвествие полей 'Количество комнат' и 'Количество мест'
   */
  var onRoomsGuestsChange = function () {
    var isCapacityEnough = RoomGuestsMap[roomNumber.value].some(function (elem) {
      return elem === Number(capacity.value);
    });
    var message = '';

    if (isCapacityEnough === false && roomNumber.value === NO_GUESTS_HOUSE) {
      message = 'Допустимое значение - не для гостей';
    } else if (isCapacityEnough === false) {
      message = 'Допустимое количество гостей - не более ' + Math.max.apply(Math, RoomGuestsMap[roomNumber.value]) + ', но больше 0';
    }
    capacity.setCustomValidity(message);
  };

  var address = document.querySelector('[name = "address"]');
  var adForm = document.querySelector('.ad-form');
  var adFormFields = adForm.querySelectorAll('input, select');
  var mapFilters = document.querySelector('.map__filters');
  var mapFiltersFields = mapFilters.querySelectorAll('input, select');
  var houseType = document.querySelector('#type');
  var price = document.querySelector('#price');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var roomNumber = document.querySelector('#room_number');
  var capacity = document.querySelector('#capacity');

  address.value = MAIN_PIN_START_ADDRESS;
  makeDisabled(adFormFields);
  makeDisabled(mapFiltersFields);

  window.form = {
    MAIN_PIN_START_ADDRESS: MAIN_PIN_START_ADDRESS,
    address: address,
    adForm: adForm,
    adFormFields: adFormFields,
    mapFilters: mapFilters,
    mapFiltersFields: mapFiltersFields,
    houseType: houseType,
    timeIn: timeIn,
    timeOut: timeOut,
    roomNumber: roomNumber,
    capacity: capacity,

    makeActive: makeActive,
    onHouseTypeChange: onHouseTypeChange,
    onInOutTimeChange: onInOutTimeChange,
    onRoomsGuestsChange: onRoomsGuestsChange
  };
})();
