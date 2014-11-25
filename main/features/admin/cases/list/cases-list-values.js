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
      sortName: 'id',
      path: ['id'],
      selected: true,
      align: 'right',
      linkToCase: true
    }, {
      name: 'Process name',
      sortName: 'name',
      path: ['processDefinitionId', 'name'],
      selected: true,
      linkToProcess: true
    }, {
      name: 'Version',
      path: ['processDefinitionId', 'version'],
      selected: true
    }, {
      name: 'Start date',
      sortName: 'startDate',
      path: ['start'],
      selected: true,
      date: true
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
      started: 'Healthy',
      error: 'With failures'
    })
    .value('moreDetailToken', 'casemoredetailsadmin')
    .value('pageSizes', [25, 50, 100, 200])
    .value('defaultPageSize', 25)
    .value('defaultSort', 'id')
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
      sortName: 'id',
      path: ['sourceObjectId'],
      selected: true,
      align: 'right',
      linkToCase: true
    }, {
      name: 'Process name',
      sortName: 'name',
      path: ['processDefinitionId', 'name'],
      selected: true,
      linkToProcess: true
    }, {
      name: 'Version',
      path: ['processDefinitionId', 'version'],
      selected: true
    }, {
      name: 'Start date',
      sortName: 'startDate',
      path: ['start'],
      selected: true,
      date: true
    }, {
      name: 'Started by',
      path: ['started_by', 'userName'],
      selected: true,
      defaultValue : 'System'
    }, {
      name: 'End date',
      sortName: 'endDate',
      path: ['end_date'],
      selected: true,
      date: true
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
