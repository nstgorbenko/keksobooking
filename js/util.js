'use strict';
(function () {
  var MAIN_PIN_START_ADDRESS = '603, 408';
  var ESC_KEYCODE = 27;
  var HouseTypeMap = {
    'bungalo': {
      name: 'Бунгало',
      minPrice: 0
    },
    'flat': {
      name: 'Квартира',
      minPrice: 1000
    },
    'house': {
      name: 'Дом',
      minPrice: 5000
    },
    'palace': {
      name: 'Дворец',
      minPrice: 10000
    }
  };

  window.util = {
    MAIN_PIN_START_ADDRESS: MAIN_PIN_START_ADDRESS,
    HouseTypeMap: HouseTypeMap,

    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    }
  };
})();
