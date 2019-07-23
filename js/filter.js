'use strict';
(function () {
  var DEBOUNCE_INTERVAL = 500;
  var HousePriceMap = {
    low: {
      min: 0,
      max: 10000
    },
    middle: {
      min: 10000,
      max: 50000
    },
    high: {
      min: 50000
    }
  };

  /**
   * Коллбэк-функция для фильтрации объявлений по типу жилья
   * @param {Object} ad - объявление
   * @return {*} - выражение, используемое для последующей фильтрации объявлений
   */
  var getHousingType = function (ad) {
    return housingType.value === 'any' ? true : ad.offer.type === housingType.value;
  };

  /**
   * Коллбэк-функция для фильтрации объявлений по цене
   * @param {Object} ad - объявление
   * @return {*} - выражение, используемое для последующей фильтрации объявлений
   */
  var getHousingPrice = function (ad) {
    return housingPrice.value === 'any' ? true : ad.offer.price >= HousePriceMap[housingPrice.value].min && ad.offer.price < HousePriceMap[housingPrice.value].max;
  };

  /**
   * Коллбэк-функция для фильтрации объявлений по количеству комнат
   * @param {Object} ad - объявление
   * @return {*} - выражение, используемое для последующей фильтрации объявлений
   */
  var getHousingRooms = function (ad) {
    return housingRooms.value === 'any' ? true : ad.offer.rooms === Number(housingRooms.value);
  };

  /**
   * Коллбэк-функция для фильтрации объявлений по количеству гостей
   * @param {Object} ad - объявление
   * @return {*} - выражение, используемое для последующей фильтрации объявлений
   */
  var getHousingGuests = function (ad) {
    return housingGuests.value === 'any' ? true : ad.offer.rooms === Number(housingGuests.value);
  };

  /**
   * Коллбэк-функция для фильтрации объявлений по наличию удобств
   * @param {Object} ad - объявление
   * @param {HTMLElement} feature - чекбокс, обозначающий наличие удобства
   * @return {*} - выражение, используемое для последующей фильтрации объявлений
   */
  var getHousingFeature = function (ad, feature) {
    return !feature.checked ? true : ad.offer.features.some(function (adFeature) {
      return adFeature === feature.value;
    });
  };

  /**
   * Коллбэк-функция для фильтрации объявлений по всем доступным параметрам
   * @param {Object} ad - объявление
   * @return {*} - выражение, используемое для последующей фильтрации объявлений
   */
  var checkAllFilters = function (ad) {
    return getHousingType(ad) &&
           getHousingPrice(ad) &&
           getHousingRooms(ad) &&
           getHousingGuests(ad) &&
           getHousingFeature(ad, wifiFilter) &&
           getHousingFeature(ad, dishwasherFilter) &&
           getHousingFeature(ad, parkingFilter) &&
           getHousingFeature(ad, washerFilter) &&
           getHousingFeature(ad, elevatorFilter) &&
           getHousingFeature(ad, conditionerFilter);
  };

  /**
   * Отрисовывает объявления в соответствии с выбранными фильтрами
   */
  var updateAds = function () {
    var filteredAds = window.feedback.ads;
    filteredAds = filteredAds.filter(checkAllFilters);
    window.pin.renderAds(filteredAds);
  };

  /**
   * Устраняет мигание интерфейса при переключении фильтра
   */
  var debounce = function () {
    if (timeOut) {
      window.clearTimeout(timeOut);
    }
    timeOut = window.setTimeout(function () {
      updateAds();
    }, DEBOUNCE_INTERVAL);
  };

  var onMapFiltersChange = function () {
    window.adCard.close();
    debounce();
  };

  var housingType = document.querySelector('#housing-type');
  var housingPrice = document.querySelector('#housing-price');
  var housingRooms = document.querySelector('#housing-rooms');
  var housingGuests = document.querySelector('#housing-guests');
  var wifiFilter = document.querySelector('#filter-wifi');
  var dishwasherFilter = document.querySelector('#filter-dishwasher');
  var parkingFilter = document.querySelector('#filter-parking');
  var washerFilter = document.querySelector('#filter-washer');
  var elevatorFilter = document.querySelector('#filter-elevator');
  var conditionerFilter = document.querySelector('#filter-conditioner');
  var timeOut;

  window.filter = {
    onChange: onMapFiltersChange
  };
})();
