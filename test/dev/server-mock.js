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
(function(module, verbose) {
  'use strict';

  var querystring = require('querystring');

  var debug = !verbose ? function() {} : function(message) {
    console.log(message);
  };

  var MockList = (function() {
    /*jshint validthis: true */
    function findMock(url) {
      for (var i = 0; i < this._mocks.length; i++) {
        debug(this._mocks[i]);
        if (this._mocks[i].url.test(url)) {
          return this._mocks[i].mock;
        }
      }
    }

    function addMock(url, mock) {
      this._mocks.push({
        url: url,
        mock: mock
      });
    }
    var MockList = function() {
      this._mocks = [];

    };
    MockList.prototype = {
      findMock: findMock,
      addMock: addMock
    };
    return MockList;
  })();

  var mocks = {
    'GET': new MockList(),
    'POST': new MockList(),
    'DELETE': new MockList(),
    'PUT': new MockList()
  };

  function paginate(data, request) {
    var query = querystring.parse(request._parsedUrl.query);
    var page = parseInt(query.p) || 0;
    var count = parseInt(query.c) || 10;
    var total = data.length;
    debug('slice:' + page * count + ' ' + (page + 1) * count);
    return {
      data: data.slice(page * count, (page + 1) * count),
      contentRange: page + '-' + count + '/' + total
    };
  }

  function extend(dst, src) {
    for (var property in src) {
      if (src.hasOwnProperty(property)) {
        dst[property] = dst[property] || src[property];
      }
    }
  }

  function mock(json) {
    return function(request, response) {
      var data = json;
      var headers = {
        'Content-Type': 'application/json'
      };
      if (data instanceof Array) {
        var page = paginate(data, request);
        data = page.data;
        extend(headers, {
          'Content-Range': page.contentRange
        });
      }
      response.writeHead(200, headers);
      response.end(JSON.stringify(data));

    };
  }

  function when(method, url) {
    return {
      respond: function(json) {
        debug(url + ' => ' + JSON.stringify(json));
        mocks[method].addMock(url, mock(json));
      }
    };
  }

  module.exports = function(request, response, next) {
    debug(request.method + ' ' + request.url);
    ((mocks[request.method] && mocks[request.method].findMock(request.url)) || function() {
      next();
    })(request, response);
  };


  // localization
  when('GET', /^\/API\/system\/i18ntranslation\?f=locale%3Dfr/).respond(require('./localization-fr.json'));

  //case admin
  when('GET', /^\/API\/bpm\/case\?c=.*&d=processDefinitionId&d=started_by&d=startedBySubstitute&n=activeFlowNodes&n=failedFlowNodes&o=id\+ASC&p=.*$/).respond(require('./admin/cases/list/cases-list-320-mocks.json'));
  when('GET', /^\/API\/bpm\/case\?c=25&d=processDefinitionId&d=started_by&d=startedBySubstitute&n=activeFlowNodes&n=failedFlowNodes&o=startDate\+ASC&p=0&s=$/).respond(require('./admin/cases/list/cases-list-28-mocks-ordered-by-date.json'));
  when('GET', /^\/API\/bpm\/case\?c=25&d=processDefinitionId&d=started_by&d=startedBySubstitute&n=activeFlowNodes&n=failedFlowNodes&o=startDate\+DESC&p=0&s=$/).respond(require('./admin/cases/list/cases-list-28-mocks-ordered-by-date-desc.json'));
  when('GET', /^\/API\/bpm\/case\?c=25&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=name%3DPoule&n=activeFlowNodes&n=failedFlowNodes&o=id\+ASC&p=0&s=$/).respond(require('./admin/cases/list/cases-list-28-mocks-filtered-by-poule-app-name.json'));
  when('GET', /^\/API\/bpm\/case\?c=25&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=processDefinitionId%3D4910683075061293406&n=activeFlowNodes&n=failedFlowNodes&o=id\+ASC&p=0&s=$/).respond(require('./admin/cases/list/cases-list-28-mocks-filtered-by-processx-id.json'));
  when('GET', /^\/API\/bpm\/case\?c=25&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=processDefinitionId%3D8967858817451251940&n=activeFlowNodes&n=failedFlowNodes&o=id\+ASC&p=0&s=$/).respond(require('./admin/cases/list/cases-list-28-mocks-filtered-by-poule-2.0-app.json'));

  //case user
  when('GET', /^\/API\/bpm\/case\?c=.*&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id%3D1&n=activeFlowNodes&n=failedFlowNodes&o=id\+ASC&p=.*$/).respond(require('./admin/cases/list/cases-list-320-mocks.json'));
  when('GET', /^\/API\/bpm\/case\?c=25&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id%3D1&n=activeFlowNodes&n=failedFlowNodes&o=startDate\+ASC&p=0&s=$/).respond(require('./admin/cases/list/cases-list-28-mocks-ordered-by-date.json'));
  when('GET', /^\/API\/bpm\/case\?c=25&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id%3D1&n=activeFlowNodes&n=failedFlowNodes&o=startDate\+DESC&p=0&s=$/).respond(require('./admin/cases/list/cases-list-28-mocks-ordered-by-date-desc.json'));
  when('GET', /^\/API\/bpm\/case\?c=25&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=name%3DPoule&f=user_id%3D1&n=activeFlowNodes&n=failedFlowNodes&o=id\+ASC&p=0&s=$/).respond(require('./admin/cases/list/cases-list-28-mocks-filtered-by-poule-app-name.json'));
  when('GET', /^\/API\/bpm\/case\?c=25&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=name%3DPoule&f=user_id%3D1&f=started_by%3D1&n=activeFlowNodes&n=failedFlowNodes&o=id\+ASC&p=0&s=$/).respond([]);

  //Arch case Admi
  when('GET', /^\/API\/bpm\/archivedCase\?c=.*&d=processDefinitionId&d=started_by&d=startedBySubstitute&o=sourceObjectId\+ASC&p=.*$/).respond(require('./admin/cases/list/arch-cases-list-320-mocks.json'));
  when('GET', /^\/API\/bpm\/archivedCase\?c=25&d=processDefinitionId&d=started_by&d=startedBySubstitute&o=startDate\+ASC&p=0&s=$/).respond(require('./admin/cases/list/arch-cases-list-28-mocks-ordered-by-date.json'));
  when('GET', /^\/API\/bpm\/archivedCase\?c=25&d=processDefinitionId&d=started_by&d=startedBySubstitute&o=startDate\+DESC&p=0&s=$/).respond(require('./admin/cases/list/arch-cases-list-28-mocks-ordered-by-date-desc.json'));
  when('GET', /^\/API\/bpm\/archivedCase\?c=25&d=processDefinitionId&d=started_by&d=startedBySubstitute&o=sourceObjectId\+ASC&p=0&s=$/).respond(require('./admin/cases/list/arch-cases-list-28-mocks-ordered-by-id-desc.json'));
  when('GET', /^\/API\/bpm\/archivedCase\?c=25&d=processDefinitionId&d=started_by&d=startedBySubstitute&o=sourceObjectId\+DESC&p=0&s=$/).respond(require('./admin/cases/list/arch-cases-list-28-mocks-ordered-by-id-desc.json'));
  when('GET', /^\/API\/bpm\/archivedCase\?c=25&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=name%3DPoule&o=sourceObjectId\+ASC&p=0&s=$/).respond(require('./admin/cases/list/arch-cases-list-28-mocks-filtered-by-poule-app-name.json'));
  when('GET', /^\/API\/bpm\/archivedCase\?c=25&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=processDefinitionId%3D4910683075061293406&o=sourceObjectId\+ASC&p=0&s=$/).respond(require('./admin/cases/list/arch-cases-list-28-mocks-filtered-by-processx-id.json'));
  when('GET', /^\/API\/bpm\/archivedCase\?c=25&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=processDefinitionId%3D8967858817451251940&o=sourceObjectId\+ASC&p=0&s=$/).respond(require('./admin/cases/list/arch-cases-list-28-mocks-filtered-by-poule-2.0-app.json'));

  //Arch case User
  when('GET', /^\/API\/bpm\/archivedCase\?c=.*&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id%3D1&o=sourceObjectId\+ASC&p=.*$/).respond(require('./admin/cases/list/arch-cases-list-320-mocks.json'));
  when('GET', /^\/API\/bpm\/archivedCase\?c=25&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id%3D1&o=startDate\+ASC&p=0&s=$/).respond(require('./admin/cases/list/arch-cases-list-28-mocks-ordered-by-date.json'));
  when('GET', /^\/API\/bpm\/archivedCase\?c=25&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id%3D1&o=startDate\+DESC&f=user_id%3D1&p=0&s=$/).respond(require('./admin/cases/list/arch-cases-list-28-mocks-ordered-by-date-desc.json'));
  when('GET', /^\/API\/bpm\/archivedCase\?c=25&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id%3D1&o=sourceObjectId\+ASC&p=0&s=$/).respond(require('./admin/cases/list/arch-cases-list-28-mocks-ordered-by-id-desc.json'));
  when('GET', /^\/API\/bpm\/archivedCase\?c=25&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id%3D1&o=sourceObjectId\+DESC&p=0&s=$/).respond(require('./admin/cases/list/arch-cases-list-28-mocks-ordered-by-id-desc.json'));
  when('GET', /^\/API\/bpm\/archivedCase\?c=25&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=name%3DPoule&f=user_id%3D1&o=sourceObjectId\+ASC&p=0&s=$/).respond(require('./admin/cases/list/arch-cases-list-28-mocks-filtered-by-poule-app-name.json'));
  when('GET', /^\/API\/bpm\/archivedCase\?c=25&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=name%3DPoule&f=user_id%3D1&f=started_by%3D1&o=sourceObjectId\+ASC&p=0&s=$/).respond([]);

  //process details
  when('GET', /^\/API\/bpm\/process\/321\?d=deployedBy&n=openCases&n=failedCases$/).respond(require('./admin/processes/details/process-def-321.json'));
  when('GET', /^\/API\/bpm\/process\/789\?d=deployedBy&n=openCases&n=failedCases$/).respond(require('./admin/processes/details/process-def-789.json'));
  when('GET', /^\/API\/bpm\/category\?c=\d+&f=id%3D321&p=\d+$/).respond(require('./admin/processes/details/process-categories-321.json'));
  when('GET', /^\/API\/bpm\/category\?c=\d+&p=\d+$/).respond(require('./admin/processes/details/categories.json'));
  when('GET', /^\/API\/bpm\/category\?c=\d+&f=id%3D789&p=\d+$/).respond([]);
  when('GET', /^\/API\/identity\/user\?c=\d+&f=enabled%3Dtrue&f=process_id%3D\d+&o=firstname,lastname&p=\d+$/).respond(require('./admin/processes/details/users-list.json'));
  when('GET', /^\/API\/bpm\/processConnector\?c=\d+&f=process_id%3D321&p=\d+$/).respond([]);
  when('GET', /^\/API\/bpm\/processParameter\?c=\d+&f=process_id%3D321&(.*&)?p=\d+$/).respond(require('./admin/processes/details/process-parameters-321.json'));
  when('GET', /^\/API\/form\/mapping\?c=\d+&f=processDefinitionId%3D321&(.*&)?p=\d+$/).respond(require('./admin/processes/details/process-form-mappings-321.json'));
  when('GET', /^\/API\/bpm\/processResolutionProblem\?c=\d+&f=process_id%3D321&p=\d+$/).respond([]);
  when('GET', /^\/API\/bpm\/processResolutionProblem\?c=\d+&f=process_id%3D789&p=\d+$/).respond([{
    'target_type': 'actor'
  }, {
    'target_type': 'parameter'
  }]);

  when('PUT', /^\/API\/bpm\/process\/\d+$/).respond();

  // task list comments
  when('GET', /^\/API\/bpm\/comment\?c=2147483647&d=userId&f=processInstanceId%3D1&o=postDate\+ASC&p=0/).respond(require('./user/tasks/list/comments-mock.json'));
  when('GET', /^\/API\/bpm\/archivedComment\?c=2147483647&d=userId&f=processInstanceId%3D2&o=postDate\+ASC&p=0/).respond(require('./user/tasks/list/archived-comments-mock.json'));



  var formRegexp  = /portal\/homepage\?.*ui=form.*/;

  when('GET', /^\/API\/identity\/professionalcontactdata\/18/).respond(require('./user/tasks/list/professionalContact18-mock.json'));

  //order specific request before
  when('GET', /^\/API\/bpm\/humanTask\?c=50&d=rootContainerId&f=state%3Dready&f=user_id%3D1&o=displayName\+ASC&p=0&s=a*./).respond(require('./user/tasks/list/humanTasksSearchStartsWithA-mock.json'));
  when('GET', /^\/API\/bpm\/humanTask\?c=50&d=rootContainerId&f=state%3Dready&f=user_id%3D1&f=processId%3D5545132423260882733&o=displayName\+ASC&p=0/).respond(require('./user/tasks/list/humanTasksSearchFilteredOnCurrentUser-mock.json'));

  when('GET', /^\/API\/bpm\/humanTask\?c=0&f=state%3Dready&f=assigned_id%3D1&p=0/).respond(require('./user/tasks/list/humanTasksSearchFilteredOnCurrentUser-mock.json'));
  when('GET', /^\/API\/bpm\/humanTask\?c=50&d=rootContainerId&f=state%3Dready&f=assigned_id%3D1&o=displayName\+ASC&p=0/).respond(require('./user/tasks/list/humanTasksSearchFilteredOnCurrentUser-mock.json'));
  when('GET', /^\/API\/bpm\/humanTask\?c=0&f=state%3Dready&f=assigned_id%3D0&f=user_id%3D1&p=0/).respond(require('./user/tasks/list/humanTasksSearchFilteredOnProcessId-mock.json'));
  when('GET', /^\/API\/bpm\/humanTask\?c=50&d=rootContainerId&f=state%3Dready&f=assigned_id%3D0&f=user_id%3D1&o=displayName\+ASC&p=0/).respond(require('./user/tasks/list/humanTasksSearchFilteredOnProcessId-mock.json'));

  when('GET', /^\/API\/bpm\/humanTask\?c=(25|50)&d=rootContainerId&f=state%3Dready(&f=assigned_id%3D0)*&f=user_id%3D1(&f=processId%3D5545132423260882733)*&o=displayName\+ASC&p=[0|1]/).respond(require('./user/tasks/list/humanTaskSearchAsc-mock.json'));

  when('GET', /^\/API\/bpm\/humanTask\?c=50&d=rootContainerId&f=state%3Dready&f=user_id%3D1&o=displayName\+DESC&p=0/).respond(require('./user/tasks/list/humanTaskSearchDesc-mock.json'));
  when('PUT', /API\/bpm\/humanTask\/2/).respond(require('./user/tasks/list/humanTask2TakenByUser1-mock.json'));
  when('PUT', /API\/bpm\/humanTask\/19/).respond(require('./user/tasks/list/humanTask19Released-mock.json'));
  when('GET', /^\/API\/bpm\/archivedHumanTask\?c=50&d=rootContainerId&f=assigned_id%3D1&f=state%3Dcompleted&o=displayName\+ASC&p=0/).respond(require('./user/tasks/list/humanTasksSearchFilteredOnDoneTasks-mock.json'));
  when('GET', /^\/API\/bpm\/archivedFlowNode\?c=100&d=executedBySubstitute&d=executedBy&f=caseId%3D[1|2|4|5|6|7]&f=isTerminal%3Dtrue&p=0/).respond(require('./user/tasks/list/archivedFlowNodes-mock.json'));
  when('GET', /^\/API\/bpm\/case\/[1|2|4|5|6|7]\?d=started_by&d=processDefinitionId$/).respond(require('./user/tasks/list/case-mock.json'));
  when('GET', /^\/API\/bpm\/archivedCase\?c=1&d=started_by&d=processDefinitionId&f=sourceObjectId%3D99&p=0/).respond(require('./user/tasks/list/archived-case-mock.json'));
  when('GET', /^\/API\/bpm\/process\?c=[0|2]&f=user_id%3D1&f=forPendingOrAssignedTask%3Dtrue&p=0$/).respond(require('./user/tasks/list/processes-mock.json'));
  when('GET', /^\/API\/bpm\/processSupervisor\?c=10&d=user_id&f=process_id%3D(5545132423260882732|8007855270751208272)&p=0$/).respond(require('./user/tasks/list/processSupervisors-mock.json'));
  when('GET', /^\/API\/bpm\/process\/(5545132423260882732)$/).respond(require('./user/tasks/list/process5545132423260882732-mock.json'));
  when('GET', /^\/API\/bpm\/process\/(8007855270751208272)$/).respond(require('./user/tasks/list/process8007855270751208272-mock.json'));

  //global
  when('GET', /^\/API\/bpm\/process\?c=\d+&.*p=0$/).respond(require('./admin/cases/list/process-def-4.json'));
  when('GET', /^\/API\/system\/i18ntranslation.*$/).respond([]);
  //enable french translation
  //when('GET', /^\/API\/system\/i18ntranslation.*$/).respond(require('./i18translations.json'));
  when('GET', /^\/API\/system\/feature\?c=0&p=0$/).respond([]);
  when('GET', /^\/API\/system\/session.*$/ ).respond(require('./session-mock.json'));
  var fs = require('fs');
  var form = fs.readFileSync(__dirname+'/user/tasks/list/fixtures/form.html', 'utf8');
  when('GET', formRegexp, 'html').respond( form );


})(module, false);
