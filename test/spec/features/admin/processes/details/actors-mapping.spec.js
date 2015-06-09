(function() {
  'use strict';
  describe('actorMapping module', function() {
    var scope, actorMappingCtrl, process, modal, growl, controller, log, actorMemberAPI, q, processActors, ActorMappingService, actorMapping1, actorMapping2;

    beforeEach(module('org.bonitasoft.features.admin.processes.details.actorMapping'));

    beforeEach(function() {

      actorMemberAPI = jasmine.createSpyObj('actorMemberAPI', ['search']);

      module(function($provide) {
        $provide.value('actorMemberAPI', actorMemberAPI);
      });

      inject(function($rootScope, $controller, $q, $injector) {
        scope = $rootScope.$new();
        q = $q;
        controller = $controller;

        ActorMappingService = $injector.get('ActorMappingService');
        actorMemberAPI = $injector.get('actorMemberAPI');
      });
      actorMapping1 = {
        'users': {
          'data': [],
          'resource': []
        },
        'roles': {
          'data': [],
          'resource': []
        },
        'memberships': {
          'data': [],
          'resource': []
        },
        'groups': {
          'data': [{
            'id': '1',
            'actor_id': '1',
            'role_id': '-1',
            'group_id': {
              'id': '1',
              'creation_date': '2015-05-18 22:50:01.607',
              'created_by_user_id': '-1',
              'icon': '',
              'parent_path': '',
              'description': 'This group represents the acme department of the ACME organization',
              'name': 'acme',
              'path': '/acme',
              'displayName': 'Acme',
              'last_update_date': '2015-05-18 22:50:01.607'
            },
            'user_id': '-1'
          }, {
            'id': '2',
            'actor_id': '1',
            'role_id': '-1',
            'group_id': {
              'id': '3',
              'creation_date': '2015-05-18 22:50:01.648',
              'created_by_user_id': '-1',
              'icon': '',
              'parent_path': '/acme',
              'description': 'This group represents the finance department of the ACME organization',
              'name': 'finance',
              'path': '/acme/finance',
              'displayName': 'Finance',
              'last_update_date': '2015-05-18 22:50:01.648'
            },
            'user_id': '-1'
          }],
          'resource': []
        }
      };
      actorMapping2 = {
        'users': {
          'data': [],
          'resource': []
        },
        'roles': {
          'data': [],
          'resource': []
        },
        'memberships': {
          'data': [],
          'resource': []
        },
        'groups': {
          'data': [],
          'resource': []
        }
      };
    });
    describe('ActorsMappingCtrl', function() {
      var actor1, actor2;
      beforeEach(function() {
        actor1 = {
          id: 456
        };
        actor2 = {
          id: 789
        };
        processActors = [actor1, actor2];
        process = {
          id: 123
        };
        log = jasmine.createSpyObj('$log', ['error']);
        growl = jasmine.createSpyObj('$growl', ['error', 'success']);
        modal = jasmine.createSpyObj('$modal', ['open']);
        ActorMappingService = jasmine.createSpyObj('ActorMappingService', ['getMembersForAnActor', 'getActorMembers']);
        var deferedActor1 = q.defer();
        var deferedActor2 = q.defer();
        ActorMappingService.getMembersForAnActor.and.returnValues(deferedActor1.promise, deferedActor2.promise);

        deferedActor1.resolve(actorMapping1);
        deferedActor2.resolve(actorMapping2);
        actorMappingCtrl = controller('ActorsMappingCtrl', {
          $scope: scope,
          $modal: modal,
          process: process,
          growl: growl,
          $log: log,
          processActors: processActors,
          ActorMappingService: ActorMappingService,
          defaultLocalLang: {}
        });
      });
      it('should open modal on actor edition, display success message on success and refresh process and appropriate actor', function() {
        var deferred = q.defer();
        scope.$emit = jasmine.createSpy();
        modal.open.and.returnValue({
          result: deferred.promise
        });
        var deferredActors = q.defer();
        ActorMappingService.getActorMembers.and.returnValue(deferredActors.promise);
        deferredActors.resolve(actorMapping2.groups);

        actorMappingCtrl.editMapping(actor1, 'groups');

        expect(modal.open.calls.count()).toEqual(1);
        var options = modal.open.calls.mostRecent().args[0];
        expect(options.size).toBe('lg');
        expect(options.backdrop).toBeFalsy();
        expect(options.templateUrl).toBe('features/admin/processes/details/edit-actor-members.html');
        expect(options.controller).toBe('EditActorMembersCtrl');
        expect(options.controllerAs).toBe('editActorMembersCtrl');
        expect(options.resolve.process()).toBe(process);
        expect(options.resolve.memberProfile().name).toEqual('GROUP');
        expect(options.resolve.actor()).toEqual(actor1);
        deferred.resolve([null, undefined, 'actor1', 'actor2']);
        scope.$apply();
        expect(growl.success).toHaveBeenCalledWith('2 actor mapping updates succeeded', jasmine.any(Object));
        expect(scope.$emit).toHaveBeenCalledWith('process.refresh');
        expect(ActorMappingService.getActorMembers).toHaveBeenCalledWith(actor1, actorMappingCtrl.actorProfiles.groups.deploy, process);
        expect(actorMappingCtrl.actorsMembers[actor1.id].groups).toEqual(actorMapping2.groups);
      });

      it('should open modal on actor edition, display error message on failure and refresh process and appropriate actor', function() {
        var deferred = q.defer();
        scope.$emit = jasmine.createSpy();
        modal.open.and.returnValue({
          result: deferred.promise
        });
        actorMappingCtrl.editMapping(actor1, 'users');

        deferred.reject(['impossible to save']);
        scope.$apply();
        expect(growl.error).toHaveBeenCalledWith('1 errors on mapping updates', jasmine.any(Object));
        expect(scope.$emit).toHaveBeenCalledWith('process.refresh');
      });
      it('should init controller actors in view model', function() {
        scope.$apply();
        expect(actorMappingCtrl.actors).toBe(processActors);
        expect(actorMappingCtrl.actorsMembers).toEqual({
          '456': actorMapping1,
          '789': actorMapping2
        });
        expect(ActorMappingService.getMembersForAnActor.calls.count()).toEqual(2);
        expect(ActorMappingService.getMembersForAnActor).toHaveBeenCalledWith(actor1, actorMappingCtrl.actorProfiles, process);
        expect(ActorMappingService.getMembersForAnActor).toHaveBeenCalledWith(actor2, actorMappingCtrl.actorProfiles, process);
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
    describe('ActorMappingService', function() {
      it('getMembersForAnActor should retrieve member for each actor profile', function() {
        var deferredUsers = q.defer();
        var deferredGroups = q.defer();
        ActorMappingService.getActorMembers = jasmine.createSpy('getActorMembers');
        ActorMappingService.getActorMembers.and.returnValues(deferredUsers.promise, deferredGroups.promise);
        var actor = {
          id: 456
        };
        var actorProfiles = {
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
          }
        };
        process = {
          id: 123
        };
        ActorMappingService.getMembersForAnActor(actor, actorProfiles, process).then(function(actorMembers) {
          expect(actorMembers).toEqual({
            users: actorMapping1.users,
            groups: actorMapping1.groups
          });
        });
        deferredUsers.resolve(actorMapping1.users);
        deferredGroups.resolve(actorMapping1.groups);
        scope.$apply();
        expect(ActorMappingService.getActorMembers.calls.count()).toEqual(2);
        expect(ActorMappingService.getActorMembers).toHaveBeenCalledWith(actor, actorProfiles.users.deploy, process);
        expect(ActorMappingService.getActorMembers).toHaveBeenCalledWith(actor, actorProfiles.groups.deploy, process);
      });

      it('getActorMembers should retrieve member for each actor profile', function() {
        var deferred = q.defer();
        actorMemberAPI.search.and.returnValue({
          $promise: deferred.promise
        });
        var actor = {
          id: 789
        };
        var actorProfileDeploy = {
          filter: 'member_type=GROUP',
          deploy: ['group_id']
        };
        process = {
          id: 123
        };
        expect(ActorMappingService.getActorMembers(actor, actorProfileDeploy, process)).toEqual(deferred.promise);
        expect(actorMemberAPI.search).toHaveBeenCalledWith({
          p: 0,
          c: 5,
          f: ['process_id=123', 'actor_id=789', 'member_type=GROUP'],
          d: ['group_id']
        });

      });
    });
  });
})();
