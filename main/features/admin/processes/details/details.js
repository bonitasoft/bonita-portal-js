/** Copyright (C) 2015 Bonitasoft S.A.
 * BonitaSoft, 31 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/* jshint sub:true */
(function () {
  'use strict';

  var informationStateName = 'bonita.processesDetails.information';
  var paramsStateName = 'bonita.processesDetails.params';
  var processConnectorsStateName = 'bonita.processesDetails.processConnectors';
  var actorsMappingStateName = 'bonita.processesDetails.actorsMapping';
  /*eslint "angular/ng_di":0*/
  angular
    .module('org.bonitasoft.features.admin.processes.details')
    .value('menuContent', [])
    .config(function ($provide) {
      $provide.decorator('menuContent', function ($delegate, gettext) {
        $delegate.push({
          name: gettext('General'),
          resolutionLabel: 'general',
          state: informationStateName
        });
        $delegate.push({
          name: gettext('Actors'),
          resolutionLabel: 'actor',
          state: actorsMappingStateName
        });
        $delegate.push({
          name: gettext('Parameters'),
          resolutionLabel: 'parameter',
          state: paramsStateName
        });
        $delegate.push({
          name: gettext('Connectors'),
          resolutionLabel: 'connector',
          state: processConnectorsStateName
        });
        return $delegate;
      });
    })
    .service('ProcessMoreDetailsResolveService', function (store, processConnectorAPI, parameterAPI, categoryAPI, processAPI, actorAPI, processResolutionProblemAPI, ProcessProblemResolutionService) {
      var processMoreDetailsResolveService = {};
      processMoreDetailsResolveService.retrieveProcessResolutionProblem = function (processId) {
        if (!processId || processId === '') {
          return [];
        }
        return store.load(processResolutionProblemAPI, {
          f: ['process_id=' + processId]
        }).then(function(processResolutionProblems) {
          return ProcessProblemResolutionService.buildProblemsList(processResolutionProblems.map(function (resolutionProblem) {
            /* jshint camelcase: false */
            return {
              type: resolutionProblem.target_type,
              'ressource_id': resolutionProblem.ressource_id
            };
            /* jshint camelcase: true */
          }));
        });
      };

      processMoreDetailsResolveService.retrieveProcessActors = function(processId) {
        return actorAPI.search({
          'c': 2147483646,   // java Integer.MAX_INT - 1
          'p': 0,
          'o': 'name ASC',
          'f': 'process_id=' + processId,
          'n': ['users', 'groups', 'roles', 'memberships']
        }).$promise.then(function(result){
          return result.data;
        });
      };

      processMoreDetailsResolveService.retrieveProcess = function (processId) {
        return processAPI.get({
          id: processId,
          d: ['deployedBy'],
          n: ['openCases', 'failedCases']
        });
      };

      processMoreDetailsResolveService.retrieveCategories = function (processId) {
        if (!processId || processId === '') {
          return [];
        }
        return store.load(categoryAPI, {
          f: ['id=' + processId]
        });
      };

      processMoreDetailsResolveService.retrieveParameters = function (processId) {
        return store.load(parameterAPI, {
          f: ['process_id=' + processId],
          o: ['name ASC']
        });
      };

      processMoreDetailsResolveService.retrieveConnectors = function (processId) {
        return store.load(processConnectorAPI, {
          o: 'definition_id ASC',
          f: 'process_id=' + processId
        });
      };
      return processMoreDetailsResolveService;
    })
    .config(
      function ($stateProvider) {
        $stateProvider.state('bonita.processesDetails', {
          url: '/admin/processes/details/:processId?supervisor_id',
          templateUrl: 'features/admin/processes/details/menu.html',
          abstract: true,
          controller: 'ProcessMenuCtrl',
          controllerAs: 'processMenuCtrl',
          resolve: {
            stateParamsProcessId: function ($stateParams) {
              return $stateParams.processId;
            },
            process: function ($stateParams, ProcessMoreDetailsResolveService) {
              if (!$stateParams.processId || $stateParams.processId === '') {
                return {};
              }
              var process = ProcessMoreDetailsResolveService.retrieveProcess($stateParams.processId);
              return process.$promise.then(function (result) {
                return result;
              }).catch(function () {
                return {};
              });
            },
            processResolutionProblems: function (process, ProcessMoreDetailsResolveService) {
              /* Depends on process resolution */
              return ProcessMoreDetailsResolveService.retrieveProcessResolutionProblem(process.id);
            },
            supervisorId: function($stateParams, TokenExtensionService) {
              TokenExtensionService.tokenExtensionValue = (angular.isDefined($stateParams['supervisor_id']) ? 'pm' : 'admin');
              return $stateParams['supervisor_id'];
            },
            defaultLocalLang : function(i18nService) {
              return i18nService.translationsLoadPromise.then(function () {
                return {
                  selectAll: i18nService.getKey('multiSelect.selectAll'),
                  selectNone: i18nService.getKey('multiSelect.selectNone'),
                  reset: i18nService.getKey('multiSelect.reset'),
                  search: i18nService.getKey('multiSelect.search.helper')
                };
              });
            }
          }
        }).state(informationStateName, {
          url: '',
          templateUrl: 'features/admin/processes/details/information.html',
          controller: 'ProcessInformationCtrl',
          controllerAs: 'processInformationCtrl',
          resolve: {
            categories: function ($stateParams, ProcessMoreDetailsResolveService) {
              return ProcessMoreDetailsResolveService.retrieveCategories($stateParams.processId);
            }
          }
        }).state(paramsStateName, {
          url: '/params',
          templateUrl: 'features/admin/processes/details/params.html',
          controller: 'ProcessParamsCtrl',
          controllerAs: 'processParamsCtrl',
          resolve: {
            parameters: function ($stateParams, ProcessMoreDetailsResolveService) {
              return ProcessMoreDetailsResolveService.retrieveParameters($stateParams.processId);
            }
          }
        }).state(processConnectorsStateName, {
          url: '/connectors',
          templateUrl: 'features/admin/processes/details/process-connectors.html',
          controller: 'ProcessConnectorsCtrl',
          controllerAs: 'processConnectorsCtrl',
          resolve: {
            processConnectors: function ($stateParams, ProcessMoreDetailsResolveService) {
              return ProcessMoreDetailsResolveService.retrieveConnectors($stateParams.processId);
            }
          }
        }).state(actorsMappingStateName, {
          url: '/actorsMapping',
          templateUrl: 'features/admin/processes/details/actors-mapping.html',
          controller: 'ActorsMappingCtrl',
          controllerAs: 'actorsMappingCtrl',
          resolve: {
            processActors: function ($stateParams, ProcessMoreDetailsResolveService) {
              return ProcessMoreDetailsResolveService.retrieveProcessActors($stateParams.processId);
            }
          }
        });
      }
    );

})();
