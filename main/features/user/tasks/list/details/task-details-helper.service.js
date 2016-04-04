(function() {

  'use strict';

  angular
    .module('org.bonitasoft.features.user.tasks.details')
    .service('taskDetailsHelper', taskDetailsHelperService);

  function taskDetailsHelperService(taskListStore, preference, humanTaskAPI, ngToast, gettextCatalog) {

    return {
      takeReleaseTask: takeReleaseTask,
      initTab: initTab,
      saveSelectedTab: saveSelectedTab
    };

    /**
     * assigned a task to the current user
     * @return {object} a promise of an updated task
     */
    function takeReleaseTask(task) {
      /*jshint camelcase: false */
      var assignee;
      if (task.assigned_id === taskListStore.user.user_id) {
        assignee = '';
      } else {
        assignee = taskListStore.user.user_id;
      }

      return humanTaskAPI
        .update({
          id: task.id,
          'assigned_id': assignee
        })
        .$promise.then(function(_task) {
          task.assigned_id = _task.assigned_id;
        })
        .catch(function(error) {
          if(error.status === 403 || error.status === 404) {
            ngToast.create({
              className:'warning',
              content: gettextCatalog.getString('This task is not available anymore. The list is now up to date.')
            });
          }
        });
    }

    function initTab(scope) {
      scope.tab[(preference.get('lastTab') || 'context')] = true;
    }

    function saveSelectedTab(tab) {
      preference.set('lastTab', tab);
    }
  }

})();
