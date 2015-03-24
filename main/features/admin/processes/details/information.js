(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.information', [])
  .controller('processInformationCtrl', function($scope, process, dateParser) {
    var vm = this;
    vm.process = process;
    vm.parseAndFormat = dateParser.parseAndFormat;
  });
})();
