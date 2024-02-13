(function() {
  'use strict';

  angular
    .module('org.bonitasoft.features.user.tasks.list.comments')
    .directive('comments', comments);

  function comments() {

    return {
      scope : true,
      bindToController: {
        case: '='
      },
      templateUrl: 'portalTemplates/user/tasks/list/comments/comments.html',
      controller: 'UserTaskListCommentsCtrl',
      controllerAs: 'vm'
    };
  }

})();
