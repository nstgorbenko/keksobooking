'use strict';
(function () {
  var MAIN_PIN_START_ADDRESS = '603, 408';

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
    price.min = minPrice[houseType.value];
    price.placeholder = minPrice[houseType.value];
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

  var address = document.querySelector('[name = "address"]');
  var adForm = document.querySelector('.ad-form');
  var adFormFields = adForm.querySelectorAll('input, select');
  var mapFilters = document.querySelector('.map__filters');
  var mapFiltersFields = mapFilters.querySelectorAll('input, select');
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

  window.form = {
    address: address,
    adForm: adForm,
    adFormFields: adFormFields,
    mapFilters: mapFilters,
    mapFiltersFields: mapFiltersFields,
    houseType: houseType,
    timeIn: timeIn,
    timeOut: timeOut,

    makeActive: makeActive,
    onHouseTypeChange: onHouseTypeChange,
    onInOutTimeChange: onInOutTimeChange
  };
})();
