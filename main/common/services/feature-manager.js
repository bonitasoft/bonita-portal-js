/** Copyright (C) 2015 Bonitasoft S.A.
 * BonitaSoft, 31 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

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
