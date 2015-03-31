(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.information', ['org.bonitasoft.common.filters.date.parser',
    'decipher.tags'])
    .controller('processInformationCtrl', function($scope, process, dateParser) {
      var vm = this;
      vm.process = process;
      vm.parseAndFormat = dateParser.parseAndFormat;
      $scope.initTags = ['+84111111111', '+84222222222', '+84333333333', '+84444444444', '+84555555555'];
    });
})();