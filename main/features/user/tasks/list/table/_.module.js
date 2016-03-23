(function() {

  'use strict';

  angular
    .module('org.bonitasoft.features.user.tasks.list.table', [
      'ui.router',
      'org.bonitasoft.common.moment',
      'org.bonitasoft.features.user.tasks.app.config',
      'org.bonitasoft.features.user.tasks.app.pref',
      'org.bonitasoft.features.user.tasks.app.store',
      'org.bonitasoft.features.user.tasks.app.priorities',
      'org.bonitasoft.bonitable',
      'org.bonitasoft.bonitable.selectable',
      'org.bonitasoft.bonitable.sortable',
      'org.bonitasoft.bonitable.repeatable',
      'org.bonitasoft.bonitable.settings',
      'ui.focus',
      'common.filters',
      'ui.bootstrap.pagination',
      'ui.bootstrap.dropdown',
      'keymaster',
      'gettext'
    ]);


})();
