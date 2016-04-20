(function() {
  'use strict';

  angular
    .module('org.bonitasoft.features.user.tasks.list.comments')
    .controller('UserTaskListCommentsCtrl', UserTaskListCommentsCtrl);

  function UserTaskListCommentsCtrl(commentsService, taskListStore, ngToast, gettextCatalog, $scope) {
    var vm = this;
    vm.addComment = addComment;
    vm.isCurrentCaseOpened = isCurrentCaseOpened;
    vm.newComment = '';

    $scope.$watch(function() {
      return vm.case;
    }, function(newCase) {
      vm.newComment = '';
      commentsService.getHumanCommentsForCase(newCase).then(function(data) {
        vm.comments = data;
      });
    }, true);

    function addComment(content) {
      commentsService
        .add(taskListStore.user.id, vm.case.id, content)
        .then(function() {
          return commentsService.getHumanCommentsForCase(vm.case);
        }).then(function(data) {
          vm.comments = data;
        }, function() {
          ngToast.create({
            className:'danger',
            content: gettextCatalog.getString('Unable to add the comment. Refresh your task list and try again. ' +
            'If the problem persists, contact your administrator')
          });
        }).finally(function() {
          vm.newComment = '';
        });
    }

    function isCurrentCaseOpened() {
      return vm.case && !angular.isDefined(vm.case.archivedDate);
    }
  }

})();
