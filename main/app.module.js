(function() {

  'use strict';

  angular.module('org.bonitasoft.portal', [
    'ngCookies',
    'gettext',
    'ui.router',
    'angular-growl',
    'org.bonitasoft.service.features',
    'org.bonitasoft.common.i18n',
    'org.bonitasoft.common.resources',
    'org.bonitasoft.common.table.resizable',
    'org.bonitasoft.common.filters.stringTemplater',
    'org.bonitasoft.services.topurl',
    'ui.bootstrap',
    'ngAnimate',
    'org.bonitasoft.bonitable',
    'org.bonitasoft.bonitable.selectable',
    'org.bonitasoft.bonitable.repeatable',
    'org.bonitasoft.bonitable.sortable',
    'org.bonitasoft.bonitable.storable',
    'org.bonitasoft.bonitable.settings',
    'org.bonitasoft.templates',
    'as.sortable',
    'org.bonitasoft.common.filters.date.parser',
    'org.bonitasoft.service.applicationLink',
    'org.bonitasoft.common.resources.store',
    'org.bonitasoft.common.directives.bonitaHref',
    'org.bonitasoft.features.admin',
    'org.bonitasoft.features.user'
  ]);

})();
