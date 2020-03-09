(function() {

  'use strict';

  angular
    .module('org.bonitasoft.common.i18n')
    .value('I18N_KEYS', {})
    .run(function(I18N_KEYS, gettext) {
      I18N_KEYS['caselist.casesStates.active.title'] = gettext('Open cases');
      I18N_KEYS['caselist.casesStates.archived.title'] = gettext('Archived cases');
      I18N_KEYS['caselist.delete.single'] = gettext('1 case has been deleted');
      I18N_KEYS['caselist.delete.multiple'] = gettext('{{nbOfDeletedCases}} cases have been deleted');
      I18N_KEYS['processDetails.informations.category.update.error'] = gettext('An error occured during categories update');
      I18N_KEYS['processDetails.actors.update.success'] = gettext('{{nbSucess}} actor mapping updates succeeded');
      I18N_KEYS['processDetails.actors.update.error'] = gettext('{{nbErrors}} errors on mapping updates');
      I18N_KEYS['multiSelect.selectAll'] = gettext('Select all');
      I18N_KEYS['multiSelect.selectNone'] = gettext('Select none');
      I18N_KEYS['multiSelect.reset'] = gettext('Reset');
      I18N_KEYS['multiSelect.search.helper'] = gettext('Type here to search...');
      I18N_KEYS['processDetails.actors.users.label'] = gettext('Users');
      I18N_KEYS['processDetails.actors.users.mapping'] = gettext('Users mapped to {}');
      I18N_KEYS['processDetails.actors.users.selectHelper'] = gettext('Select users...');
      I18N_KEYS['processDetails.actors.groups.label'] = gettext('Groups');
      I18N_KEYS['processDetails.actors.groups.mapping'] = gettext('Groups');
      I18N_KEYS['processDetails.actors.groups.selectHelper'] = gettext('Select groups...');
      I18N_KEYS['processDetails.actors.roles.label'] = gettext('Roles');
      I18N_KEYS['processDetails.actors.roles.mapping'] = gettext('Roles');
      I18N_KEYS['processDetails.actors.roles.selectHelper'] = gettext('Select roles...');
      I18N_KEYS['processDetails.actors.memberships.label'] = gettext('Memberships');
      I18N_KEYS['processDetails.actors.memberships.mapping'] = gettext('Memberships mapped to {}');
      I18N_KEYS['processDetails.actors.memberships.selectGroupHelper'] = gettext('Select a group...');
      I18N_KEYS['processDetails.actors.memberships.selectRoleHelper'] = gettext('Select a role...');
      I18N_KEYS['processDetails.actors.memberships.item.label'] = gettext('{{role}} of {{group}}');
      I18N_KEYS['processDetails.actors.memberships.create.success'] = gettext('{{role}} of {{group}} has been created');
      I18N_KEYS['processDetails.pm.mapping.update.error'] = gettext('{{nbMapping}} Process manager mappings could not be updated');
      I18N_KEYS['processDetails.pm.mapping.update.success'] = gettext('{{nbMapping}} Process manager mappings have been updated');
      I18N_KEYS['processDetails.params.control.boolean'] = gettext('Error: value must be a boolean');
      I18N_KEYS['processDetails.params.control.double'] = gettext('Error: value must be a double');
      I18N_KEYS['processDetails.params.control.integer'] = gettext('Error: value must be an integer');
      I18N_KEYS['processVisu.tooltip.error'] = gettext('To use this feature, create a new version of the process in Bonita Studio version 6.4 and above, then create and install the new .bar file in the Portal.');
      I18N_KEYS['processVisu.key.cancelled'] = gettext('Cancelled, skipped instances');
      I18N_KEYS['processVisu.key.completed'] = gettext('Completed instances');
      I18N_KEYS['processVisu.key.failed'] = gettext('Failed instances');
      I18N_KEYS['processVisu.key.ongoing'] = gettext('Executing, completing, initializing instances');
      I18N_KEYS['processVisu.key.pending'] = gettext('Ready, waiting instances');
      I18N_KEYS['processVisu.case.title'] = gettext('Case id: {{caseId}} - Process: {{processName}} ({{processVersion}})');
      I18N_KEYS['processVisu.drawing.error'] = gettext('Error on drawing process!');
      I18N_KEYS['processVisu.drawing.inprogress'] = gettext('Drawing process...');
      I18N_KEYS['monitoring.processList.empty'] = gettext('No data');
      I18N_KEYS['monitoring.processList.error'] = gettext('Error!');
      I18N_KEYS['monitoring.processVisu.loading'] = gettext('Loading...');
      I18N_KEYS['monitoring.processList.http.error'] = gettext('Technical error.');
      I18N_KEYS['processDetails.connector.upload.error'] = gettext('Cannot upload the file');
      I18N_KEYS['processDetails.startFor.user.helper'] = gettext('Type here to search for a user...');
      I18N_KEYS['processDetails.startFor.label'] = gettext('Enter the user to start the case for...');
      I18N_KEYS['processDetails.forms.add.error'] = gettext('Can\'t import page or form to the process');
      I18N_KEYS['processDetails.forms.upload.error.filename.length'] = gettext('Filename too long. The zip filename must be no longer than 50 characters');
      I18N_KEYS['processDetails.forms.upload.error.file.structure'] = gettext('Zip file structure error. Check that your .zip contains a well-formed page.properties and either the index.html or the Index.groovy file. For details, see the documentation or the example page readme (available in the custom page list)');
      I18N_KEYS['processDetails.forms.upload.error.name.already.exists'] = gettext('A page with this name already exists.');
      I18N_KEYS['processDetails.forms.upload.error.filename.invalid'] = gettext('The name for the URL must start with custompage_ followed only by alphanumeric characters.');
      I18N_KEYS['processDetails.forms.upload.error.compilation'] = gettext('Compilation failure. Verify that the Index.groovy class implements the PageController interface.');
      I18N_KEYS['processDetails.problemResolution.message.actor'] = gettext('Actors must be resolved before enabling the Process.');
      I18N_KEYS['processDetails.problemResolution.message.connector'] = gettext('Connectors must be resolved before enabling the Process.');
      I18N_KEYS['processDetails.problemResolution.message.parameter'] = gettext('Parameters must be resolved before enabling the Process.');
      I18N_KEYS['processDetails.problemResolution.message.businessData'] = gettext('The business data: [ {} ] uses Business Objects which are not defined in the current Business Data model. Deploy a compatible Business Data model before enabling the process.');
      I18N_KEYS['processDetails.problemResolution.message.formMapping'] = gettext('The form mappings must be resolved before enabling the Process.');
      I18N_KEYS['processDetails.problemResolution.title'] = gettext('This process is not fully configured.');
      I18N_KEYS['processDetails.problemResolution.resource.caseOverview'] = gettext('Case overview');
      I18N_KEYS['processDetails.problemResolution.resource.caseStart'] = gettext('Case start');
      I18N_KEYS['processDetails.scripts.update.success'] = gettext('Expression content has been updated');
      I18N_KEYS['processDetails.scripts.update.error'] = gettext('Can\'t update expression content');
      I18N_KEYS['application.edit.reservedTokenError'] = gettext('The words \'content\', \'API\' and \'theme\' are reserved for internal use. They must not be used in an application or page URL.');
      I18N_KEYS['processDetails.start.success'] = gettext('The case {{caseId}} has been started successfully.');
      I18N_KEYS['processDetails.start.error'] = gettext('Error while trying to start the case. Some required information is missing (contract not fulfilled).');
      I18N_KEYS['processDetails.state.button.enable'] = gettext('Enable');
      I18N_KEYS['processDetails.state.button.disable'] = gettext('Disable');
    });

})();
