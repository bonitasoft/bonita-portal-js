(function() {
  'use strict';

  angular
    .module('org.bonitasoft.features.user.tasks.list.comments')
    .controller('UserTaskListCommentsCtrl', UserTaskListCommentsCtrl);

  function UserTaskListCommentsCtrl(commentsService, taskListStore, $scope) {
    var vm = this;
    vm.addComment = addComment;
    vm.isCurrentCaseOpened = isCurrentCaseOpened;

    $scope.$watch(function() {
      return vm.case;
    }, function(newCase) {
      commentsService.getHumanCommentsForCase(newCase).then(function(data) {
        vm.comments = data;
      });
    }, true);

    function addComment(content) {
      commentsService
        .add(taskListStore.user.id, taskListStore.currentCase.id, content)
        .then(function() {
          return commentsService.getHumanCommentsForCase(taskListStore.currentCase);
        }).then(function(data) {
          vm.comments = data;
        });
    }

    function isCurrentCaseOpened() {
      return taskListStore.currentCase && !angular.isDefined(taskListStore.currentCase.archivedDate);
    }
  }

})();
