(function() {
  'use strict';

  angular.module('com.bonitasoft.features.admin.processes.details.information', ['org.bonitasoft.features.admin.cases.list.service',
    'com.bonitasoft.features.admin.processes.monitoringStatus'])
  .controller('processInformationCtrl', function($scope, process, dateParser) {
    var vm = this;
    vm.process = process;
    vm.parseAndFormat = dateParser.parseAndFormat;
  });
})();
