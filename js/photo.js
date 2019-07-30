'use strict';
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var AVATAR_DEFAULT_IMAGE = 'img/muffin-grey.svg';
  var IMAGE_MAX_WIDTH = '70px';
  var IMAGE_MAX_HEIGHT = '70px';

  /**
   * Проверяет, является ли выбранный файл изображением
   * @param {File} file - проверяемый файл
   * @return {Boolean} - результат проверки
   */
  var isImageFormat = function (file) {
    return FILE_TYPES.some(function (format) {
      return file.name.toLowerCase().endsWith(format);
    });
  };

  /**
   * Добавляет превью аватара на страницу
   * @param {File} avatar - файл фото
   */
  var addAvatar = function (avatar) {
    if (isImageFormat(avatar)) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });
      reader.readAsDataURL(avatar);
    }
  };

  /**
   * Реализует предзагрузку аватара пользователя через поле загрузки файлов
   */
  var onAvatarLoaderChange = function () {
    var avatarFile = avatarLoader.files[0];
    addAvatar(avatarFile);
  };

  /**
   * Предотвращает поведение по-умолчанию для события dragover у поля загрузки аватара
   * @param {Object} evt - объект события dragover
   */
  var onAvatarDropZoneDragOver = function (evt) {
    evt.preventDefault();
  };

  /**
   * Реализует предзагрузку аватара пользователя перетаскиванеим
   * @param {Object} evt - объект события drop
   */
  var onAvatarDropZoneDrop = function (evt) {
    evt.preventDefault();

    window.photo.avatarFile = evt.dataTransfer.files[0];
    addAvatar(window.photo.avatarFile);
  };

  /**
   * Добавляет превью фото жилья на страницу
   * @param {File} newImage - файл фото
   */
  var addImage = function (newImage) {
    var reader = new FileReader();

    reader.addEventListener('load', function () {
      var image = document.createElement('img');

      image.src = reader.result;
      image.style.maxWidth = IMAGE_MAX_WIDTH;
      image.style.maxHeight = IMAGE_MAX_HEIGHT;
      if (imageContainer.querySelector('img')) {
        var newImagePreview = imagePreview.cloneNode(false);

        newImagePreview.appendChild(image);
        imageContainer.appendChild(newImagePreview);
      } else {
        imagePreview.appendChild(image);
      }
    });
    reader.readAsDataURL(newImage);
  };

  /**
   * Реализует предзагрузку фото жилья через поле загрузки файлов
   */
  var onImageLoaderChange = function () {
    var imageFiles = Array.from(imageLoader.files).filter(isImageFormat);
    imageFiles.forEach(addImage);
  };

  /**
   * Предотвращает поведение по-умолчанию для события dragover у поля загрузки фото жилья
   * @param {Object} evt - объект события dragover
   */
  var onImageDropZoneDragOver = function (evt) {
    evt.preventDefault();
  };

  /**
   * Реализует предзагрузку фото жилья перетаскиванием
   * @param {Object} evt - объект события drop
   */
  var onImageDropZoneDrop = function (evt) {
    evt.preventDefault();

    window.photo.imageFiles = Array.from(evt.dataTransfer.files).filter(isImageFormat);
    window.photo.imageFiles.forEach(addImage);
  };

  /**
   * Удаляет загруженные пользователем аватар и фото жилья
   */
  var deletePreviews = function () {
    avatarPreview.src = AVATAR_DEFAULT_IMAGE;
    imageContainer.querySelectorAll('.ad-form__photo').forEach(function (image) {
      imageContainer.removeChild(image);
    });
    imagePreview.innerHTML = '';
    imageContainer.appendChild(imagePreview);
  };

  /**
   * Добавляет обработчики событий, отвечающие за предзагрузку аватара и фото
   */
  var addLoading = function () {
    avatarLoader.addEventListener('change', onAvatarLoaderChange);
    avatarDropZone.addEventListener('dragover', onAvatarDropZoneDragOver);
    avatarDropZone.addEventListener('drop', onAvatarDropZoneDrop);
    imageLoader.addEventListener('change', onImageLoaderChange);
    imageDropZone.addEventListener('dragover', onImageDropZoneDragOver);
    imageDropZone.addEventListener('drop', onImageDropZoneDrop);
  };

  /**
   * Удаляет обработчики событий, отвечающие за предзагрузку аватара и фото
   */
  var removeLoading = function () {
    avatarLoader.removeEventListener('change', onAvatarLoaderChange);
    avatarDropZone.removeEventListener('dragover', onAvatarDropZoneDragOver);
    avatarDropZone.removeEventListener('drop', onAvatarDropZoneDrop);
    imageLoader.removeEventListener('change', onImageLoaderChange);
    imageDropZone.removeEventListener('dragover', onImageDropZoneDragOver);
    imageDropZone.removeEventListener('drop', onImageDropZoneDrop);
  };

  var avatarLoader = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var avatarDropZone = document.querySelector('.ad-form-header__drop-zone');
  var imageContainer = document.querySelector('.ad-form__photo-container');
  var imageLoader = imageContainer.querySelector('#images');
  var imagePreview = imageContainer.querySelector('.ad-form__photo');
  var imageDropZone = imageContainer.querySelector('.ad-form__drop-zone');

  window.photo = {
    addLoading: addLoading,
    removeLoading: removeLoading,
    deletePreviews: deletePreviews
  };
})();
