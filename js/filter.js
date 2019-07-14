'use strict';
(function () {
  var onHousingTypeChange = function () {
    var filteredAds = window.data.ads.filter(function (ad) {
      return housingType.value === 'any' ? true : ad.offer.type === housingType.value;
    });
    window.data.renderAds(filteredAds);
  };

  var housingType = document.querySelector('#housing-type');

  window.filter = {
    housingType: housingType,
    onHousingTypeChange: onHousingTypeChange
  };
})();
