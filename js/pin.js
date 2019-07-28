'use strict';
(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var FIRST_AD_NUMBER = 0;
  var LAST_AD_NUMBER = 5;

  /**
   * Создает DOM-элемент метки на карте на основе объекта с данными
   * @param {Object} pinData - объект, описывающий похожее объявление неподалеку
   * @return {Node}
   */
  var createPin = function (pinData) {
    var pin = pinTemplate.cloneNode(true);
    var onPinClick = function () {
      var activePin = window.adCard.mapPins.querySelector('.map__pin--active');

      if (activePin) {
        activePin.classList.remove('map__pin--active');
      }
      pin.classList.add('map__pin--active');
      window.adCard.map.insertBefore(window.adCard.create(pinData), mapFiltersContainer);
      document.addEventListener('keydown', window.adCard.onEscPress);
    };

    pin.style.left = pinData.location.x - PIN_WIDTH / 2 + 'px';
    pin.style.top = pinData.location.y - PIN_HEIGHT + 'px';
    pin.querySelector('img').src = pinData.author.avatar;
    pin.querySelector('img').alt = '';
    pin.addEventListener('click', onPinClick);

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

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapFiltersContainer = document.querySelector('.map__filters-container');

  window.pin = {
    renderAds: renderAds,
    clearAds: clearAds
  };
})();
