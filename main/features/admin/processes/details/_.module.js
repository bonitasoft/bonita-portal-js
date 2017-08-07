(function () {
  'use strict';

  angular
    .module('org.bonitasoft.features.admin.processes.details', [
      'ngAnimate',
      'ui.router',
      'ui.bootstrap',
      'gettext',
      'org.bonitasoft.service.token',
      'angular-growl',
      'org.bonitasoft.services.topurl',
      'org.bonitasoft.common.directives.bonitaHref',
      'org.bonitasoft.common.directives.toggleButton',
      'org.bonitasoft.common.resources',
      'org.bonitasoft.features.admin.processes.details.actorMapping',
      'org.bonitasoft.features.admin.processes.editActorMembers',
      'org.bonitasoft.services.topurl',
      'org.bonitasoft.features.admin.processes.details.information',
      'org.bonitasoft.features.admin.processes.details.processConnectors',
      'org.bonitasoft.features.admin.processes.details.params',
      'org.bonitasoft.service.process.resolution',
      'org.bonitasoft.common.filters.stringTemplater'
    ]);

})();
