(function() {

  'use strict';

  angular
    .module('org.bonitasoft.features.user.tasks.app.priorities', [
      'gettext'
    ])
    .service('priorities', ['gettextCatalog',

      function prioritiesService(gettextCatalog) {
        // keys come from backend (task API)
        var priorities = {
          highest: gettextCatalog.getString('Highest'),
          'above_normal': gettextCatalog.getString('Above normal'),
          normal: gettextCatalog.getString('Normal'),
          'under_normal': gettextCatalog.getString('Under normal'),
          lowest: gettextCatalog.getString('Lowest')
        };

        this.get = function(key) {
          return priorities[key] || key;
        };
      }]);

})();
