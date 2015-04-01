(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.information', ['org.bonitasoft.common.filters.date.parser',
      'org.bonitasoft.common.directives.bonitags'
    ])
    .controller('processInformationCtrl', function($scope, process, dateParser, store, categoryAPI) {
      var vm = this;
      vm.process = process;
      vm.parseAndFormat = dateParser.parseAndFormat;
      vm.categories = [];
      vm.selectedCategories = [];

      store.load(categoryAPI, {
        f: ['id=' + process.id]
      }).then(function(categories) {
        [].push.apply(vm.categories, categories);
      });
    });
})();