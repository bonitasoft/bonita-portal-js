(function() {
  'use strict';

  angular
    .module('org.bonitasoft.features.user.tasks.list')
    .config(taskListRoutes);

  function taskListRoutes($stateProvider) {

    $stateProvider
      .state('bonita.userTasks', {
        url: '/user/tasks/list',
        templateUrl: 'portalTemplates/user/tasks/list/tasks-list.html'
      })
      .state('bonita.userTasks.comment', {
        params:  { case: {} },
        templateUrl: 'portalTemplates/user/tasks/list/comments/comments.html',
        controller: 'UserTaskListCommentsCtrl',
        controllerAs: 'vm',
        resolve: {
          comments: function(commentsService, $stateParams) {
            if ($stateParams.case.archivedDate) {
              return commentsService.getArchivedHumanCommentsForCase($stateParams.case.rootCaseId)
                .then(function(data) {
                  return data;
                });
            } else {
              return commentsService.getHumanCommentsForCase($stateParams.case.id)
                .then(function(data) {
                  return data;
                });
            }
          }
        }
      }
    );
  }

})();
