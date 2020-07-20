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
   * @name o.b.f.admin.cases.list.values
   *
   * @description
   * set values to uses by the different case list components
   */

  angular.module('org.bonitasoft.features.admin.cases.list.values', [])
    .value('casesColumns', [{
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
    }, {
      name: 'Failed Flow Nodes',
      path: ['failedFlowNodes']
    }, {
      name: 'Pending Flow Nodes',
      path: ['activeFlowNodes']
    }])
    .value('allCaseStatesValues', {
      started: 'Started',
      error: 'Failed',
      aborted: 'Aborted',
      completed: 'Completed',
      canceled: 'Canceled'
    })
    .value('caseStatesValues', {
      error: 'With failures'
    })
    .value('moreDetailToken', 'casemoredetailsadmin')
    .value('pageSizes', [25, 50, 100, 200])
    .value('defaultPageSize', 25)
    .value('defaultSort', 'id')
    .value('archivedDefaultSort', 'sourceObjectId')
    .value('defaultFilters', {
      processVersion: undefined,
      processName: undefined,
      caseStatus: 'All'
    })
    .value('defaultDeployedFields', ['processDefinitionId', 'started_by', 'startedBySubstitute'])
    .value('defaultActiveCounterFields', ['activeFlowNodes', 'failedFlowNodes'])
    .value('activedTabName', '')
    .value('archivedCasesColumns', [{
      name: 'ID',
      path: ['sourceObjectId'],
    }, {
      name: 'Process name',
      path: ['processDefinitionId', 'displayName'],
    }, {
      name: 'Version',
      path: ['processDefinitionId', 'version'],
    }, {
      name: 'Start date',
      path: ['start'],
    }, {
      name: 'Started by',
      path: ['started_by', 'userName'],
      defaultValue : 'System'
    }, {
      name: 'End date',
      path: ['end_date'],
    }, {
      name: 'State',
      path: ['state'],
    }])
    .
    value('archivedCaseStatesValues', {
      started: 'Started',
      error: 'Failed'
    })
    .value('archivedMoreDetailToken', 'archivedcasemoredetailsadmin')
    .value('archivedTabName', 'archived')
    .value('defaultArchivedCounterFields', []);
})();
