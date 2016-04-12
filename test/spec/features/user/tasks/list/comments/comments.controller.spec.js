(function() {

  'use strict';

  describe('Comment controller', () => {

    let taskListStore, controller, commentsService, $q, $rootScope;

    beforeEach(module('org.bonitasoft.features.user.tasks.list.comments'));

    beforeEach(inject(function(_taskListStore_, $controller, _commentsService_, _$q_, _$rootScope_) {
      taskListStore = _taskListStore_;
      commentsService = _commentsService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
      controller = $controller('UserTaskListCommentsCtrl', {
        commentsService: commentsService,
        $scope: $rootScope.$new()
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

    it('should add a comment and reload comments', function() {
      taskListStore.user = {id: 4};
      taskListStore.currentCase = {id: 2};
      spyOn(commentsService, 'add').and.returnValue($q.when());
      spyOn(commentsService, 'getHumanCommentsForCase').and.returnValue($q.when());

      controller.addComment('hello this is a comment');
      $q.resolve();
      $rootScope.$apply();

      expect(commentsService.add).toHaveBeenCalledWith(4, 2, 'hello this is a comment');
      expect(commentsService.getHumanCommentsForCase).toHaveBeenCalledWith({ id: 2 });
    });

    it('should update comments when case change', function() {
      spyOn(commentsService, 'getHumanCommentsForCase').and.callFake(function(aCase) {
        return aCase.id === 2 ? $q.when(['Comment1 for case 2', 'Comment2 for case 2']) : $q.when([]);
      });

      controller.case = {id: 4};
      $rootScope.$apply();
      expect(controller.comments).toEqual([]);

      controller.case = {id: 2};
      $rootScope.$apply();
      expect(controller.comments).toEqual(['Comment1 for case 2', 'Comment2 for case 2']);
    });
  });

})();


