/** Copyright (C) 2015 Bonitasoft S.A.
 * BonitaSoft, 31 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/* jshint sub:true*/
(function () {
  'use strict';

  angular.module('org.bonitasoft.services.i18n', [
    'ngCookies',
    'gettext',
    'org.bonitasoft.common.resources'
  ]).value('I18N_KEYS', {
    'caselist.delete.single': '1 case has been deleted',
    'caselist.delete.multiple': '{{nbOfDeletedCases}} cases have been deleted',
    'processDetails.informations.category.update.error': 'An error occured during categories update',
    'processDetails.informations.category.update.sucess': 'Successfully updated categories',
    'processDetails.actors.update.success': '{{nbSucess}} actor mapping updates succeeded',
    'processDetails.actors.update.error': '{{nbErrors}} errors on mapping updates',
    'multiSelect.selectAll': 'Select all',
    'multiSelect.selectNone': 'Select none',
    'multiSelect.reset': 'Reset',
    'multiSelect.search.helper': 'Type here to search...',
    'processDetails.actors.users.label': 'Users',
    'processDetails.actors.users.mapping': 'Users mapped to {}',
    'processDetails.actors.users.selectHelper': 'Select users...',
    'processDetails.actors.groups.label': 'Groups',
    'processDetails.actors.groups.mapping': 'Groups',
    'processDetails.actors.groups.selectHelper': 'Select groups...',
    'processDetails.actors.roles.label': 'Roles',
    'processDetails.actors.roles.mapping': 'Roles',
    'processDetails.actors.roles.selectHelper': 'Select roles...',
    'processDetails.actors.memberships.label': 'Memberships',
    'processDetails.actors.memberships.mapping': 'Memberships mapped to {}',
    'processDetails.actors.memberships.selectGroupHelper': 'Select a group...',
    'processDetails.actors.memberships.selectRoleHelper': 'Select a role...',
    'processDetails.actors.memberships.item.label': '{{role}} of {{group}}',
    'processDetails.actors.memberships.create.success': '{{role}} of {{group}} has been created',
    'processDetails.pm.mapping.update.error': '{{nbMapping}} Process manager mappings could not be updated',
    'processDetails.pm.mapping.update.success': '{{nbMapping}} Process manager mappings have been updated',
    'processDetails.params.control.boolean': 'Error: value must be a boolean',
    'processDetails.params.control.double': 'Error: value must be a double',
    'processDetails.params.control.integer': 'Error: value must be an integer',
    'processVisu.tooltip.error': 'To use this feature, create a new version of the process in Bonita BPM Studio version 6.4 and above, then create and install the new .bar file in the Portal.',
    'processVisu.key.cancelled': 'Cancelled, skipped instances',
    'processVisu.key.completed': 'Completed instances',
    'processVisu.key.failed': 'Failed instances',
    'processVisu.key.ongoing': 'Executing, completing, initializing instances',
    'processVisu.key.pending': 'Ready, waiting instances',
    'processVisu.case.title': 'Case id: {{caseId}} - Process: {{processName}} ({{processVersion}})',
    'processVisu.drawing.error': 'Error on drawing process!',
    'processVisu.drawing.inprogress': 'Drawing process...',
    'monitoring.processList.empty': 'No data',
    'monitoring.processList.error': 'Error!',
    'monitoring.processVisu.loading': 'Loading...',
    'monitoring.processList.http.error': 'Technical error.',
    'processDetails.connector.upload.error': 'Cannot upload the file',
    'processDetails.startFor.user.helper': 'Type here to search for a user...',
    'processDetails.startFor.label': 'Enter the user to start the case for...',
    'processDetails.forms.add.error': 'Can\'t import page or form to the process',
    'processDetails.forms.mapping.empty': 'No Mapping',
    'processDetails.forms.mapping.edit.empty': 'Form cannot be empty',
    'processDetails.forms.upload.error.filename.length': 'Filename too long. The zip filename must be no longer than 50 characters',
    'processDetails.forms.upload.error.file.structure': 'Zip file structure error. Check that your .zip contains a well-formed page.properties and either the index.html or the Index.groovy file. For details, see the documentation or the example page readme (available in the custom page list)',
    'processDetails.forms.upload.error.name.already.exists': 'A page with this name already exists.',
    'processDetails.forms.upload.error.filename.invalid': 'The name for the URL must start with custompage_ followed only by alphanumeric characters.',
    'processDetails.forms.upload.error.compilation': 'Compilation failure. Verify that the Index.groovy class implements the PageController interface.',
    'processDetails.problemResolution.message.actor': 'Entity Mapping must be resolved before enabling the Process.',
    'processDetails.problemResolution.message.connector': 'Connector definitions must be resolved before enabling the Process.',
    'processDetails.problemResolution.message.parameter': 'Parameters must be resolved before enabling the Process.',
    'processDetails.problemResolution.message.businessData': 'The business data: [ {} ] uses Business Objects which are not defined in the current Business Data model. Deploy a compatible Business Data model before enabling the process.',
    'processDetails.problemResolution.message.formMapping': 'The following form mappings are not resolved: [ {} ]',
    'processDetails.problemResolution.title': 'The Process cannot be enabled',
    'processDetails.problemResolution.resource.caseOverview': 'Case overview',
    'processDetails.problemResolution.resource.caseStart': 'Case start',
    'processDetails.scripts.update.success': 'Expression content has been updated',
    'processDetails.scripts.update.error': 'Can\'t update expression content',
    'application.edit.reservedTokenError': 'The words \'content\', \'API\' and \'theme\' are reserved for internal use. They must not be used in an application or page URL.',
    'processDetails.start.success': 'The case {{caseId}} has been started successfully.',
    'processDetails.start.error': 'Error while trying to start the case. Some required information is missing (contract not fulfilled).'
  })
    .service('i18nService', function (gettextCatalog, $cookies, i18nAPI, I18N_KEYS) {
      var i18n = {};
      function arrayToObject(array) {
        var object = {};
        for (var i = 0; i < array.length; i++) {
          object[array[i].key] = array[i].value;
        }
        return object;
      }

      function updateCatalog(catalog) {
        gettextCatalog.currentLanguage = $cookies['BOS_Locale'];
        gettextCatalog.baseLanguage = null;
        gettextCatalog.setStrings($cookies['BOS_Locale'], arrayToObject(catalog));
      }

      gettextCatalog.debug = false;

      i18n.getKey = function(key, context){
        return gettextCatalog.getString(I18N_KEYS[key] || key, context);
      };

      i18n.translationsLoadPromise = (function() {
        return i18nAPI.query({
          f: 'locale=' + ($cookies['BOS_Locale'] || 'en')
        }).$promise.then(updateCatalog);
      })();
      return i18n;
    });
})();
