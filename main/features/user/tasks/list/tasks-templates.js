(function(module) {
try {
  module = angular.module('org.bonitasoft.features.user.tasks.app.tpl');
} catch (e) {
  module = angular.module('org.bonitasoft.features.user.tasks.app.tpl', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/layoutswitch/layoutswitch.tpl.html',
    '<div class="LayoutSwitch pull-right">\n' +
    '  <div class="btn-group">\n' +
    '    <button class="btn btn-default"  title="Show task list with details pane"\n' +
    '            type="button"\n' +
    '            btn-radio="true"\n' +
    '            ng-model="value"\n' +
    '            ng-change="changeHandler(value)">\n' +
    '      <i class="icon-view-details"></i>\n' +
    '      <span class="sr-only">Show task list with details pane</span>\n' +
    '    </button>\n' +
    '    <button class="btn btn-default"  title="Show extended task list"\n' +
    '            type="button"\n' +
    '            btn-radio="false"\n' +
    '            ng-model="value"\n' +
    '            ng-change="changeHandler(value)">\n' +
    '        <i class="icon-view-list"></i>\n' +
    '        <span class="sr-only">Show extended task list</span>\n' +
    '    </button>\n' +
    '  </div>\n' +
    '</div><!-- Settings-display -->\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('org.bonitasoft.features.user.tasks.app.tpl');
} catch (e) {
  module = angular.module('org.bonitasoft.features.user.tasks.app.tpl', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/modal/modalDetails.tpl.html',
    '<div class="modal-body">\n' +
    '\n' +
    '  <button type="button" ng-click="modal.cancel()" class="close" title="close Preview">\n' +
    '    <span aria-hidden="true">&times;</span>\n' +
    '    <span class="sr-only">Close Preview</span>\n' +
    '  </button>\n' +
    '\n' +
    '  <task-details current-task="modal.task"\n' +
    '                current-case="modal.Case"\n' +
    '                editable="modal.task.assigned_id===modal.userId"\n' +
    '                inactive="false"\n' +
    '                active-tab="context"\n' +
    '                refresh="modal.onRefreshHandler()">\n' +
    '  </task-details>\n' +
    '</div>\n' +
    '<div class="modal-footer">\n' +
    '  <button type="button"\n' +
    '          class="btn btn-warning"\n' +
    '          title="close Preview"\n' +
    '          ng-click="modal.cancel()">\n' +
    '    Close Preview\n' +
    '</button>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('org.bonitasoft.features.user.tasks.app.tpl');
} catch (e) {
  module = angular.module('org.bonitasoft.features.user.tasks.app.tpl', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/modal/modalForm.tpl.html',
    '<div class="modal-body">\n' +
    '  <button type="button" ng-click="modal.cancel()" class="close" title="close form">\n' +
    '    <span aria-hidden="true">&times;</span>\n' +
    '    <span class="sr-only">Close</span>\n' +
    '  </button>\n' +
    '   <bonita-iframe-viewer class="FormViewer"\n' +
    '      tabindex="0"\n' +
    '      is-editable="modal.isFormEditable"\n' +
    '      frame-url="modal.formUrl"\n' +
    '      is-visible="modal.isFormVisible">\n' +
    '    </bonita-iframe-viewer>\n' +
    '</div>\n' +
    '<div class="modal-footer">\n' +
    '  <button type="button" class="btn btn-warning" title="close form" ng-click="modal.cancel()">Close form</button>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('org.bonitasoft.features.user.tasks.app.tpl');
} catch (e) {
  module = angular.module('org.bonitasoft.features.user.tasks.app.tpl', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/taskdetails/taskDetails.tpl.html',
    '<button class="pull-right btn btn-default"\n' +
    '        ng-click="onTakeReleaseTask()" title="{{editable ? \'Unassign the task and put it back in Available tasks\' : \'Assign the task to myself and move it to My tasks.\'}}">\n' +
    '  <i ng-class="{\'icon-take\':!editable, \'icon-release\':editable}"></i>\n' +
    '  <span class="sr-only">{{editable ? \'Release\' : \'Take\'}}</span>\n' +
    '</button>\n' +
    '\n' +
    '<tabset>\n' +
    '  <tab heading="Context"\n' +
    '       active="tab.context"\n' +
    '       ng-click="onClickTab(\'context\')" >\n' +
    '    <div ng-if="!inactive">\n' +
    '      <h3 class="Context-title">{{currentTask.name}}</h3>\n' +
    '      <p ng-if="currentTask.description">\n' +
    '        {{currentTask.description}}\n' +
    '      </p>\n' +
    '      <h4>Case Info</h4>\n' +
    '      <ul class="list-group">\n' +
    '        <li class="list-group-item" ng-repeat="supervisor in currentCase.supervisors">\n' +
    '          <span class="ListGroup-label">Process Supervisor&nbsp;:</span>\n' +
    '          <a ng-href="mailto:{{::supervisor.user_id.email}}" title="mail to {{::supervisor.user_id.name}}">\n' +
    '          {{::supervisor.user_id.email}}\n' +
    '          </a>\n' +
    '        </li>\n' +
    '        <li class="list-group-item">\n' +
    '          <span class="ListGroup-label">Process&nbsp;:</span>\n' +
    '          {{currentCase.processDefinitionId.name}}\n' +
    '        </li>\n' +
    '        <li class="list-group-item">\n' +
    '          <span class="ListGroup-label">case ID&nbsp;:</span>\n' +
    '          {{currentCase.id}}\n' +
    '        </li>\n' +
    '        <li class="list-group-item">\n' +
    '          <span class="ListGroup-label">Started by&nbsp;:</span>\n' +
    '           {{currentCase.started_by.userName}}\n' +
    '           on {{currentCase.start | moment:\'MMM DD YYYY - hh:mm a\'}}\n' +
    '        </li>\n' +
    '      </ul>\n' +
    '\n' +
    '      <h4>Case Overview</h4>\n' +
    '      <bonita-iframe-viewer\n' +
    '        class="CaseViewer"\n' +
    '        frame-url="overviewUrl"\n' +
    '        is-editable="true"\n' +
    '        is-visible="tab.context">\n' +
    '      </bonita-iframe-viewer>\n' +
    '\n' +
    '      <h4>Case History</h4>\n' +
    '      <div class="CaseHistory">\n' +
    '        <div class="CaseHistory-timeline">\n' +
    '\n' +
    '        <ul class="CaseHistory-events">\n' +
    '          <li class="CaseHistory-event" ng-repeat="item in currentCase.history">\n' +
    '            <span class="CaseHistory-eventDate">{{::item.date | moment:\'MMM DD YYYY - hh:mm a\'}}</span>\n' +
    '            {{::item.content}}\n' +
    '          </li>\n' +
    '        </ul>\n' +
    '\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </tab>\n' +
    '\n' +
    '  <tab heading="Form"\n' +
    '       ng-click="onClickTab(\'form\')"\n' +
    '       active="tab.form" >\n' +
    '    <p class="alert alert-info TaskInfo" ng-if="hideForm">\n' +
    '      This task is completed.\n' +
    '    </p>\n' +
    '\n' +
    '    <div ng-if="!hideForm">\n' +
    '      <p class="alert alert-warning" ng-if="!inactive && !editable">\n' +
    '        This task is not assigned to you. You need to take it before filling in this form.\n' +
    '      </p>\n' +
    '      <bonita-iframe-viewer class="FormViewer"\n' +
    '        tabindex="0"\n' +
    '        ng-if="!inactive"\n' +
    '        is-editable="editable"\n' +
    '        frame-url="formUrl"\n' +
    '        is-visible="tab.form">\n' +
    '      </bonita-form-viewer>\n' +
    '    </div>\n' +
    '  </tab>\n' +
    '\n' +
    '    <tab heading="Diagram"\n' +
    '         ng-click="onClickTab(\'diagram\')"\n' +
    '         active="tab.diagram" >\n' +
    '        <p class="alert alert-info TaskInfo" ng-if="hideForm">\n' +
    '            This task is completed.\n' +
    '        </p>\n' +
    '\n' +
    '        <div ng-if="!hideForm">\n' +
    '            <p class="alert alert-warning" ng-if="!inactive && !editable">\n' +
    '                This task is not assigned to you. You need to take it before filling in this form.\n' +
    '            </p>\n' +
    '            <h4>Case Visualization</h4>\n' +
    '            <bonita-iframe-viewer\n' +
    '                    class="DiagramViewer"\n' +
    '                    frame-url="diagramUrl"\n' +
    '                    is-editable="true"\n' +
    '                    is-visible="tab.context">\n' +
    '            </bonita-iframe-viewer>\n' +
    '        </div>\n' +
    '    </tab>\n' +
    '</tabset>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('org.bonitasoft.features.user.tasks.app.tpl');
} catch (e) {
  module = angular.module('org.bonitasoft.features.user.tasks.app.tpl', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/taskfilters/taskFilters.tpl.html',
    '<ul class="TaskFilters nav nav-pills nav-stacked">\n' +
    '  <!-- <a href="#" > is not good for a11n but it\'s a tradeoff for being themable\n' +
    '     that\'s why we use bottstrap markup-->\n' +
    '  <li role="presentation" ng-class="{\'active\':TASK_FILTERS.TODO===taskStatus}">\n' +
    '    <a href="#" title="Show all tasks that I can do, assigned to me or not assigned"\n' +
    '          ng-click="setStatusTaskFilter(TASK_FILTERS.TODO)">\n' +
    '      <span class="badge pull-right" ng-show="count.TODO>0">{{count.TODO}}</span>\n' +
    '      TO DO\n' +
    '    </a>\n' +
    '    <div  collapse="TASK_FILTERS.DONE === taskStatus">\n' +
    '      <ul class="TaskFilters nav nav-pills nav-stacked">\n' +
    '        <li role="presentation" ng-class="{\'active\':TASK_FILTERS.MY_TASK===taskStatus}">\n' +
    '          <a href="#" class="TaskFilter"\n' +
    '              title="Show tasks assigned to me, automatically, by me or by another user"\n' +
    '              ng-click="setStatusTaskFilter(TASK_FILTERS.MY_TASK)">\n' +
    '            <span class="badge pull-right" ng-show="count.MY_TASK>0">{{count.MY_TASK}}</span>\n' +
    '            My Tasks\n' +
    '          </a>\n' +
    '        </li><!-- my tasks -->\n' +
    '        <li role="presentation" ng-class="{\'active\':TASK_FILTERS.POOL_TASK===taskStatus}">\n' +
    '          <a href="#" class="TaskFilter"\n' +
    '              title="Show tasks that I can do that are not assigned"\n' +
    '              ng-click="setStatusTaskFilter(TASK_FILTERS.POOL_TASK)" >\n' +
    '            <span class="badge pull-right" ng-show="count.POOL_TASK>0">{{count.POOL_TASK}}</span>\n' +
    '            Available Tasks\n' +
    '          </a>\n' +
    '        </li><!-- available tasks -->\n' +
    '      </ul>\n' +
    '    </div>\n' +
    '  </li><!-- tasks -->\n' +
    '  <li role="presentation" ng-class="{\'active\':TASK_FILTERS.DONE===taskStatus}">\n' +
    '    <a href="#" title="Show done tasks"\n' +
    '      ng-click="setStatusTaskFilter(TASK_FILTERS.DONE)" >\n' +
    '      DONE\n' +
    '    </a>\n' +
    '  </li> <!-- done tasks -->\n' +
    ' </ul>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('org.bonitasoft.features.user.tasks.app.tpl');
} catch (e) {
  module = angular.module('org.bonitasoft.features.user.tasks.app.tpl', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/tasklist/taskList.tpl.html',
    '<!-- tasks listing -->\n' +
    '<div class="alert alert-noresult" ng-show="tasks.length === 0">\n' +
    '  No matching results\n' +
    '</div>\n' +
    '<div bonitable\n' +
    '  on-sort="refreshTasks()"\n' +
    '  sort-options="request.sortOption"\n' +
    '  bo-repeatable\n' +
    '  repeatable-config="columnSettings">\n' +
    '  <div class="GroupAction clearfix" ng-show="tasks.length > 0">\n' +
    '    <div class="GroupAction-button pull-left" ng-show="canDoGroupAction()">\n' +
    '      <button class="btn btn-default" type="button" title="Assign the task to myself and move it to My tasks."\n' +
    '         ng-disabled="!canTake($selectedItems)" ng-click="takeTasks($selectedItems)">\n' +
    '         <i class="icon-take"></i> Take\n' +
    '      </button>\n' +
    '      <button class="btn btn-default"  type="button" title="Unassign the task and put it back in Available tasks"\n' +
    '        ng-disabled="!canRelease($selectedItems)" ng-click="releaseTasks($selectedItems)">\n' +
    '        <i class="icon-release"></i> Release\n' +
    '      </button>\n' +
    '    </div>\n' +
    '    <div class="PaginationInfo pull-right">\n' +
    '      <!-- pagination -->\n' +
    '      <span class="PaginationInfo-summary">\n' +
    '        {{getPaginationStatus()}}\n' +
    '      </span>\n' +
    '      <pagination\n' +
    '        class="PaginationInfo-pagination"\n' +
    '        ng-show="request.pagination.total >= request.pagination.numberPerPage"\n' +
    '        total-items="request.pagination.total"\n' +
    '        ng-model="request.pagination.currentPage"\n' +
    '        items-per-page="request.pagination.numberPerPage"\n' +
    '        max-size="5"\n' +
    '        boundary-links="false"\n' +
    '        ng-change="refreshTasks()"\n' +
    '        previous-text="&lsaquo;" next-text="&rsaquo;"\n' +
    '        rotate="false">\n' +
    '      </pagination>\n' +
    '      <table-settings\n' +
    '        columns="$columns"\n' +
    '        page-size="request.pagination.numberPerPage" sizes="pageSizes"\n' +
    '        update-page-size="pageSizeHandler(size)"\n' +
    '        update-visibility="visibilityHandler(field, $columns)"\n' +
    '        ></table-settings>\n' +
    '      </table-settings>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '  <div class="table-responsive" ng-hide="tasks.length === 0">\n' +
    '    <table class="table table-hover table-striped">\n' +
    '      <thead>\n' +
    '        <tr>\n' +
    '          <th data-ignore class="Cell--checkbox" ng-if="canDoGroupAction()">\n' +
    '            <div bo-selectall></div>\n' +
    '          </th>\n' +
    '          <th data-ignore class="Cell--assignee">\n' +
    '            <i class="icon-user" title="Available or My tasks"></i>\n' +
    '          </th><!-- assigned icon -->\n' +
    '          <th class="text-right">Task Id</th>\n' +
    '          <th bo-sorter="displayName" style="width:30%; min-width:150px">Task name</th>\n' +
    '          <th style="width:30%; min-width:150px">Description</th>\n' +
    '          <th bo-sorter="processInstanceId" class="text-right">Case Id</th>\n' +
    '          <th style="width:30%; min-width:150px">Process name</th>\n' +
    '          <th class="text-right">Last update</th>\n' +
    '          <th class="text-right">Assigned on</th>\n' +
    '          <th bo-sorter="dueDate" class="text-right">Due date</th>\n' +
    '          <th bo-sorter="priority">Priority</th>\n' +
    '          <th data-ignore class="RowActions" ng-if="mode!==\'mid\'"></th>\n' +
    '        </tr>\n' +
    '      </thead>\n' +
    '      <tbody>\n' +
    '        <tr class="Line"\n' +
    '            ng-repeat="task in tasks"\n' +
    '            ng-click="onClickTask(task)"\n' +
    '            ng-mouseover="showTaskButtons(task)"\n' +
    '            ng-mouseleave="hideTaskButtons(task)"\n' +
    '            ng-class="{\'info\':task === currentTask}"\n' +
    '            tabindex="0">\n' +
    '\n' +
    '          <td class="Cell--checkbox" ng-if="canDoGroupAction()">\n' +
    '            <input type="checkbox" bo-selector="task" ng-click="onCheckBoxChange($event, $index)">\n' +
    '          </td>\n' +
    '\n' +
    '          <td>\n' +
    '            <i class="icon-user" title="My task" ng-if="user.user_id===task.assigned_id"></i>\n' +
    '          </td>\n' +
    '\n' +
    '          <td class="text-right">{{::task.id}}</td>\n' +
    '          <td class="Ellipsis" title="{{::task.displayName}}">{{::task.displayName}}</td>\n' +
    '          <td style="Ellipsis" title="{{::task.displayDescription}}">{{::task.displayDescription}}</td>\n' +
    '          <td class="text-right Cell--sortable">{{::task.caseId}}</td>\n' +
    '          <td class="Ellipsis">{{::task.rootContainerId.name}}</td>\n' +
    '          <td class="text-right" title="{{::task.last_update_date|moment:\'YYYY-MM-DD HH:mm\'}}">{{::task.last_update_date|moment:\'MMM DD YYYY\'}}</td>\n' +
    '          <td class="text-right" title="{{::task.assigned_date|moment:\'YYYY-MM-DD HH:mm\'}}">{{::task.assigned_date|moment:\'MMM DD YYYY\'}}</td>\n' +
    '          <td class="text-right  Cell--sortable" title="{{dueDate|moment:\'YYYY-MM-DD HH:mm\'}}">{{::task.dueDate|moment:\'MMM DD YYYY\'}}</td>\n' +
    '          <td>{{::task.priority}}</td>\n' +
    '          <td class="Cell--with-actions" ng-switch on="mode" ng-if="mode!==\'mid\'">\n' +
    '            <button  class="btn btn-default" type="button"\n' +
    '                    ng-switch-when="max"\n' +
    '                    ng-click="onDoTask(task)"\n' +
    '                    ng-show="task === currentTask || task.btnVisible"\n' +
    '                    title="Do this task">\n' +
    '              <i class="icon-do"></i>\n' +
    '              <span class="sr-only">Do task</span>\n' +
    '            </button>\n' +
    '            <button class="btn btn-default" type="button"\n' +
    '                    ng-click="onViewTask(task)"\n' +
    '                    ng-switch-when="max"\n' +
    '                    ng-show="task === currentTask || task.btnVisible"\n' +
    '                    title="View this task">\n' +
    '              <i class="icon-eye"></i>\n' +
    '              <span class="sr-only">View task</span>\n' +
    '            </button>\n' +
    '            <a class="btn btn-xs btn-default" type="button"\n' +
    '               ng-switch-when="min"\n' +
    '               ng-click="goToDetail(\'details\')"\n' +
    '               title="View this task">\n' +
    '              View task\n' +
    '            </a>\n' +
    '          </td>\n' +
    '        </tr>\n' +
    '      </tbody>\n' +
    '    </table>\n' +
    '  </div>\n' +
    '  <div class="GroupAction clearfix" ng-show="tasks.length > 0">\n' +
    '    <div class="GroupAction-button pull-left" ng-show="canDoGroupAction()">\n' +
    '      <button class="btn btn-default" type="button" title="Assign the task to myself and move it to My tasks."\n' +
    '         ng-disabled="!canTake($selectedItems)" ng-click="takeTasks($selectedItems)">\n' +
    '         <i class="icon-take"></i> Take\n' +
    '      </button>\n' +
    '      <button class="btn btn-default" type="button" title="Unassign the task and put it back in Available tasks"\n' +
    '        ng-disabled="!canRelease($selectedItems)" ng-click="releaseTasks($selectedItems)">\n' +
    '        <i class="icon-release"></i> Release\n' +
    '      </button>\n' +
    '    </div>\n' +
    '    <div class="PaginationInfo pull-right" >\n' +
    '      <!-- pagination -->\n' +
    '      <span class="PaginationInfo-summary">\n' +
    '        {{getPaginationStatus()}}\n' +
    '      </span>\n' +
    '      <pagination\n' +
    '        class="PaginationInfo-pagination"\n' +
    '        ng-show="request.pagination.total >= request.pagination.numberPerPage"\n' +
    '        total-items="request.pagination.total"\n' +
    '        ng-model="request.pagination.currentPage"\n' +
    '        items-per-page="request.pagination.numberPerPage"\n' +
    '        max-size="5"\n' +
    '        boundary-links="false"\n' +
    '        ng-change="refreshTasks()"\n' +
    '        previous-text="&lsaquo;" next-text="&rsaquo;"\n' +
    '        rotate="false">\n' +
    '      </pagination>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('org.bonitasoft.features.user.tasks.app.tpl');
} catch (e) {
  module = angular.module('org.bonitasoft.features.user.tasks.app.tpl', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/common/directive/bonita-iframe-viewer.tpl.html',
    '<div class="Viewer-wrapper">\n' +
    '  <iframe\n' +
    '    class="Viewer-frame"\n' +
    '    seamless\n' +
    '    scrolling="no"\n' +
    '    ng-src="{{url}}"\n' +
    '    width="100%" height="100%"\n' +
    '    frameborder="0" ></iframe>\n' +
    '  <div class="Viewer-overlay" ng-if="!isEditable"></div>\n' +
    '</div>\n' +
    '');
}]);
})();
