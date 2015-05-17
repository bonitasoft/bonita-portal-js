(function() {
  'use strict';
  describe('ProcessInformationCtrl', function() {
    var scope, actorMappingCtrl, process, modal, growl, controller, log, actorMemberAPI, actorAPI, q, processActors, ActorMappingService;

    beforeEach(module('org.bonitasoft.features.admin.processes.details.actorMapping'));

    beforeEach(inject(function($rootScope, $controller, $q) {
      scope = $rootScope.$new();
      q = $q;
      processActors = ['actor1', 'actor2'];
      process = {
        id: 123
      };
      log = jasmine.createSpyObj('$log', ['error']);
      growl = jasmine.createSpyObj('$growl', ['error', 'success']);
      modal = jasmine.createSpyObj('$modal', ['open']);
      actorAPI = jasmine.createSpyObj('actorAPI', ['method name']);
      actorMemberAPI = jasmine.createSpyObj('actorMemberAPI', ['update']);
      ActorMappingService = jasmine.createSpyObj('ActorMappingService', ['getMembersForAnActor', 'getMemberForActorProfile']);
      controller = $controller;
      actorMappingCtrl = controller('ActorsMappingCtrl', {
        $scope: scope,
        $modal: modal,
        process: process,
        actorMemberAPI: actorMemberAPI,
        actorAPI: actorAPI,
        growl: growl,
        $log: log,
        processActors: processActors,
        ActorMappingService: ActorMappingService
      });
    }));
    it('should open modal on actor edition, display success message on success and refresh process and appropriate actor', function() {
      var deferred = q.defer();
      scope.$emit = jasmine.createSpy();
      modal.open.and.returnValue({result: deferred.promise});
      actorMappingCtrl.editMapping('actor1', 'users');

      expect(modal.open.calls.count()).toEqual(1);
      var options = modal.open.calls.mostRecent().args[0];
      expect(options.size).toBe('lg');
      expect(options.templateUrl).toBe('features/admin/processes/details/edit-actor-members.html');
      expect(options.controller).toBe('EditActorMembersCtrl');
      expect(options.controllerAs).toBe('editActorMembersCtrl');
      expect(options.resolve.process()).toBe(process);
      expect(options.resolve.memberType()).toEqual('USER');
      expect(options.resolve.actor()).toEqual('actor1');
      deferred.resolve([null, undefined, 'actor1', 'actor2']);
      scope.$apply();
      expect(growl.success).toHaveBeenCalledWith('2 actor mapping updates succeeded', jasmine.any(Object));
      expect(scope.$emit).toHaveBeenCalledWith('process.refresh');
      expect(ActorMappingService.getMemberForActorProfile).toHaveBeenCalledWith('actor1', actorMappingCtrl.actorProfiles.users);
    });

    it('should open modal on actor edition, display error message on failure and refresh process and appropriate actor', function() {
      var deferred = q.defer();
      scope.$emit = jasmine.createSpy();
      modal.open.and.returnValue({result: deferred.promise});
      actorMappingCtrl.editMapping('actor1', 'users');

      deferred.reject(['impossible to save']);
      scope.$apply();
      expect(growl.error).toHaveBeenCalledWith('1 errors on mapping updates', jasmine.any(Object));
      expect(scope.$emit).toHaveBeenCalledWith('process.refresh');
    });
    it('should init controller actors in view model', function() {
      expect(actorMappingCtrl.actors).toBe(processActors);
      expect(actorMappingCtrl.actorsMembers).toEqual([]);
      expect(ActorMappingService.getMembersForAnActor.calls.count()).toEqual(2);
      expect(ActorMappingService.getMembersForAnActor).toHaveBeenCalledWith('actor1', actorMappingCtrl.actorProfiles, process);
      expect(ActorMappingService.getMembersForAnActor).toHaveBeenCalledWith('actor2', actorMappingCtrl.actorProfiles, process);
      expect(actorMappingCtrl.actorProfiles).toEqual({
        users: {
          deploy: {
            filter: 'member_type=USER',
            deploy: ['user_id']
          },
          type: 'users',
          name: 'USER'
        },
        groups: {
          deploy: {
            filter: 'member_type=GROUP',
            deploy: ['group_id']
          },
          type: 'groups',
          name: 'GROUP'
        },
        roles: {
          deploy: {
            filter: 'member_type=ROLE',
            deploy: ['role_id']
          },
          type: 'roles',
          name: 'ROLE'
        },
        memberships: {
          deploy: {
            filter: 'member_type=MEMBERSHIP',
            deploy: ['role_id', 'group_id']
          },
          type: 'memberships',
          name: 'MEMBERSHIP'
        }
      });
    });
  });
})();