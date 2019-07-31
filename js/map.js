'use strict';
(function () {
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 81;
  var MapCoord = {
    LEFT: 0,
    RIGHT: 1200,
    TOP: 130,
    BOTTOM: 630
  };

  /**
   * Возвращает адрес метки - координаты, на которые метка указывает своим острым концом
   * @return {String}
   */
  var getMainPinAddress = function () {
    return Math.round((mainPin.offsetLeft + MAIN_PIN_WIDTH / 2)) + ', ' + Math.round((mainPin.offsetTop + MAIN_PIN_HEIGHT));
  };

  /**
   * Реализует возможность перетаскивания метки
   * @param {Object} evt - объект события 'mousedown'
   */
  var onMouseDown = function (evt) {
    var start = {
      x: evt.clientX,
      y: evt.clientY
    };

    /**
     * Задает метке новые координаты
     * @param {Object} moveEvt - объект события 'mousemove'
     */
    var onMouseMove = function (moveEvt) {
      var shift = {
        x: start.x - moveEvt.clientX,
        y: start.y - moveEvt.clientY
      };

      start = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var mainPinCoords = {
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y
      };

      mainPinCoords.x = mainPinCoords.x > MapCoord.RIGHT - MAIN_PIN_WIDTH ? MapCoord.RIGHT - MAIN_PIN_WIDTH : mainPinCoords.x;
      mainPinCoords.x = mainPinCoords.x < MapCoord.LEFT ? MapCoord.LEFT : mainPinCoords.x;

      mainPinCoords.y = mainPinCoords.y > MapCoord.BOTTOM - MAIN_PIN_HEIGHT ? MapCoord.BOTTOM - MAIN_PIN_HEIGHT : mainPinCoords.y;
      mainPinCoords.y = mainPinCoords.y < MapCoord.TOP - MAIN_PIN_HEIGHT ? MapCoord.TOP - MAIN_PIN_HEIGHT : mainPinCoords.y;

      mainPin.style.top = mainPinCoords.y + 'px';
      mainPin.style.left = mainPinCoords.x + 'px';

      window.form.address.value = getMainPinAddress();
    };

    /**
     * Удаляет обработчики событий 'mousemove' и 'mouseup'
     */
    var onMouseUp = function () {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var mainPin = document.querySelector('.map__pin--main');

  window.map = {
    mainPin: mainPin,
    getMainPinAddress: getMainPinAddress,
    onMouseDown: onMouseDown
  };
})();
