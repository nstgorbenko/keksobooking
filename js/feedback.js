'use strict';
(function () {
  /**
   * Коллбэк-функция, сохраняет серверные данные
   * @param {Array.<object>} adsData - массив объектов с объявлениями
   */
  var onSuccessLoad = function (adsData) {
    window.feedback.ads = adsData.slice().filter(function (ad) {
      return ad.offer;
    });
    window.map.mainPin.addEventListener('mousedown', window.page.onFirstMouseDown);
    window.map.mainPin.addEventListener('mousedown', window.map.onMouseDown);
    window.map.mainPin.addEventListener('click', window.page.onFirstMouseUp);
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
   * Коллбэк-функция, показывает сообщение об успешной отправке данных, переводит страницу в неактивное состояние
   */
  var onSuccessSubmit = function () {
    showSuccessMessage();
    window.page.makeInactive();
  };

  /**
   * Коллбэк-функция, выводит сообщение об ошибке
   * @param {String} error - сообщение об ошибке
   */
  var onErrorLoad = function (error) {
    showErrorMessage(error);
    submitButton.disabled = false;
  };

  /**
   * Показывает сообщение об успешной отправке данных
   */
  var showSuccessMessage = function () {
    successTemplate.classList.add('screen-popup');
    main.appendChild(successTemplate);
    addMessagePopupListeners();
  };

  /**
   * Показывает сообщение об ошибке
   * @param {String} error - текст сообщения
   */
  var showErrorMessage = function (error) {
    errorMessage.innerHTML = error;
    errorTemplate.classList.add('screen-popup');
    main.appendChild(errorTemplate);
    addMessagePopupListeners();
  };

  /**
   * Закрывает окно с сообщением
   */
  var closeMessagePopup = function () {
    var screenPopup = main.querySelector('.screen-popup');

    main.removeChild(screenPopup);
    removeMessagePopupListeners();
  };

  /**
   * Закрывает окно с сообщением по клику
   */
  var onRandomClick = function () {
    closeMessagePopup();
  };

  /**
   * Закрывает окно с сообщением по нажатию на ESC
   * @param {Object} evt - объект события 'keydown'
   */
  var onEscPress = function (evt) {
    window.util.isEscEvent(evt, closeMessagePopup);
  };

  /**
   * Добавляет обработчики закрытия окна с сообщением
   */
  var addMessagePopupListeners = function () {
    document.addEventListener('keydown', onEscPress);
    document.addEventListener('click', onRandomClick);
  };

  /**
   * Удаляет обработчики закрытия окна с сообщением
   */
  var removeMessagePopupListeners = function () {
    document.removeEventListener('keydown', onEscPress);
    document.removeEventListener('click', onRandomClick);
  };

  var main = document.querySelector('main');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var errorMessage = errorTemplate.querySelector('.error__message');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var submitButton = document.querySelector('.ad-form__submit');

  submitButton.disabled = true;
  window.backend.download(onSuccessLoad, onErrorLoad);

  window.feedback = {
    submitButton: submitButton,

    onFormSubmit: onFormSubmit
  };
})();
