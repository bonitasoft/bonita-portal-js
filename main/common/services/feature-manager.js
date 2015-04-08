(function() {
  'use strict';
  /**
   * org.bonitasoft.service.features Module
   *
   * Description
   */
  var featuresList = [];

  angular.module('org.bonitasoft.service.features', [
    'org.bonitasoft.common.resources.store'
  ]).service('FeatureManagerResolver', function(FeatureManager, featureAPI) {
    return (function loadTranslations() {
      return featureAPI.query({p: 0,c: 0}).$promise.then(populateFeatures);
    })();
  }).service('FeatureManager', function() {
    var FeatureManager = {};
    FeatureManager.isFeatureAvailable = function isFeatureAvailable(feature) {
      return featuresList.indexOf(feature) > -1;
    };
    return FeatureManager;
  });

  function populateFeatures(featuresData) {
    [].push.apply(featuresList,featuresData.data);
  }
})();