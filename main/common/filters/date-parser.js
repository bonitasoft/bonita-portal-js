(function(){
  'use strict';
  /**
   * @ngdoc overview
   * @name o.b.f.admin.cases.list.service
   *
   * @description
   * describes the case list service that only includes the dateParser service
   */
  angular.module('org.bonitasoft.common.filters.date.parser', ['gettext'])
  /**
   * @ngdoc object
   * @name o.b.f.admin.cases.list.CaseListCtrl
   * @description
   * it parse date and format it to the case admin format
   *
   * @requires $filter
   * @requires gettextCatalog
   */
    .service('dateParser', ['gettextCatalog', '$filter', function(gettextCatalog, $filter){
    var parseDateService = {};

    var dateFormat = gettextCatalog.getString('MM/dd/yyyy h:mm a');

    parseDateService.parseAndFormat = function(date) {
      return $filter('date')(date.replace(/ /, 'T'), dateFormat);
    };

    return parseDateService;
  }]);
})();
