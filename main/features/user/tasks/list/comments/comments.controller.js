(function() {
  'use strict';

  angular
    .module('org.bonitasoft.features.user.tasks.list.comments')
    .controller('UserTaskListCommentsCtrl', UserTaskListCommentsCtrl);

  function UserTaskListCommentsCtrl(commentsService, taskListStore, $state, comments) {
    var vm = this;
    vm.comments = comments;
    vm.addComment = addComment;
    vm.isCurrentCaseArchived = isCurrentCaseArchived;

    function addComment(content) {
      commentsService
        .add(taskListStore.user.id, taskListStore.currentCase.id, content)
        .then(function() {
          $state.reload($state.current.name);
        });
    }

    function isCurrentCaseArchived() {
      return !!taskListStore.currentCase.archivedDate;
    }
  }

})();
