(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.information', ['org.bonitasoft.features.admin.cases.list.service'])
  .controller('processInformationCtrl', function($scope, process, dateParser) {
    var vm = this;
    vm.process = process;
    vm.parseAndFormat = dateParser.parseAndFormat;
  });
})();
