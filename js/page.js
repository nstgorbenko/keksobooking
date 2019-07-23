'use strict';
(function () {
  var MainPinStyle = {
    LEFT: 'left: 570px',
    TOP: 'top: 375px'
  };

  /**
   * Переводит страницу в активное состояние
   */
  var onFirstMouseUp = function () {
    window.form.address.value = window.map.getMainPinAddress();
    window.adCard.map.classList.remove('map--faded');
    window.form.adForm.classList.remove('ad-form--disabled');
    window.pin.renderAds(window.feedback.ads);
    window.form.makeActive(window.form.mapFiltersFields);
    window.form.makeActive(window.form.adFormFields);
    window.feedback.submitButton.disabled = false;
    resetButton.disabled = false;

    window.form.mapFilters.addEventListener('change', window.filter.onChange);
    window.form.onHouseTypeChange();
    window.form.houseType.addEventListener('change', window.form.onHouseTypeChange);
    window.form.timeIn.addEventListener('change', window.form.onInOutTimeChange);
    window.form.timeOut.addEventListener('change', window.form.onInOutTimeChange);
    window.form.onRoomsGuestsChange();
    window.form.capacity.addEventListener('change', window.form.onRoomsGuestsChange);
    window.form.roomNumber.addEventListener('change', window.form.onRoomsGuestsChange);
    window.form.adForm.addEventListener('submit', window.feedback.onFormSubmit);
    resetButton.addEventListener('click', onResetButtonClick);

    document.removeEventListener('mouseup', onFirstMouseUp);
    window.map.mainPin.removeEventListener('mousedown', onFirstMouseDown);
    window.map.mainPin.removeEventListener('click', onFirstMouseUp);
  };

  /**
   * Переводит страницу в активное состояние после первого перемещения метки
   */
  var onFirstMouseDown = function () {
    document.addEventListener('mouseup', onFirstMouseUp);
  };

  /**
   * Переводит страницу в неактивное состояние
   */
  var makePageInactive = function () {
    window.pin.clearAds();
    window.adCard.close();
    window.form.adForm.reset();
    window.form.mapFilters.reset();

    window.map.mainPin.style = MainPinStyle.LEFT + '; ' + MainPinStyle.TOP;
    window.form.address.value = window.util.MAIN_PIN_START_ADDRESS;

    window.adCard.map.classList.add('map--faded');
    window.form.adForm.classList.add('ad-form--disabled');
    window.form.makeDisabled(window.form.mapFiltersFields);
    window.form.makeDisabled(window.form.adFormFields);
    window.feedback.submitButton.disabled = true;
    resetButton.disabled = true;

    window.form.mapFilters.removeEventListener('change', window.filter.onChange);
    window.form.houseType.removeEventListener('change', window.form.onHouseTypeChange);
    window.form.timeIn.removeEventListener('change', window.form.onInOutTimeChange);
    window.form.timeOut.removeEventListener('change', window.form.onInOutTimeChange);
    window.form.capacity.removeEventListener('change', window.form.onRoomsGuestsChange);
    window.form.roomNumber.removeEventListener('change', window.form.onRoomsGuestsChange);
    window.form.adForm.removeEventListener('submit', window.feedback.onFormSubmit);
    resetButton.removeEventListener('click', onResetButtonClick);

    window.map.mainPin.addEventListener('mousedown', onFirstMouseDown);
    window.map.mainPin.addEventListener('click', onFirstMouseUp);
  };

  /**
   * Сбрасывает страницу в исходное состояние
   * @param {Object} evt - объект события 'click'
   */
  var onResetButtonClick = function (evt) {
    evt.preventDefault();
    makePageInactive();
  };

  var resetButton = document.querySelector('.ad-form__reset');

  resetButton.disabled = true;

  window.page = {
    onFirstMouseUp: onFirstMouseUp,
    onFirstMouseDown: onFirstMouseDown,
    makeInactive: makePageInactive
  };
})();
