(function() {
  'use strict';
  /**
   * @ngdoc overview
   * @name o.b.f.admin.cases.list.values
   *
   * @description
   * set values to uses by the different case list components
   */

  angular.module('org.bonita.features.admin.cases.list.values', [])
    .value('casesColumns', [{
      name: 'ID',
      path: ['id'],
      selected: true
    }, {
      name: 'Process name',
      path: ['processDefinitionId', 'name'],
      selected: true
    }, {
      name: 'Version',
      path: ['processDefinitionId', 'version'],
      selected: true
    }, {
      name: 'Start date',
      path: ['start'],
      selected: true
    }, {
      name: 'Started by',
      path: ['started_by', 'userName'],
      selected: true,
      defaultValue : 'System'
    }, {
      name: 'Failed Flow Nodes',
      path: ['failedFlowNodes'],
      selected: true
    }, {
      name: 'Pending Flow Nodes',
      path: ['activeFlowNodes'],
      selected: true
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
      selected: true
    }, {
      name: 'Process name',
      path: ['processDefinitionId', 'name'],
      selected: true
    }, {
      name: 'Version',
      path: ['processDefinitionId', 'version'],
      selected: true
    }, {
      name: 'Start date',
      path: ['start'],
      selected: true
    }, {
      name: 'Started by',
      path: ['started_by', 'userName'],
      selected: true,
      defaultValue : 'System'
    }, {
      name: 'End date',
      path: ['end_date'],
      selected: true
    }, {
      name: 'State',
      path: ['state'],
      selected: true
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
