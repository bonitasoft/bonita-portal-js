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

(function() {
  'use strict';
  /**
   * @ngdoc overview
   * @name o.b.f.user.cases.list.values
   *
   * @description
   * set values to uses by the different case list components
   */

  angular.module('org.bonitasoft.features.user.cases.list.values', [])
    .value('casesUserColumns', [{
      name: 'ID',
      path: ['id']
    }, {
      name: 'Process name',
      path: ['processDefinitionId', 'displayName']
    }, {
      name: 'Version',
      path: ['processDefinitionId', 'version']
    }, {
      name: 'Start date',
      path: ['start']
    }, {
      name: 'Started by',
      path: ['started_by', 'userName'],
      defaultValue : 'System'
    }])
    .value('caseStatesUserValues', {
      Me: gettext('Me')
    })
    .value('moreUserDetailToken', 'casemoredetails')
    .value('pageSizes', [25, 50, 100, 200])
    .value('defaultPageSize', 25)
    .value('defaultColumnSettings', [
      true, //'id'
      true, //'Process name'
      false, //'Version'
      true, //'Start date'
      true, //'Started by'
      true, //'Available tasks' or 'En dtae' (archived)
      true, //'Search index 1'
      false, //'Search index 2'
      false, //'Search index 3'
      false, //'Search index 4'
      false //'Search index 5'
    ])
    .value('defaultSort', 'id')
    .value('archivedDefaultSort', 'sourceObjectId')
    .value('defaultUserFilters', {
      appName: gettext('All'),
      startedBy: gettext('Anyone')
    })
    .value('defaultDeployedFields', ['processDefinitionId', 'started_by', 'startedBySubstitute'])
    .value('defaultActiveCounterFields', ['activeFlowNodes', 'failedFlowNodes'])
    .value('activedTabName', '')
    .value('archivedCasesColumns', [{
      name: 'ID',
      path: ['sourceObjectId']
    }, {
      name: 'Process name',
      path: ['processDefinitionId', 'displayName']
    }, {
      name: 'Version',
      path: ['processDefinitionId', 'version']
    }, {
      name: 'Start date',
      path: ['start']
    }, {
      name: 'Started by',
      path: ['started_by', 'userName'],
      defaultValue : gettext('System')
    }, {
      name: 'End date',
      path: ['end_date']
    }, {
      name: 'State',
      path: ['state']
    }])
    .
    value('archivedCaseStatesValues', {
      started: gettext('Started'),
      error: gettext('Failed')
    })
    .value('archivedUserMoreDetailToken', 'archivedcasemoredetails')
    .value('archivedTabName', 'archived')
    .value('defaultArchivedCounterFields', []);


    /**
     * Noop function that allow strings to be extracted by gettext while generating po file
     */
    function gettext(string) {
      return string;
    }
})();
