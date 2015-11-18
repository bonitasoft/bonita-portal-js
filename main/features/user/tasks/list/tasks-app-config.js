(function() {
  'use strict';
  /**
   * module that contains taskapp API related config
   */
  angular
    .module('org.bonitasoft.features.user.tasks.app.config', ['org.bonitasoft.common.resources'])
  /**
   * TASK_FILTERS associates API ressource with predifined filters parameters.
   * @see taskapp.TaskFilters
   * @return {Object}
   */
  .service('TASK_FILTERS', [
    'humanTaskAPI',
    'archivedHumanTaskAPI',
    function(humanTaskAPI, archivedHumanTaskAPI) {
      return {
        TODO: {
          title: 'Todo',
          resource: humanTaskAPI,
          filters: ['state=ready', 'user_id=%userId']
        },
        MY_TASK: {
          title: 'My tasks',
          resource: humanTaskAPI,
          filters: ['state=ready', 'assigned_id=%userId']
        },
        POOL_TASK: {
          title: 'Available tasks',
          resource: humanTaskAPI,
          filters: ['state=ready', 'assigned_id=0', 'user_id=%userId']
        },
        DONE: {
          title: 'Done tasks',
          resource: archivedHumanTaskAPI,
          filters: ['assigned_id=%userId']
        }
      };
    }
  ])
  /**
   * DEFAULT_DETAILS
   * @type {String}
   * @constant use to show context task
   */
  .constant('DEFAULT_DETAILS', true)
  /**
   * max : default visible task fields id for list only view
   * mid: default visible task fields id for list + details view
   * min: default visible task fields id for phone view  (max 991px)
   */
  .constant('COLUMNS_SETTINGS', {
    'min': [
      false, //'id'
      true, //'displayName'
      false, //'displayDescription'
      true, //'caseId'
      false, //'rootContainerId.name'
      false, //'last_update_date'
      false, //'assigned_date'
      true, //'dueDate'
      false, //'priority'
    ],
    'mid': [
      false, //'id'
      true, //'displayName'
      false, //'displayDescription'
      false, //'caseId'
      true, //'rootContainerId.name'
      false, //'last_update_date'
      false, //'assigned_date'
      true, //'dueDate'
      true, //'priority'
    ],
    'max': [
      true, //'id',
      true, //'displayName',
      false, //'displayDescription',
      true, //'caseId,
      true, //'rootContainerId.name',
      true, //'last_update_date',
      false, //'assigned_date',
      true, //'dueDate',
      true, //'priority',
    ]
  });

})();
