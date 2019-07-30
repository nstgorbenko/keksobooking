'use strict';
(function () {
  var MainPinStyle = {
    LEFT: 'left: 570px',
    TOP: 'top: 375px'
  };

  /**
   * Переключает внешний вид страницы с активного на неактивный и наоборот
   */
  var toggleState = function () {
    window.adCard.map.classList.toggle('map--faded');
    window.form.adForm.classList.toggle('ad-form--disabled');
  };

  /**
   * Добаляет обработчики событий для активной страницы
   */
  var addActivePageListeners = function () {
    window.form.mapFilters.addEventListener('change', window.filter.onChange);
    window.form.houseType.addEventListener('change', window.form.onHouseTypeChange);
    window.form.timeIn.addEventListener('change', window.form.onInOutTimeChange);
    window.form.timeOut.addEventListener('change', window.form.onInOutTimeChange);
    window.form.capacity.addEventListener('change', window.form.onRoomsGuestsChange);
    window.form.roomNumber.addEventListener('change', window.form.onRoomsGuestsChange);
    window.form.adForm.addEventListener('submit', window.feedback.onFormSubmit);
    resetButton.addEventListener('click', onResetButtonClick);
  };

  /**
   * Удаляет обработчики событий для неактивной страницы
   */
  var removeInactivePageListeners = function () {
    document.removeEventListener('mouseup', onFirstMouseUp);
    window.map.mainPin.removeEventListener('mousedown', onFirstMouseDown);
    window.map.mainPin.removeEventListener('click', onFirstMouseUp);
  };

  /**
   * Активирует формы фильрации и добавления объявления
   */
  var makeFormActive = function () {
    window.form.makeActive(window.form.mapFiltersFields);
    window.form.makeActive(window.form.adFormFields);
    window.form.onHouseTypeChange();
    window.form.onRoomsGuestsChange();
    window.photo.addLoading();
    window.feedback.submitButton.disabled = false;
    resetButton.disabled = false;
  };

  /**
   * Переводит страницу в активное состояние
   */
  var onFirstMouseUp = function () {
    window.form.address.value = window.map.getMainPinAddress();
    toggleState();
    window.pin.renderAds(window.feedback.ads);
    makeFormActive();
    addActivePageListeners();
    removeInactivePageListeners();
  };

  /**
   * Переводит страницу в активное состояние после первого перемещения метки
   */
  var onFirstMouseDown = function () {
    document.addEventListener('mouseup', onFirstMouseUp);
  };

  /**
   * Добаляет обработчики событий для неактивной страницы
   */
  var addInactivePageListeners = function () {
    window.map.mainPin.addEventListener('mousedown', onFirstMouseDown);
    window.map.mainPin.addEventListener('click', onFirstMouseUp);
  };

  /**
   * Удаляет обработчики событий для активной страницы
   */
  var removeActivePageListeners = function () {
    window.form.mapFilters.removeEventListener('change', window.filter.onChange);
    window.form.houseType.removeEventListener('change', window.form.onHouseTypeChange);
    window.form.timeIn.removeEventListener('change', window.form.onInOutTimeChange);
    window.form.timeOut.removeEventListener('change', window.form.onInOutTimeChange);
    window.form.capacity.removeEventListener('change', window.form.onRoomsGuestsChange);
    window.form.roomNumber.removeEventListener('change', window.form.onRoomsGuestsChange);
    window.form.adForm.removeEventListener('submit', window.feedback.onFormSubmit);
    resetButton.removeEventListener('click', onResetButtonClick);
  };

  /**
   * Дезактивирует формы фильрации и добавления объявления
   */
  var makeFormInactive = function () {
    window.form.makeDisabled(window.form.mapFiltersFields);
    window.form.makeDisabled(window.form.adFormFields);
    window.photo.removeLoading();
    window.feedback.submitButton.disabled = true;
    resetButton.disabled = true;
  };

  var clearPage = function () {
    window.adCard.close();
    window.pin.clearAds();
    window.form.adForm.reset();
    window.form.mapFilters.reset();
    window.photo.deletePreviews();
  };

  /**
   * Переводит страницу в неактивное состояние
   */
  var makePageInactive = function () {
    clearPage();
    window.map.mainPin.style = MainPinStyle.LEFT + '; ' + MainPinStyle.TOP;
    window.form.address.value = window.util.MAIN_PIN_START_ADDRESS;
    toggleState();
    makeFormInactive();
    removeActivePageListeners();
    addInactivePageListeners();
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
