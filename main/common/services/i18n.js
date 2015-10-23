/** Copyright (C) 2015 Bonitasoft S.A.
 * BonitaSoft, 31 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful);
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
  ]).value('I18N_KEYS', {})
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
    })
  .run(function(I18N_KEYS, gettextCatalog) {

    I18N_KEYS['caselist.delete.single'] = gettextCatalog.getString('1 case has been deleted');
    I18N_KEYS['caselist.delete.multiple'] = gettextCatalog.getString('{{nbOfDeletedCases}} cases have been deleted');
    I18N_KEYS['processDetails.informations.category.update.error'] = gettextCatalog.getString('An error occured during categories update');
    I18N_KEYS['processDetails.informations.category.update.sucess'] = gettextCatalog.getString('Successfully updated categories');
    I18N_KEYS['processDetails.actors.update.success'] = gettextCatalog.getString('{{nbSucess}} actor mapping updates succeeded');
    I18N_KEYS['processDetails.actors.update.error'] = gettextCatalog.getString('{{nbErrors}} errors on mapping updates');
    I18N_KEYS['multiSelect.selectAll'] = gettextCatalog.getString('Select all');
    I18N_KEYS['multiSelect.selectNone'] = gettextCatalog.getString('Select none');
    I18N_KEYS['multiSelect.reset'] = gettextCatalog.getString('Reset');
    I18N_KEYS['multiSelect.search.helper'] = gettextCatalog.getString('Type here to search...');
    I18N_KEYS['processDetails.actors.users.label'] = gettextCatalog.getString('Users');
    I18N_KEYS['processDetails.actors.users.mapping'] = gettextCatalog.getString('Users mapped to {}');
    I18N_KEYS['processDetails.actors.users.selectHelper'] = gettextCatalog.getString('Select users...');
    I18N_KEYS['processDetails.actors.groups.label'] = gettextCatalog.getString('Groups');
    I18N_KEYS['processDetails.actors.groups.mapping'] = gettextCatalog.getString('Groups');
    I18N_KEYS['processDetails.actors.groups.selectHelper'] = gettextCatalog.getString('Select groups...');
    I18N_KEYS['processDetails.actors.roles.label'] = gettextCatalog.getString('Roles');
    I18N_KEYS['processDetails.actors.roles.mapping'] = gettextCatalog.getString('Roles');
    I18N_KEYS['processDetails.actors.roles.selectHelper'] = gettextCatalog.getString('Select roles...');
    I18N_KEYS['processDetails.actors.memberships.label'] = gettextCatalog.getString('Memberships');
    I18N_KEYS['processDetails.actors.memberships.mapping'] = gettextCatalog.getString('Memberships mapped to {}');
    I18N_KEYS['processDetails.actors.memberships.selectGroupHelper'] = gettextCatalog.getString('Select a group...');
    I18N_KEYS['processDetails.actors.memberships.selectRoleHelper'] = gettextCatalog.getString('Select a role...');
    I18N_KEYS['processDetails.actors.memberships.item.label'] = gettextCatalog.getString('{{role}} of {{group}}');
    I18N_KEYS['processDetails.actors.memberships.create.success'] = gettextCatalog.getString('{{role}} of {{group}} has been created');
    I18N_KEYS['processDetails.pm.mapping.update.error'] = gettextCatalog.getString('{{nbMapping}} Process manager mappings could not be updated');
    I18N_KEYS['processDetails.pm.mapping.update.success'] = gettextCatalog.getString('{{nbMapping}} Process manager mappings have been updated');
    I18N_KEYS['processDetails.params.control.boolean'] = gettextCatalog.getString('Error: value must be a boolean');
    I18N_KEYS['processDetails.params.control.double'] = gettextCatalog.getString('Error: value must be a double');
    I18N_KEYS['processDetails.params.control.integer'] = gettextCatalog.getString('Error: value must be an integer');
    I18N_KEYS['processVisu.tooltip.error'] = gettextCatalog.getString('To use this feature, create a new version of the process in Bonita BPM Studio version 6.4 and above, then create and install the new .bar file in the Portal.');
    I18N_KEYS['processVisu.key.cancelled'] = gettextCatalog.getString('Cancelled, skipped instances');
    I18N_KEYS['processVisu.key.completed'] = gettextCatalog.getString('Completed instances');
    I18N_KEYS['processVisu.key.failed'] = gettextCatalog.getString('Failed instances');
    I18N_KEYS['processVisu.key.ongoing'] = gettextCatalog.getString('Executing, completing, initializing instances');
    I18N_KEYS['processVisu.key.pending'] = gettextCatalog.getString('Ready, waiting instances');
    I18N_KEYS['processVisu.case.title'] = gettextCatalog.getString('Case id: {{caseId}} - Process: {{processName}} ({{processVersion}})');
    I18N_KEYS['processVisu.drawing.error'] = gettextCatalog.getString('Error on drawing process!');
    I18N_KEYS['processVisu.drawing.inprogress'] = gettextCatalog.getString('Drawing process...');
    I18N_KEYS['monitoring.processList.empty'] = gettextCatalog.getString('No data');
    I18N_KEYS['monitoring.processList.error'] = gettextCatalog.getString('Error!');
    I18N_KEYS['monitoring.processVisu.loading'] = gettextCatalog.getString('Loading...');
    I18N_KEYS['monitoring.processList.http.error'] = gettextCatalog.getString('Technical error.');
    I18N_KEYS['processDetails.connector.upload.error'] = gettextCatalog.getString('Cannot upload the file');
    I18N_KEYS['processDetails.startFor.user.helper'] = gettextCatalog.getString('Type here to search for a user...');
    I18N_KEYS['processDetails.startFor.label'] = gettextCatalog.getString('Enter the user to start the case for...');
    I18N_KEYS['processDetails.forms.add.error'] = gettextCatalog.getString('Can\'t import page or form to the process');
    I18N_KEYS['processDetails.forms.mapping.empty'] = gettextCatalog.getString('No Mapping');
    I18N_KEYS['processDetails.forms.mapping.edit.empty'] = gettextCatalog.getString('Form cannot be empty');
    I18N_KEYS['processDetails.forms.upload.error.filename.length'] = gettextCatalog.getString('Filename too long. The zip filename must be no longer than 50 characters');
    I18N_KEYS['processDetails.forms.upload.error.file.structure'] = gettextCatalog.getString('Zip file structure error. Check that your .zip contains a well-formed page.properties and either the index.html or the Index.groovy file. For details, see the documentation or the example page readme (available in the custom page list)');
    I18N_KEYS['processDetails.forms.upload.error.name.already.exists'] = gettextCatalog.getString('A page with this name already exists.');
    I18N_KEYS['processDetails.forms.upload.error.filename.invalid'] = gettextCatalog.getString('The name for the URL must start with custompage_ followed only by alphanumeric characters.');
    I18N_KEYS['processDetails.forms.upload.error.compilation'] = gettextCatalog.getString('Compilation failure. Verify that the Index.groovy class implements the PageController interface.');
    I18N_KEYS['processDetails.problemResolution.message.actor'] = gettextCatalog.getString('Entity Mapping must be resolved before enabling the Process.');
    I18N_KEYS['processDetails.problemResolution.message.connector'] = gettextCatalog.getString('Connector definitions must be resolved before enabling the Process.');
    I18N_KEYS['processDetails.problemResolution.message.parameter'] = gettextCatalog.getString('Parameters must be resolved before enabling the Process.');
    I18N_KEYS['processDetails.problemResolution.message.businessData'] = gettextCatalog.getString('The business data: [ {} ] uses Business Objects which are not defined in the current Business Data model. Deploy a compatible Business Data model before enabling the process.');
    I18N_KEYS['processDetails.problemResolution.message.formMapping'] = gettextCatalog.getString('The following form mappings are not resolved: [ {} ]');
    I18N_KEYS['processDetails.problemResolution.title'] = gettextCatalog.getString('The Process cannot be enabled');
    I18N_KEYS['processDetails.problemResolution.resource.caseOverview'] = gettextCatalog.getString('Case overview');
    I18N_KEYS['processDetails.problemResolution.resource.caseStart'] = gettextCatalog.getString('Case start');
    I18N_KEYS['processDetails.scripts.update.success'] = gettextCatalog.getString('Expression content has been updated');
    I18N_KEYS['processDetails.scripts.update.error'] = gettextCatalog.getString('Can\'t update expression content');
    I18N_KEYS['application.edit.reservedTokenError'] = gettextCatalog.getString('The words \'content\', \'API\' and \'theme\' are reserved for internal use. They must not be used in an application or page URL.');
    I18N_KEYS['processDetails.start.success'] = gettextCatalog.getString('The case {{caseId}} has been started successfully.');
    I18N_KEYS['processDetails.start.error'] = gettextCatalog.getString('Error while trying to start the case. Some required information is missing (contract not fulfilled).');
  });
})();
