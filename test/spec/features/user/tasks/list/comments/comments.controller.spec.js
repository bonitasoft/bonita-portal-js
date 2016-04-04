(function() {
  'use strict';

  describe('Comment controller', () => {

    let taskListStore, controller, commentsService, $q, $state, $rootScope;

    beforeEach(module('org.bonitasoft.features.user.tasks.list.comments'));

    beforeEach(inject(function(_taskListStore_, $controller, _commentsService_, _$q_, _$state_, _$rootScope_) {
      taskListStore = _taskListStore_;
      commentsService = _commentsService_;
      $q = _$q_;
      $state = _$state_;
      $rootScope = _$rootScope_;
      controller = $controller('UserTaskListCommentsCtrl', {
        comments: [],
        commentsService: commentsService,
        $state: $state
      });
    }));

    it('should tell is current case is archived or not', function() {
      taskListStore.currentCase = undefined;
      expect(controller.isCurrentCaseOpened()).toBeFalsy();

      taskListStore.currentCase = {};
      expect(controller.isCurrentCaseOpened()).toBeTruthy();

      taskListStore.currentCase = {archivedDate: '2016-04-04 10:46:54.146'};
      expect(controller.isCurrentCaseOpened()).toBeFalsy();
    });

    it('should add a comment and reload current state', function() {
      taskListStore.user = {id: 4};
      taskListStore.currentCase = {id: 2};
      $state.current = {name: 'bonita.userTasks.comment'};
      spyOn(commentsService, 'add').and.returnValue($q.when());
      spyOn($state, 'reload');

      controller.addComment('hello this is a comment');
      $q.resolve();
      $rootScope.$apply();

      expect(commentsService.add).toHaveBeenCalledWith(4, 2, 'hello this is a comment');
      expect($state.reload).toHaveBeenCalledWith('bonita.userTasks.comment');
    });
  });

})();

