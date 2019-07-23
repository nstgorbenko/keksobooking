'use strict';
(function () {
  var MAIN_PIN_START_ADDRESS = '603, 408';
  var ESC_KEYCODE = 27;

  window.util = {
    MAIN_PIN_START_ADDRESS: MAIN_PIN_START_ADDRESS,

    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    }
  };
})();
