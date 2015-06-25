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
      path: ['id'],
    }, {
      name: 'Process name',
      path: ['processDefinitionId', 'name'],
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
      name: 'Failed Flow Nodes',
      path: ['failedFlowNodes'],
    }, {
      name: 'Pending Flow Nodes',
      path: ['activeFlowNodes'],
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
      appVersion: 'All',
      appName: 'All',
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
      path: ['processDefinitionId', 'name'],
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
