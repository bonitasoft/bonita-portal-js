(function (module, verbose) {
  'use strict';


  var fs = require('fs');
  var querystring = require('querystring');

  function clone(o){
    return JSON.parse(JSON.stringify(o));
  }

  var debug = !verbose ? function () {
  } : function (message) {
    console.log(message);
  };

  var MockList = (function () {

    function findMock(url) {
      for(var i = 0; i < this._mocks.length; i++) {

        if(this._mocks[i].url.test(url)) {
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
    var page = parseInt(query.p, 10) || 0;
    var count = parseInt(query.c, 10) || 10;
    var total = data.length;
    debug('slice:' + page * count + ' ' + (page + 1) * count);
    return {
      data: data.slice(page * count, (page + 1) * count),
      contentRange: page + '-' + count + '/' + total
    };
  }

  function extend(dst, src) {
    for(var property in src) {
      if(src.hasOwnProperty(property)) {
        dst[property] = dst[property] || src[property];
      }
    }
  }

  function mockJson(json) {
    return function (request, response) {
      var data = json;
      var headers = { 'Content-Type': 'application/json' };
      if(data instanceof Array) {
        var page = paginate(data, request);
        data = page.data;
        extend(headers, { 'Content-Range': page.contentRange });
      }
      response.writeHead(200, headers);
      response.end(JSON.stringify(data));
    };
  }

  function mockHtml(html) {
    return function (request, response) {
      var data = html;
      var headers = { 'Content-Type': 'text/html; charset=UTF-8' };
      response.writeHead(200, headers);
      response.end(data);
    };
  }

  function when(method, url, type) {
    type  = type || 'json';
    return {
      respond: function (json) {
        debug(url + ' => ' + JSON.stringify(json));
        switch(type) {
          case 'html':
            mocks[method].addMock(url, mockHtml(json));
            break;

          default:
            mocks[method].addMock(url, mockJson(json));
            break;
        }
      }
    };
  }

  module.exports = function (request, response, next) {
    debug(request.method + ' ' + request.url);
    (mocks[request.method].findMock(request.url) || function () {
      next();
    })(request, response);
  };



  var mockUser = require('./user-mock.json');
  var mockCase = require('./case-mock.json');
  var mockTasks = require('./humanTasks-mock.json');
  var mockProcesses = require('./processes-mock.json');
  var mockSupervisor = require('./processSupervisors-mock.json');
  var mockContact = require('./professionalContact-mock.json');
  var mockArchivedFlowNode = require('./archivedFlowNodes-mock.json');
  var mockComment = require('./comments-mock.json');


  var mockTasksAsc = mockTasks.sort(function(a, b){
    return a.name.localeCompare(b.name);
  });

  var mockTasksDesc = mockTasks.slice().reverse();
  var mockTasksFiltered = mockTasksAsc.filter(function(task){
    return task.displayName.match(/^a/i);
  });

  var mockMyTask = mockTasksAsc.slice(-2);
  var mockPoolTask = mockTasksAsc.slice(0, -2);
  var mockDoneTasks = mockTasksAsc.slice(0,5);
  var mockProcessTasks = mockTasksAsc.slice(-2);

  var takeTask = clone(mockTasksAsc[0]);
  takeTask.assigned_id = mockUser.user_id;

  var releaseTask = clone(mockTasksDesc[0]);
  releaseTask.assigned_id = '';


  var UserRegexp = /bonita\/API\/system\/session.*$/;
  var CaseRegexp =  /bonita\/API\/bpm\/case.*$/ ;
  var ProcessesRegexp = /bonita\/API\/bpm\/process\?.*$/;
  var ProcessRegexp = /bonita\/API\/bpm\/process\/.*$/;
  var SupervisorRegexp = /bonita\/API\/bpm\/processSupervisor.*$/;
  var ContactRegexp = /bonita\/API\/identity\/professionalcontactdata.*$/;

  var Comment = /bonita\/API\/bpm\/comment.*$/;
  var ArchivedFlowNode = /bonita\/API\/bpm\/archivedFlowNode.*$/;

  var HumanTaskAllCount = /bonita\/API\/bpm\/humanTask.*\&f=user_id%3D[1-9]+\&p=0$/;
  var HumanTaskMYCount = /bonita\/API\/bpm\/humanTask.*\&f=assigned_id%3D[1-9]+/;
  var HumanTaskPOOLCount = /bonita\/API\/bpm\/humanTask.*\&f=assigned_id%3D0\&f=user_id%3D[1-9]+/;
  var HumanTaskProcess = /bonita\/API\/bpm\/humanTask.*\&f=processId%3D[0-9]+/;

  var HumanTaskAscRegexp = /bonita\/API\/bpm\/humanTask.*\&f=user_id%3D[1-9]+.*\&o=displayName\+ASC/;
  var HumanTaskDescRegexp = /bonita\/API\/bpm\/humanTask.*\&f=user_id%3D[1-9]+.*\&o=displayName\+DESC/;

  var HumanTaskFilterRegexp = /bonita\/API\/bpm\/humanTask.*\&s=a.*/;
  var ArchivedHumanTaskRegexp = /bonita\/API\/bpm\/archivedHumanTask.*/;

   var TakeHumanTaskRegexp = /bonita\/API\/bpm\/humanTask\/2.*/;
  var ReleaseHumanTaskRegexp = /bonita\/API\/bpm\/humanTask\/19.*/;

  var formRegexp  = /bonita\/portal\/homepage\?.*ui=form.*/;

  when('GET', UserRegexp ).respond( mockUser );
  when('GET', CaseRegexp).respond( mockCase );
  when('GET', ProcessesRegexp).respond( mockProcesses );
  when('GET', ProcessRegexp).respond( mockProcesses[0] );
  when('GET', SupervisorRegexp).respond( mockSupervisor );
  when('GET', ContactRegexp).respond( mockContact );

  //order specific request before
  when('GET', HumanTaskFilterRegexp).respond( mockTasksFiltered );
  when('GET', HumanTaskProcess).respond( mockProcessTasks );

  when('GET', HumanTaskMYCount).respond( mockMyTask );
  when('GET', HumanTaskPOOLCount).respond( mockPoolTask );
  when('GET', HumanTaskAllCount).respond( mockTasksAsc );

  when('GET', HumanTaskAscRegexp).respond( mockTasksAsc );

  when('GET', HumanTaskDescRegexp).respond( mockTasksDesc );

  when('PUT', TakeHumanTaskRegexp).respond( takeTask );
  when('PUT', ReleaseHumanTaskRegexp).respond( releaseTask );

  when('GET', ArchivedHumanTaskRegexp).respond( mockDoneTasks );

  when('GET', ArchivedFlowNode).respond( mockArchivedFlowNode );
  when('GET', Comment).respond( mockComment );

  var form = fs.readFileSync(__dirname+'/fixtures/form.html', 'utf8');
  when('GET', formRegexp, 'html').respond( form );

})(module, false);
