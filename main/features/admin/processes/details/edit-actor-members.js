(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.editActorMembers', [
    'ui.bootstrap',
    'ui.router',
    'angular-growl',
    'org.bonitasoft.bonitable',
    'org.bonitasoft.bonitable.selectable',
    'org.bonitasoft.bonitable.repeatable',
    'org.bonitasoft.bonitable.sortable',
    'org.bonitasoft.bonitable.settings',
    'org.bonitasoft.common.resources.store',
    'xeditable'
  ])
    .controller('EditActorMembersCtrl', function($scope, $modalInstance, store, actorMemberAPI, userAPI, groupAPI, roleAPI, actor, memberType, process, growl) {
      var self = this;
      self.scope = $scope;
      self.scope.memberType = memberType;
      self.scope.members = {};
      self.scope.arrayNewMembers = [];
      self.scope.newMembershipRole = {};
      self.scope.newMembershipGroup = {};
      self.scope.actor = actor;
      
      var growlOptions = {
        ttl: 3000,
        disableCountDown: true,
        disableIcons: true
      };
      var mappedIds = [];
      var userIdAttribute = 'user_id';
      var groupIdAttribute = 'group_id';
      var roleIdAttribute = 'role_id';
      self.initObj = {};

      self.constant = {
        USER: 'USER',
        GROUP: 'GROUP',
        ROLE: 'ROLE',
        MEMBERSHIP: 'MEMBERSHIP'
      };

      self.scope.localLang = {
        selectAll: 'Select all',
        selectNone: 'Select none',
        reset: 'Reset',
        search: 'Type here to search...'
      };
      self.scope.localLangRole = {
        selectAll: 'Select all',
        selectNone: 'Select none',
        reset: 'Reset',
        search: 'Type here to search...'
      };
      self.scope.localLangGroup = {
        selectAll: 'Select all',
        selectNone: 'Select none',
        reset: 'Reset',
        search: 'Type here to search...'
      };

      self.initView = function initView() {
        switch (memberType) {
          case self.constant.USER:
            self.initObj = {
              d: [userIdAttribute],
              o: 'firstname asc',
              realId: userIdAttribute,
              saveMethod: self.saveUserMembers,
              searchMethod: self.searchMembers,
              searchAPI: userAPI
            };
            self.scope.currentMemberLabel = 'Users';
            break;

          case self.constant.GROUP:
            self.initObj = {
              d: [groupIdAttribute],
              o: 'displayName asc',
              realId: groupIdAttribute,
              saveMethod: self.saveGroupMembers,
              searchMethod: self.searchMembers,
              searchAPI: groupAPI
            };
            self.scope.currentMemberLabel = 'Groups';
            break;

          case self.constant.ROLE:
            self.initObj = {
              d: [roleIdAttribute],
              o: 'displayName asc',
              realId: roleIdAttribute,
              saveMethod: self.saveRoleMembers,
              searchMethod: self.searchMembers,
              searchAPI: roleAPI
            };
            self.scope.currentMemberLabel = 'Roles';
            break;

          case self.constant.MEMBERSHIP:
            self.initObj = {
              d: [roleIdAttribute, groupIdAttribute],
              o: 'displayName asc',
              realId: roleIdAttribute,
              realId2: groupIdAttribute
            };
            self.scope.localLangGroup.nothingSelected = 'group selection';
            self.scope.localLangRole.nothingSelected = 'role selection';
            self.scope.currentMemberLabel = 'Membership';
            break;
        }
        self.scope.localLang.nothingSelected = self.scope.currentMemberLabel + ' selection';
        self.initObj.f = ['actor_id=' + actor.id, 'member_type=' + memberType];
        self.loadMembers();
      };

      self.loadMembers = function loadMembers() {
        /*jshint camelcase: false */
        mappedIds = [];
        store.load(actorMemberAPI, {
          f: self.initObj.f,
          d: self.initObj.d
        }).then(function success(members) {
          members.forEach(function(currentMember, index) {
            if (memberType === self.constant.USER) {
              members[index].removeLabel = currentMember.user_id.firstname + ' ' + currentMember.user_id.lastname;
            } else {
              members[index].removeLabel = currentMember[self.initObj.realId].displayName;
              if (self.initObj.realId2)  {
                members[index].removeLabel += ' of ' + currentMember[self.initObj.realId2].displayName;
              }
            }
          });
          self.scope.members = members;
          if (memberType !== self.constant.MEMBERSHIP) {
            members.forEach(function(member) {
              mappedIds.push(member[self.initObj.realId].id);
            });
            self.initObj.searchMethod();
          } else {
            self.selectOnSearchGroup('');
            self.selectOnSearchRole('');
          }
        }, function error() {

        });
      };

      self.removeMember = function removeMember(member, notify) {

        actorMemberAPI.delete({
          id: member.id
        }).$promise.then(
          function success() {
            if (notify) {
              self.notifyDeletion(member, true);
            }
            self.loadMembers();
          },
          function error() {
            if (notify) {
              self.notifyDeletion(member, false);
            }
          }
        );
      };

      self.notifyDeletion = function notifyDeletion(member, success) {
        /*jshint camelcase: false */
        var composedMessage = 'Actor ';
        if (member.user_id.id) {
          composedMessage = member.user_id.firstname + ' ' + member.user_id.lastname;
        }
        if (member.role_id.displayName) {
          composedMessage = member.role_id.displayName;
        }
        if (member.group_id.displayName) {
          if (member.role_id.displayName) {
            composedMessage = member.role_id.displayName + ' of ';
          }
          composedMessage += member.group_id.displayName;
        }
        if (success) {
          growl.success(composedMessage + ' was sucessfully deleted', growlOptions);
        } else {
          growl.error(composedMessage + ' was unsucessfully deleted', growlOptions);
        }

      };

      self.searchMembers = function searchMembers(searchOptions) {
        if (!searchOptions) {
          searchOptions = {
            p: 0,
            c: 200
          };
        }
        searchOptions.o = self.initObj.o;
        var finalArray = [];
        self.initObj.searchAPI.search(searchOptions).$promise.then(function success(response) {
          response.data.forEach(function(currentMember) {
            var index = mappedIds.indexOf(currentMember.id);
            if (index === -1) {
              if (self.scope.memberType === self.constant.USER) {
                currentMember.listLabel = currentMember.firstname + ' ' + currentMember.lastname + '<small> (<i>' + currentMember.userName + '</i>)</small>';
                currentMember.buttonLabel = currentMember.firstname + ' ' + currentMember.lastname;
              } else {
                currentMember.listLabel = currentMember.displayName;
                currentMember.buttonLabel = currentMember.displayName;
              }
              finalArray.push(currentMember);
            }
          });
          self.scope.first200members = finalArray;
        });
      };

      self.searchMembership = function searchMembership(searchOptions, resourceAPI) {
        if (!searchOptions) {
          searchOptions = {
            p: 0,
            c: 200
          };
        }
        return resourceAPI.search(searchOptions).$promise;
      };

      var searchOptions = {
        p: 0,
        c: 200
      };


      self.multiselectOnSearch = function multiselectOnSearch(search) {
        if (search.keyword !== '') {
          searchOptions.s = search.keyword;
          self.searchMembers(searchOptions);
        }
      };

      self.selectOnSearchGroup = function selectOnSearchGroup(search) {
        if (search === undefined || search.keyword !== '') {
          searchOptions.s = search.keyword;
          self.searchMembership(searchOptions, groupAPI).then(function mapGroup(response) {
            self.scope.first200groups = response.data;
          });
        }
      };
      self.selectOnSearchRole = function selectOnSearchRole(search) {
        if (search === undefined || search.keyword !== '') {
          searchOptions.s = search.keyword;
          self.searchMembership(searchOptions, roleAPI).then(function mapRole(response) {
            self.scope.first200roles = response.data;
          });
        }
      };


      self.saveSelectedMembers = function saveSelectedMembers() {
        self.saveCallFinished = 0;
        for (var i in self.scope.arrayNewMembers) {
          var member = self.scope.arrayNewMembers[i];
          var saveObj = {
            'actor_id': actor.id
          };
          saveObj[self.initObj.realId] = member.id;
          self.actorMemberAPISave(saveObj);
        }
        self.closeModal();
      };
      self.saveSelectedMembership = function saveSelectedMembership() {
        self.saveCallFinished = 0;
        if (self.scope.newMembershipRole.length === 1 && self.scope.newMembershipGroup.length === 1) {
          actorMemberAPI.save({
            'role_id': self.scope.newMembershipRole[0].id,
            'group_id': self.scope.newMembershipGroup[0].id,
            'actor_id': actor.id
          }).$promise.then(function success() {
            growl.success(self.scope.newMembershipRole[0].displayName + ' of ' + self.scope.newMembershipGroup[0].displayName + ' was sucessfully created', growlOptions);
            self.closeModal();
          }, function error(response) {
            growl.error(response.data.message, growlOptions);
          });
        }
      };


      self.actorMemberAPISave = function actorMemberAPISave(toSaveObj) {
        actorMemberAPI.save(toSaveObj).$promise.finally(function needToInit() {
          self.saveCallFinished++;
          if (self.saveCallFinished === self.scope.arrayNewMembers.length) {
            self.loadMembers();
          }
        });
      };

      self.removeAll = function removeAll() {
        self.scope.members.forEach(function(member) {
          self.removeMember(member, false);
        });
      };

      self.closeModal = function closeModal() {
        self.loadMembers();
        $modalInstance.close();
      };

    });
})();