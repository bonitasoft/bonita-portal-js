(function() {

  'use strict';

  angular
    .module('org.bonitasoft.features.user.tasks.list.comments')
    .service('commentsService', commentsService);

  function commentsService($q, commentAPI, archivedCommentAPI) {

    return {
      getHumanCommentsForCase: getHumanCommentsForCase,
      add: addComment
    };

    function getHumanCommentsForCase(aCase) {
      if (!aCase) {
        return $q.when([]);
      }

      var api = commentAPI;
      var caseId = aCase.id;

      if (isArchived(aCase)) {
        api = archivedCommentAPI;
        caseId = aCase.rootCaseId;
      }

      return getHumanComments(api, caseId);
    }

    function isArchived(aCase) {
      return angular.isDefined(aCase.archivedDate);
    }

    function getHumanComments(api, caseId) {
      var promise = api.search({
        f: ['processInstanceId=' + caseId],
        c: 2147483647,   // java Integer.MAX_INT
        p: 0,
        d: 'userId',
        o: 'postDate ASC'
      }).$promise;

      return promise.then(function(response) {
        return (response.data || [])
          .filter(function(comment) {
            return comment.userId.userName !== 'System';
          });
      });
    }

    function addComment(authorId, caseId, content) {
      return commentAPI.save({
        userId: authorId,
        processInstanceId: caseId,
        content: content
      }).$promise;
    }
  }

})();
