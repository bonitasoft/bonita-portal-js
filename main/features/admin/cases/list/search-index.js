(function() {
  'use strict';
  /**
   * com.bonitasoft.features.admin.cases.list.searchIndex Module
   *
   * contains definition of the search index directive
   */
  angular.module('org.bonitasoft.features.admin.cases.list.searchIndex', []).
  directive('searchIndex', function() {
    // Runs during compile
    return {
      scope: {
        'case': '=',
        index: '@'
      }, // {} = isolate, true = child, false/undefined = no change
      restrict: 'E',
      templateUrl: 'features/admin/cases/list/search-index.html',
      replace: true
    };
  });
})();
