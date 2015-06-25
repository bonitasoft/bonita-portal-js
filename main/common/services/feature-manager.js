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
  ]).constant('FEATURES', {
    searchIndexes : 'SEARCH_INDEX'
  }).service('FeatureManagerResolver', function(FeatureManager, featureAPI) {
    return (function loadTranslations() {
      return featureAPI.query({p: 0,c: 0}).$promise.then(populateFeatures);
    })();
  }).service('FeatureManager', function(FEATURES) {
    var FeatureManager = {};
    FeatureManager.isFeatureAvailable = function isFeatureAvailable(feature) {
      return featuresList.indexOf(feature) > -1;
    };

    FeatureManager.isSearchIndexedFeatureActivated = function () {
      return featuresList.indexOf(FEATURES.searchIndexes) > -1;
    };

    return FeatureManager;
  });

  function populateFeatures(featuresData) {
    featuresList = [];
    [].push.apply(featuresList,featuresData && featuresData.map(function(feature){
      return feature.name;
    }));
  }
})();
