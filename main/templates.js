angular.module('org.bonitasoft.portalTemplates', ['portalTemplates/admin/applications/applications-list.html', 'portalTemplates/admin/applications/delete-application.html', 'portalTemplates/admin/applications/details/application-details-app.html', 'portalTemplates/admin/applications/details/application-details.html', 'portalTemplates/admin/applications/details/menubuilder-actionBar.html', 'portalTemplates/admin/applications/details/menubuilder-addCustomMenuModal.html', 'portalTemplates/admin/applications/details/menubuilder-menuCreator.html', 'portalTemplates/admin/applications/details/menubuilder-menuList.html', 'portalTemplates/admin/applications/details/page-list-addPageModal.html', 'portalTemplates/admin/applications/details/page-list.html', 'portalTemplates/admin/applications/details/popverunsafe.html', 'portalTemplates/admin/applications/edit-application-look-n-feel.html', 'portalTemplates/admin/applications/edit-application.html', 'portalTemplates/admin/applications/export-application.html', 'portalTemplates/admin/applications/import-application.html', 'portalTemplates/admin/cases/list/archived-cases-list-filters.html', 'portalTemplates/admin/cases/list/cases-list-deletion-modal.html', 'portalTemplates/admin/cases/list/cases-list-filters.html', 'portalTemplates/admin/cases/list/cases-list.html', 'portalTemplates/admin/cases/list/cases.html', 'portalTemplates/admin/mapping/actors.html', 'portalTemplates/admin/processes/details/actors-mapping.html', 'portalTemplates/admin/processes/details/delete-process-modal.html', 'portalTemplates/admin/processes/details/edit-actor-members.html', 'portalTemplates/admin/processes/details/information.html', 'portalTemplates/admin/processes/details/manage-category-mapping-modal.html', 'portalTemplates/admin/processes/details/menu.html', 'portalTemplates/admin/processes/details/params.html', 'portalTemplates/admin/processes/details/process-connectors.html', 'portalTemplates/user/cases/list/archived-cases-list-filters.html', 'portalTemplates/user/cases/list/cases-list-filters.html', 'portalTemplates/user/cases/list/cases-list.html', 'portalTemplates/user/cases/list/cases.html', 'portalTemplates/user/tasks/list/common/directive/bonita-iframe-viewer.html', 'portalTemplates/user/tasks/list/tasks-details.html', 'portalTemplates/user/tasks/list/tasks-filters.html', 'portalTemplates/user/tasks/list/tasks-layoutswitch.html', 'portalTemplates/user/tasks/list/tasks-list.html', 'portalTemplates/user/tasks/list/tasks-modal-details.html', 'portalTemplates/user/tasks/list/tasks-modal-form.html', 'portalTemplates/user/tasks/list/tasks-no-form.html', 'portalTemplates/user/tasks/list/tasks-table.html']);

angular.module('portalTemplates/admin/applications/applications-list.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/applications/applications-list.html',
    '<div class="container" id="content">\n' +
    '\n' +
    '  <h1>{{\'Application list\' | translate}}</h1>\n' +
    '\n' +
    '  <p>\n' +
    '    <button id="create-application" class="btn btn-primary" ng-click="applicationsListCtrl.create(\'lg\')" title="{{\'Create an application\' | translate}}">{{ \'New\' | translate}}</button>\n' +
    '    <button id="import-application" class="btn btn-primary" ng-click="applicationsListCtrl.importApp(\'lg\')" title="{{ \'Import an application\' | translate }}">{{ \'Import\' | translate}}</button>\n' +
    '  </p>\n' +
    '\n' +
    '  <section ng-if="noData">\n' +
    '    <p class="text-muted" id="no-data-header">{{ \'No application available.\' | translate}}</p>\n' +
    '    <p id="no-data-message">\n' +
    '      {{\'To create an application, click New or Import.\' | translate}}\n' +
    '      <br>\n' +
    '      {{\'An application is a customized environment for a specific user profile, in which users interact with business data and business processes in the most efficient way.\' | translate}}\n' +
    '    </p>\n' +
    '  </section>\n' +
    '\n' +
    '  <table ng-if="!noData" class="table resizable app-container-list" bonitable sort-options="sortableOptions" bo-storable="applications-list">\n' +
    '    <thead>\n' +
    '      <tr>\n' +
    '        <th bo-sorter="displayName" id="application-display-name" class="table-column-large" title="{{\'Sort by name\' | translate }}" bo-sorter-title-desc="{{\'Sort by name\' | translate }} Desc" bo-sorter-title-asc="{{\'Sort by name\' | translate }} Asc">{{ \'Name\' | translate }}</th>\n' +
    '        <th bo-sorter="version" id="application-version" class="table-column-xs" title="{{\'Sort by version\' | translate }}" bo-sorter-title-desc="{{\'Sort by version\' | translate }} Desc" bo-sorter-title-asc="{{\'Sort by version\' | translate }} Asc">{{\'Version\' | translate}}</th>\n' +
    '        <th bo-sorter="token" id="application-path" title="{{\'Sort by URL\' | translate }}" bo-sorter-title-desc="{{\'Sort by URL\' | translate }} Desc" bo-sorter-title-asc="{{\'Sort by URL\' | translate }} Asc">{{\'URL\' | translate}}</th>\n' +
    '        <th id="application-profile" class="table-column-xs">{{\'Profile\' | translate}}</th>\n' +
    '        <th bo-sorter="lastUpdateDate" id="application-last-update-date" class="table-column-xs" title="{{\'Sort by updated on\' | translate }}" bo-sorter-title-desc="{{\'Sort by updated on\' | translate }} Desc" bo-sorter-title-asc="{{\'Sort by updated on\' | translate }} Asc">{{\'Updated on\' | translate}}</th>\n' +
    '        <th data-noresize class="table-column-xs table-header-actions">{{\'Actions\' | translate}}</th>\n' +
    '      </tr>\n' +
    '    </thead>\n' +
    '    <tbody>\n' +
    '      <tr class="table-row table-row-{{$index}}" ng-repeat="application in applications | orderBy: sortableOptions.property : sortableOptions.direction track by $index">\n' +
    '        <td class="application-display-name" title="{{ application.displayName }}">{{ application.displayName }}</td>\n' +
    '        <td class="application-version" title="{{ application.version }}">{{ application.version }}</td>\n' +
    '        <td class="application-path">\n' +
    '          <a target="_blank" title="../apps/{{ application.token }}" ng-href="../apps/{{ application.token }}" ng-disabled="!application.profileId.name"> ../apps/{{application.token}}</a>\n' +
    '        </td>\n' +
    '        <td ng-if="application.profileId.name" class="application-profile" title="{{ application.profileId.name }}">{{ application.profileId.name }}</td>\n' +
    '        <td ng-if="!application.profileId.name" class="application-profile"><span tooltip="{{ \'No profile mapped to this application\' | translate }}" class="glyphicon glyphicon-warning-sign text-warning"></span></td>\n' +
    '        <td class="application-last-update-date" aria-label="{{ application.lastUpdateDate | dateI18n:\'YYYY-MM-DD HH:mm:ss\'}}">\n' +
    '          <span class="clickable" popover="{{applicationsListCtrl.loadTemplatePopover(application)}}" popover-trigger="mouseenter">{{ application.lastUpdateDate | dateAgo }}</span>\n' +
    '        </td>\n' +
    '        <td class="application-actions">\n' +
    '          <div class="btn-group">\n' +
    '            <button bonita-href="{ \'token\': \'applicationslistingadmin\', \'_id\': application.id }" class="glyphicon glyphicon-option-horizontal btn-action-edit" title="{{\'Edit\' | translate}}" aria-label="{{\'Edit\' | translate}}"></button>\n' +
    '            <button class="glyphicon glyphicon-export btn-action-export" title="{{\'Export\' | translate}}" aria-label="{{\'Export\' | translate}}" ng-click="applicationsListCtrl.exportApplication(application, \'sm\')"></button>\n' +
    '          </div>\n' +
    '          <button class="glyphicon glyphicon-trash btn-action-delete" aria-label="{{\'Delete\' | translate}}" title="{{\'Delete\' | translate}}" ng-click="applicationsListCtrl.deleteApplication(application, \'sm\')"></button>\n' +
    '        </td>\n' +
    '      </tr>\n' +
    '    </tbody>\n' +
    '  </table>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/admin/applications/delete-application.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/applications/delete-application.html',
    '<div class="modal-header">\n' +
    '    <h3 class="modal-title">{{\'Delete application\' | translate}}</h3>\n' +
    '</div>\n' +
    '<div class="modal-body">\n' +
    '    <p>{{ \'The application\' | translate }} <i>{{application.displayName||application.name}}</i> {{\'will be permanently deleted.\' | translate}}</p>\n' +
    '</div>\n' +
    '\n' +
    '<div class="modal-footer">\n' +
    '    <div class="form-group has-feedback">\n' +
    '        <div>\n' +
    '            <button id="confirm" type="submit" class="btn btn-primary" ng-click="confirmDelete(applicationId)" >{{\'Delete\' | translate}}</button>\n' +
    '            <button id="cancel" type="submit" class="btn btn-default" ng-click="cancel()">{{\'Cancel\' | translate}}</button>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/admin/applications/details/application-details-app.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/applications/details/application-details-app.html',
    '<div class="popover-item-content">\n' +
    '\n' +
    '  <dl class="popover-item-def">\n' +
    '    <dt>{{\'Creation\' | translate}}</dt>\n' +
    '    <dd>{{createdBy.firstname | ucfirst }} {{createdBy.lastname | ucfirst}} - {{creationDate | dateI18n:\'YYYY-MM-DD HH:mm\' }}</dd>\n' +
    '\n' +
    '  </dl>\n' +
    '\n' +
    '  <dl class="popover-item-def">\n' +
    '   <dt>{{\'Update\' | translate}}</dt>\n' +
    '   <dd>{{updatedBy.firstname | ucfirst }} {{updatedBy.lastname | ucfirst }} - {{lastUpdateDate | dateI18n:\'YYYY-MM-DD HH:mm\' }}</dd>\n' +
    '  </dl>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/admin/applications/details/application-details.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/applications/details/application-details.html',
    '<div id="app-details-container" class="container">\n' +
    '  <div class="btn-toolbar actions">\n' +
    '    <div class="col-md-2"><back-button></back-button></div>\n' +
    '    <div class="col-md-10 text-right"><button id="app-edit-btn" class="btn btn-primary" ng-click="applicationDetailsCtrl.update(\'lg\', app )" aria-label="{{\'Edit\' | translate}}">{{\'Edit\' | translate}}</button></div>\n' +
    '  </div>\n' +
    '  <div id="app-edit-section" class="app-details-container col-md-12">\n' +
    '    <h1 id="app-details-title">{{app.displayName}} ({{app.version}})</h1>\n' +
    '    <div class="panel panel-default">\n' +
    '      <div class="panel-body">\n' +
    '        <p id="app-details-description" class="type-info">{{ app.description }}</p>\n' +
    '        <div class="row">\n' +
    '          <div class="col-md-4">\n' +
    '            <dl class="dl-horizontal app-details-col">\n' +
    '              <dt id="app-path-label">{{\'URL\' | translate}}</dt>\n' +
    '              <dd id="app-path-value"><a target="_blank" title="../apps/{{ app.token }}" ng-href="../apps/{{ app.token }}">../apps/{{ app.token }}</a></dd>\n' +
    '              <dt id="app-profile-label">{{\'Profile\' | translate}}</dt>\n' +
    '              <dd id="app-profile-value">{{ app.profileId.name}}</dd>\n' +
    '            </dl>\n' +
    '          </div>\n' +
    '          <div class="col-md-4">\n' +
    '            <dl class="dl-horizontal">\n' +
    '              <dt id="app-creation-on-label">{{\'Creation on\' | translate}}</dt>\n' +
    '              <dd id="app-creation-on-value">{{ app.creationDate | dateI18n:\'YYYY-MM-DD HH:mm:ss\'}}</dd>\n' +
    '              <dt id="app-created-by-label">{{\'Created by\' | translate}}</dt>\n' +
    '              <dd id="app-created-by-value">{{ app.createdBy.firstname }} {{app.createdBy.lastname}}</dd>\n' +
    '            </dl>\n' +
    '          </div>\n' +
    '          <div class="col-md-4">\n' +
    '            <dl class="dl-horizontal">\n' +
    '              <dt id="app-updated-on-label">{{\'Updated on\' | translate}}</dt>\n' +
    '              <dd id="app-updated-on-value">{{ app.lastUpdateDate | dateI18n:\'YYYY-MM-DD HH:mm:ss\'}}</dd>\n' +
    '              <dt id="app-updated-by-label">{{\'Updated by\' | translate}}</dt>\n' +
    '              <dd id="app-updated-by-value">{{ app.updatedBy.firstname }} {{ app.updatedBy.lastname }}</dd>\n' +
    '            </dl>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '  <div id="look-n-feel-edit-section" class="col-md-12">\n' +
    '    <h2>{{\'Look & Feel\' | translate}}</h2>\n' +
    '    <div class="panel panel-default">\n' +
    '      <div class="row panel-body">\n' +
    '        <div class="col-md-6">\n' +
    '          <dl class="dl-horizontal app-details-col">\n' +
    '            <dt id="app-layout-label">{{\'Layout\' | translate}}</dt>\n' +
    '            <dd id="app-layout-value">\n' +
    '              <div  ng-if="!applicationDetailsCtrl.isEditLayoutAvailable">{{app.layoutId.displayName}}</div>\n' +
    '              <a  ng-if="applicationDetailsCtrl.isEditLayoutAvailable"  href="" editable-select="app.layoutId" onbeforesave="applicationDetailsCtrl.updateLayout(app, $data)" e-ng-options="layoutPage as layoutPage.displayName for layoutPage in layoutPages track by layoutPage.id">{{ app.layoutId.displayName }}</a>\n' +
    '            </dd>\n' +
    '          </dl>\n' +
    '        </div>\n' +
    '        <div class="col-md-6">\n' +
    '          <dl class="dl-horizontal app-details-col">\n' +
    '            <dt id="app-theme-label">{{\'Theme\' | translate}}</dt>\n' +
    '            <dd id="app-theme-value">\n' +
    '              <div  ng-if="!applicationDetailsCtrl.isEditLayoutAvailable">{{app.themeId.displayName}}</div>\n' +
    '              <a  ng-if="applicationDetailsCtrl.isEditLayoutAvailable"  href="" editable-select="app.themeId" onbeforesave="applicationDetailsCtrl.updateTheme(app, $data)"\n' +
    '                  e-ng-options="themePage as themePage.displayName for themePage in themePages track by themePage.id">{{ app.themeId.displayName }}</a>\n' +
    '            </dd>\n' +
    '          </dl>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '  <div id="application-page-list-section" ng-if="app.id">\n' +
    '    <page-list id="page-list" application="app" class="col-md-6"></page-list>\n' +
    '    <menu-creator id="menu-creator" app="app" class="col-md-6 menu-creator"></menu-creator>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/admin/applications/details/menubuilder-actionBar.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/applications/details/menubuilder-actionBar.html',
    '<div class="circle-indicator" data-nodrag="" ng-if="menu.parentMenuId === \'-1\' || !menu.parentMenuId"></div>\n' +
    '<span ng-transclude></span>\n' +
    '<button class="clickable glyphicon glyphicon-trash btn-action-remove pull-right" ng-click="actionBarCtrl.removeItem(this, menu)" ng-if="remove !== \'false\'" title="{{ \'Delete\' | translate }}" aria-label="{{ \'Delete\' | translate }}"></button>\n' +
    '<button class="clickable glyphicon glyphicon-pencil btn-action-edit pull-right" ng-click="actionBarCtrl.editItem(this, menu)" ng-if="edit !== \'false\'" title="{{ \'Edit\' | translate }}" aria-label="{{ \'Edit\' | translate }}"></button>\n' +
    '<button class="clickable glyphicon glyphicon-plus btn-action-add pull-right" ng-click="actionBarCtrl.addItem(this, menu)" ng-if="add !== \'false\'  && (!menu.applicationPageId || menu.applicationPageId === \'-1\')" title="{{ \'Add menu item\' | translate }}" aria-label="{{ \'Add menu item\' | translate }}"></button>\n' +
    '');
}]);

angular.module('portalTemplates/admin/applications/details/menubuilder-addCustomMenuModal.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/applications/details/menubuilder-addCustomMenuModal.html',
    '<form role="form" name="menu.form" novalidate>\n' +
    '\n' +
    '  <header class="modal-header">\n' +
    '\n' +
    '    <h3 class="modal-title" ng-if="!isEdition && !isAddition">{{ \'Add menu\' | translate}}</h3>\n' +
    '    <h3 class="modal-title" ng-if="isAddition">{{ \'Add menu item\' | translate}}</h3>\n' +
    '    <h3 class="modal-title" ng-if="isEdition && isEditionParentMenu">{{ \'Edit menu\' | translate}}</h3>\n' +
    '    <h3 class="modal-title" ng-if="isEdition && !isEditionParentMenu">{{ \'Edit menu item\' | translate}}</h3>\n' +
    '  </header>\n' +
    '  <div class="modal-body">\n' +
    '\n' +
    '    <section ng-show="!isEdition && !isAddition" class="menu-choice-container">\n' +
    '\n' +
    '      <div class="row">\n' +
    '        <div class="col-md-11 col-centered">\n' +
    '\n' +
    '          <div class="radio-inline">\n' +
    '            <label class="label-choice-inline">\n' +
    '              <input type="radio" name="typeMenu" id="setTopLevelMenu" ng-model="isLabelOnly"  value="inactive">\n' +
    '              {{\'One-page menu\' | translate}}\n' +
    '            </label>\n' +
    '            <label class="label-choice-inline">\n' +
    '              <input type="radio" name="typeMenu" id="setpageMenu"  ng-model="isLabelOnly" value="active" ng-change="menu.model.page = null">\n' +
    '              {{\'Multi-page menu\' | translate}}\n' +
    '            </label>\n' +
    '          </div>\n' +
    '\n' +
    '        </div>\n' +
    '\n' +
    '      </div>\n' +
    '    </section>\n' +
    '\n' +
    '    <bootstrap-form-control\n' +
    '      form="menu.form"\n' +
    '      label="{{\'Name\' | translate}}"\n' +
    '      errors="{ $invalid: i18n.mandatory, $duplicate: i18n.duplicateName }">\n' +
    '\n' +
    '      <input type="text" id="name" name="name" ng-model="menu.model.name" autofocus required ng-trim="false"/>\n' +
    '    </bootstrap-form-control>\n' +
    '\n' +
    '    <p ng-if="\'active\' === isLabelOnly && !(isAddition || isEdition)">{{\'Add pages in Navigation\' | translate}}</p>\n' +
    '\n' +
    '    <bootstrap-form-control\n' +
    '      form="menu.form"\n' +
    '      label="{{\'Page\' | translate}}"\n' +
    '      class="form-menu-pages select-form-container"\n' +
    '      ng-if="\'inactive\' === isLabelOnly || ((isAddition || isEdition) && \'inactive\' === isLabelOnly)">\n' +
    '      <select name="Page" id="page" required ng-model="menu.model.page">\n' +
    '        <option ng-repeat="page in pages track by $index" value="{{page.id}}" ng-selected="currentSelectedPageId == page.id">\n' +
    '          {{ page.pageId.displayName }} - {{ page.token }}\n' +
    '        </option>\n' +
    '      </select>\n' +
    '      <i>{{\'Select the page\' | translate}}</i>\n' +
    '    </bootstrap-form-control>\n' +
    '\n' +
    '\n' +
    '  </div>\n' +
    '\n' +
    '  <footer class="modal-footer modal-menu-footer">\n' +
    '    <button id="add-page-pop-up-add-btn" class="btn btn-primary" ng-click="addCustomMenuCtrl.saveModal(menu)" ng-disabled="menu.form.$invalid" >{{ isEdition ? \'Save\' : \'Add\' | translate}}</button>\n' +
    '\n' +
    '    <button type="button" id="add-page-pop-up-cancel-btn" class="btn btn-default" ng-click="addCustomMenuCtrl.cancel()">{{\'Cancel\' | translate}}</button>\n' +
    '  </footer>\n' +
    '</form>\n' +
    '');
}]);

angular.module('portalTemplates/admin/applications/details/menubuilder-menuCreator.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/applications/details/menubuilder-menuCreator.html',
    '<header class="page-header">\n' +
    '<h2>{{ \'Navigation\' | translate }}</h2>\n' +
    '</header>\n' +
    '\n' +
    '<div class="col-md-3">\n' +
    '    <button id="menu-list-add-button" ng-click="menuCreatorCtrl.add()" ng-disabled="!hasPages" class="btn btn-primary"\n' +
    '            title="{{\'Add top-level menu\' | translate}}">{{ \'Add\' | translate }}\n' +
    '    </button>\n' +
    '</div>\n' +
    '<div class="col-md-9">\n' +
    '  <div class="jumbotron" ng-if="!data.menuItemBuilder.length">\n' +
    '    <em>{{ \'Specify the menu structure.\' | translate }}<br> {{ \'You must add a page before you can reference it in a\n' +
    '      menu.\' | translate }}</em>\n' +
    '  </div>\n' +
    '  <menu-list ng-model="data.menuItemBuilder" ng-if="data.menuItemBuilder.length"></menu-list>\n' +
    '</div>\n' +
    '\n' +
    '');
}]);

angular.module('portalTemplates/admin/applications/details/menubuilder-menuList.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/applications/details/menubuilder-menuList.html',
    '<div class="container-menubuilder" ui-tree="treeOptions" data-max-depth="2">\n' +
    '\n' +
    '  <ul class="list-group" ui-tree-nodes="" data-ng-model="model">\n' +
    '\n' +
    '    <li class="list-group-item" data-ng-repeat="menu in model" ui-tree-node ng-class="{\'menucontainer-has-submenu-items\': !menu.applicationPageId || menu.applicationPageId === \'-1\', \'menucontainer-no-submenu-items\': menu.applicationPageId && menu.applicationPageId !== \'-1\'}">\n' +
    '         <div ui-tree-handle ng-class="{\'hidden-submenu\': collapsed}">\n' +
    '           <action-bar collapsed="collapsed" menu="menu" data="data">{{menu.displayName}}</action-bar>\n' +
    '         </div>\n' +
    '\n' +
    '         <ul ui-tree-nodes="" ng-if="!menu.applicationPageId || menu.applicationPageId === \'-1\'" data-ng-model="menu.children" ng-class="{\'menucontainer-submenu-exist\':menu.children.length,\'menucontainer-submenu\':!menu.children.length}" ><li data-ng-repeat="subItem in menu.children"  ui-tree-node>\n' +
    '             <div ui-tree-handle>\n' +
    '                <action-bar add="false" menu="subItem" data="data">{{subItem.displayName}}</action-bar>\n' +
    '             </div>\n' +
    '           </li></ul>\n' +
    '\n' +
    '       </li>\n' +
    '  </ul>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/admin/applications/details/page-list-addPageModal.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/applications/details/page-list-addPageModal.html',
    '<form role="form" name="page.form" novalidate>\n' +
    '  <div class="modal-header">\n' +
    '    <h3 class="modal-title">{{ \'Add page\' | translate }}</h3>\n' +
    '  </div>\n' +
    '\n' +
    '  <div class="modal-body">\n' +
    '    <alert ng-repeat="alert in alerts track by $id(alert)" type="{{ alert.type }}" close="closeAlert($index)">{{alert.msg}}</alert>\n' +
    '    <bootstrap-form-control\n' +
    '      id="page-form-control"\n' +
    '      form="page.form"\n' +
    '      label="{{ \'Page\' | translate }}"\n' +
    '      errors="{ $invalid: i18n.mandatory }"\n' +
    '      class="select-form-container">\n' +
    '      <select name="Page" id="page" ng-model="page.model.pageId" required>\n' +
    '        <option ng-repeat="customPage in customPages" value="{{ customPage.id }}">\n' +
    '          {{ customPage.urlToken }} - {{ customPage.displayName }}\n' +
    '        </option>\n' +
    '      </select>\n' +
    '    </bootstrap-form-control>\n' +
    '\n' +
    '    <bootstrap-form-control\n' +
    '      id="url-form-control"\n' +
    '      form="page.form"\n' +
    '      label="{{ \'URL\' | translate }}"\n' +
    '      errors="{ $invalid: i18n.mandatory, $duplicate: i18n.duplicateUrl, $reservedToken: i18n.reservedToken}">\n' +
    '      <div class="input-group">\n' +
    '        <span class="input-group-addon">../apps/{{application.token}}/</span>\n' +
    '        <input type="text" id="token" name="token" ng-model="page.model.token" required urlified ng-trim="false"/>\n' +
    '      </div>\n' +
    '    </bootstrap-form-control>\n' +
    '\n' +
    '  </div>\n' +
    '  <div class="modal-footer">\n' +
    '    <button id="add-page-pop-up-add-btn" class="btn btn-primary" type="submit" ng-click="add(page)" ng-disabled="page.form.$invalid">{{\'Add\' | translate}}\n' +
    '    </button>\n' +
    '    <button id="add-page-pop-up-cancel-btn" class="btn btn-default" ng-click="cancel()">{{\'Cancel\' | translate}}</button>\n' +
    '  </div>\n' +
    '</form>\n' +
    '');
}]);

angular.module('portalTemplates/admin/applications/details/page-list.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/applications/details/page-list.html',
    '<header class="page-header">\n' +
    '  <h2>{{\'Pages\' | translate}}</h2>\n' +
    '</header>\n' +
    '<div class="col-md-3">\n' +
    '  <button id="page-list-add-button" ng-click="list.add()" class="btn btn-primary" title="{{ \'Add from custom pages\' | translate }}">{{\'Add\' | translate}}</button>\n' +
    '</div>\n' +
    '<div class="col-md-9">\n' +
    '  <table class="table table-condensed">\n' +
    '    <tbody>\n' +
    '      <tr ng-repeat="page in pages track by $index" class="table-row table-row-{{$index}}"\n' +
    '      ng-class="{\'page-is-home\': application.homePageId == page.id}">\n' +
    '        <td class="page-name">\n' +
    '          {{ page.token }} - <em>{{ page.pageId.displayName }}</em>\n' +
    '        </td>\n' +
    '        <td class="td-small">\n' +
    '          <button class="btn-action-sethome clickable glyphicon glyphicon-home"\n' +
    '              title="{{\'Set as Home page\' | translate}}"\n' +
    '              ng-click="list.setAsHomePage(page)">\n' +
    '            <span aria-hidden="true">{{\'Set as Home page\' | translate}}</span>\n' +
    '          </button>\n' +
    '        </td>\n' +
    '        <td class="td-small">\n' +
    '          <button class="btn-action-delete clickable glyphicon glyphicon-trash"\n' +
    '              title="{{\'Remove\' | translate}}"\n' +
    '              ng-if="application.homePageId != page.id"\n' +
    '              ng-click="list.remove(page)">\n' +
    '            <span aria-hidden="true">{{\'Remove\' | translate}}</span>\n' +
    '          </button>\n' +
    '        </td>\n' +
    '      </tr>\n' +
    '    </tbody>\n' +
    '  </table>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/admin/applications/details/popverunsafe.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/applications/details/popverunsafe.html',
    '<div class="popover {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n' +
    '  <div class="arrow"></div>\n' +
    '\n' +
    '  <div class="popover-inner">\n' +
    '      <h3 class="popover-title" ng-bind="title" ng-show="title"></h3>\n' +
    '      <div class="popover-content" bind-html-unsafe="content"></div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/admin/applications/edit-application-look-n-feel.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/applications/edit-application-look-n-feel.html',
    '<form role="form" name="application.form" novalidate>\n' +
    '  <div class="modal-header">\n' +
    '    <h3 class="modal-title">{{ editionMode ? "Edit" : "Create" |\n' +
    '     translate }} {{\'an Application\' | translate}}</h3>\n' +
    '  </div>\n' +
    '  <div class="modal-body">\n' +
    '\n' +
    '    <alert ng-repeat="alert in alerts" type="{{ alert.type }}" close="closeAlert($index)">{{alert.msg}}</alert>\n' +
    '    <bootstrap-form-control form="application.form" class="select-form-container" label="{{ \'Layout\' | translate }}">\n' +
    '      <select id="profile"\n' +
    '              name="profile" ng-model="application.model.layoutId"\n' +
    '              ng-options="layoutPage.id as layoutPage.urlToken + \' - \' + layoutPage.displayName for layoutPage in layoutPages"></select>\n' +
    '\n' +
    '\n' +
    '    </bootstrap-form-control>\n' +
    '\n' +
    '    <bootstrap-form-control form="application.form" class="select-form-container" label="{{ \'Theme\' | translate }}">\n' +
    '      <select id="theme"\n' +
    '              name="layout" ng-model="application.model.themeId">\n' +
    '        <option ng-repeat="layoutPage in layoutPages" value="{{ layoutPage.id }}">\n' +
    '          {{ layoutPage.urlToken }} - {{ layoutPage.displayName }}\n' +
    '        </option>\n' +
    '      </select>\n' +
    '    </bootstrap-form-control>\n' +
    '  </div>\n' +
    '  <div class="modal-footer">\n' +
    '    <div class="form-group has-feedback">\n' +
    '      <div>\n' +
    '        <button id="btn-submit" type="submit" class="btn btn-primary" ng-disabled="application.form.$invalid"\n' +
    '                ng-click="submit(application)">{{ "Save" | translate }}\n' +
    '        </button>\n' +
    '        <button id="btn-cancel" type="submit" class="btn btn-default" ng-click="cancel()">{{ \'Cancel\' | translate}}</button>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</form>\n' +
    '');
}]);

angular.module('portalTemplates/admin/applications/edit-application.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/applications/edit-application.html',
    '<form role="form" name="application.form" novalidate>\n' +
    '  <div class="modal-header">\n' +
    '    <h3 class="modal-title">{{ editionMode ? "Edit" : "Create" |\n' +
    '     translate }} {{\'an application\' | translate}}</h3>\n' +
    '  </div>\n' +
    '  <div class="modal-body">\n' +
    '\n' +
    '    <alert ng-repeat="alert in alerts" type="{{ alert.type }}" close="closeAlert($index)">{{alert.msg}}</alert>\n' +
    '\n' +
    '    <bootstrap-form-control\n' +
    '      id="display-name-form-control"\n' +
    '      form="application.form"\n' +
    '      label="{{ \'Display name\' | translate }}"\n' +
    '      errors="{ $invalid: i18n.mandatory }">\n' +
    '      <input type="text"\n' +
    '             id="display-name"\n' +
    '             name="displayName"\n' +
    '             ng-model="application.model.displayName"\n' +
    '             maxlength="255" required/>\n' +
    '    </bootstrap-form-control>\n' +
    '\n' +
    '    <bootstrap-form-control\n' +
    '      id="url-form-control"\n' +
    '      form="application.form"\n' +
    '      label="{{ \'URL\' | translate }}"\n' +
    '      errors="{ $invalid: i18n.mandatory, $duplicate: i18n.duplicateUrl, $reservedToken: i18n.reservedToken}">\n' +
    '      <div class="input-group">\n' +
    '        <span class="input-group-addon">../apps/</span>\n' +
    '        <input type="text"\n' +
    '               id="url"\n' +
    '               name="token"\n' +
    '               ng-model="application.model.token"\n' +
    '               maxlength="50"\n' +
    '               urlified required ng-trim="false"/>\n' +
    '      </div>\n' +
    '\n' +
    '    </bootstrap-form-control>\n' +
    '\n' +
    '    <bootstrap-form-control\n' +
    '      id="version-form-control"\n' +
    '      form="application.form"\n' +
    '      label="{{ \'Version\' | translate }}"\n' +
    '      errors="{ $invalid: i18n.mandatory }">\n' +
    '      <input type="text"\n' +
    '             id="version"\n' +
    '             name="version"\n' +
    '             ng-model="application.model.version"\n' +
    '             maxlength="50" required/>\n' +
    '    </bootstrap-form-control>\n' +
    '\n' +
    '    <bootstrap-form-control form="application.form" class="select-form-container" label="{{ \'Profile\' | translate }}">\n' +
    '      <select id="profile"\n' +
    '              name="profile" ng-model="application.model.profileId"\n' +
    '              ng-options="profile.id as profile.name for profile in profiles" required></select>\n' +
    '    </bootstrap-form-control>\n' +
    '\n' +
    '\n' +
    '    <bootstrap-form-control form="application.form" label="{{\'Description\' | translate}}">\n' +
    '      <textarea id="description"\n' +
    '                name="description"\n' +
    '                ng-model="application.model.description"\n' +
    '                maxlength="1024"></textarea>\n' +
    '    </bootstrap-form-control>\n' +
    '  </div>\n' +
    '\n' +
    '  <div class="modal-footer">\n' +
    '    <div class="form-group has-feedback">\n' +
    '      <div>\n' +
    '        <button id="btn-submit" type="submit" class="btn btn-primary" ng-disabled="application.form.$invalid"\n' +
    '                ng-click="submit(application)">{{ editionMode ? "Save" : "Create" | translate }}\n' +
    '        </button>\n' +
    '        <button id="btn-cancel" type="submit" class="btn btn-default" ng-click="cancel()">{{ \'Cancel\' | translate}}</button>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</form>\n' +
    '');
}]);

angular.module('portalTemplates/admin/applications/export-application.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/applications/export-application.html',
    '<div class="modal-header">\n' +
    '    <h3 class="modal-title">{{ \'Export application\' | translate}}</h3>\n' +
    '</div>\n' +
    '<div class="modal-body">\n' +
    '    <p>{{\'You are about to export the application\' | translate}} <i>{{application.displayName||application.name}}</i>.<br> {{\'When you export an application, pages and profiles are not exported in the file.\' | translate}}</p>\n' +
    '</div>\n' +
    '\n' +
    '<div class="modal-footer">\n' +
    '  <div class="form-group has-feedback">\n' +
    '    <export-app-button\n' +
    '      id="confirm"\n' +
    '      app-id="{{application.id}}"\n' +
    '      class="btn btn-primary"\n' +
    '      ng-click="exportApplicationCtrl.cancel()"\n' +
    '      >{{\'Export\' | translate}}\n' +
    '    </export-app-button>\n' +
    '    <button\n' +
    '      id="cancel"\n' +
    '      class="btn btn-default"\n' +
    '      ng-click="exportApplicationCtrl.cancel()">{{\'Cancel\' | translate}}\n' +
    '    </button>\n' +
    '   </div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/admin/applications/import-application.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/applications/import-application.html',
    '<form role="form" name="form" novalidate>\n' +
    '  <div class="modal-header">\n' +
    '    <h3 class="modal-title" ng-if="!importIsSuccessfull && !importNotSuccessfull">{{\'Import an application\' | translate}}</h3>\n' +
    '    <h3 class="modal-title" ng-if="importIsSuccessfull">{{\'Status of import\' | translate}}</h3>\n' +
    '    <h3 class="modal-title" ng-if="importNotSuccessfull">{{\'Error\' | translate}}</h3>\n' +
    '  </div>\n' +
    '  <div class="modal-body">\n' +
    '\n' +
    '    <section id="beforeImport" ng-if="!importIsSuccessfull && !importNotSuccessfull">\n' +
    '      <p>{{ \'Before you import the application, the pages and the profile must already be loaded in the Portal.\' | translate }}</p>\n' +
    '\n' +
    '      <bootstrap-form-control\n' +
    '        class="field-upload-container"\n' +
    '        form="form"\n' +
    '        label="{{\'Application XML file\' | translate}}">\n' +
    '\n' +
    '        <div class="upload-field">\n' +
    '          <input type="file" id="importAppXml" name="import-file" ng-model="importFile.file" required nv-file-select uploader="uploader" accept=".xml">\n' +
    '          <div class="upload-field-content" ng-class="{\'upload-success\': isUploadSuccess}"><span ng-if="fileName">{{fileName}}</span><span ng-if="!fileName">{{ \'Click here to choose your file. XML file (.xml)\' | translate }}</span></div>\n' +
    '        </div>\n' +
    '\n' +
    '      </bootstrap-form-control>\n' +
    '    </section>\n' +
    '\n' +
    '    <section id="afterImport" ng-if="importIsSuccessfull" >\n' +
    '\n' +
    '      <div class="import-status">\n' +
    '        <p ng-if="!errorsApi.length">1 {{\'application has been successfully imported, with complete page mapping and menu mapping.\' | translate}}</p>\n' +
    '\n' +
    '        <p ng-if="errorsApi.length">1 {{\'application has been partially imported. The following items are not loaded in the Portal.\' | translate}}</p>\n' +
    '\n' +
    '        <ul>\n' +
    '          <li ng-repeat="imported in imports track by $index">{{\'URL\' | translate }}: ../apps/{{ imported.name}}</li>\n' +
    '        </ul>\n' +
    '\n' +
    '        <ul ng-if="errorsApi.length">\n' +
    '          <li ng-repeat="error in errorsApi track by $index">\n' +
    '            <span arial-label="application">{{\'URL\' | translate }}: ../apps/{{ error.name}}</span>\n' +
    '\n' +
    '            <ul ng-repeat="(key, value) in error.errors track by $index">\n' +
    '              <li ng-repeat="label in value track by $index">{{label}}  {{ key | lowercase | ucfirst }}</li>\n' +
    '            </ul>\n' +
    '          </li>\n' +
    '        </ul>\n' +
    '      </div>\n' +
    '    </section>\n' +
    '\n' +
    '    <section id="afterImportError" ng-if="importNotSuccessfull">\n' +
    '      <p>{{messageError}}.</p>\n' +
    '    </section>\n' +
    '\n' +
    '  </div>\n' +
    '\n' +
    '  <div class="modal-footer">\n' +
    '      <div class="form-group has-feedback">\n' +
    '          <div class="col-md-12 col-centered-text center-block">\n' +
    '              <button\n' +
    '                ng-if="!importIsSuccessfull && !importNotSuccessfull"\n' +
    '                id="confirm"\n' +
    '                ng-disabled="!isUploadSuccess"\n' +
    '                class="btn btn-primary"\n' +
    '                ng-click="importApplicationCtrl.importApp()">{{ \'Import\' | translate }}\n' +
    '              </button>\n' +
    '              <button\n' +
    '                ng-if="!importIsSuccessfull && !importNotSuccessfull"\n' +
    '                id="cancel"\n' +
    '                class="btn btn-default"\n' +
    '                ng-click="importApplicationCtrl.cancel()">{{ \'Cancel\' | translate }}\n' +
    '              </button>\n' +
    '\n' +
    '              <button\n' +
    '                ng-if="importIsSuccessfull"\n' +
    '                id="cancel"\n' +
    '                class="btn btn-default"\n' +
    '                ng-click="importApplicationCtrl.closeModalSuccess()">{{ \'Close\' | translate }}\n' +
    '              </button>\n' +
    '\n' +
    '              <button\n' +
    '                ng-if="importNotSuccessfull"\n' +
    '                id="cancel"\n' +
    '                class="btn btn-default center-block"\n' +
    '                ng-click="importApplicationCtrl.cancel()">{{ \'Close\' | translate }}\n' +
    '              </button>\n' +
    '          </div>\n' +
    '      </div>\n' +
    '  </div>\n' +
    '</form>\n' +
    '');
}]);

angular.module('portalTemplates/admin/cases/list/archived-cases-list-filters.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/cases/list/archived-cases-list-filters.html',
    '<div id="case-filters" class="panel panel-default">\n' +
    '\n' +
    '  <div class="panel-heading title">{{ \'Filters\' | translate }}</div>\n' +
    '  <div class="panel-body">\n' +
    '    <div class="col-md-3 button-filter"> {{ \'Process name\' | translate }}\n' +
    '      <div class="btn-group" dropdown id="case-app-name-filter">\n' +
    '        <button type="button" dropdown-toggle class="btn btn-primary dropdown-toggle ">{{selectedFilters.selectedApp | translate}} <span class="caret"></span></button>\n' +
    '        <ul class="dropdown-menu" role="menu">\n' +
    '          <li ng-click="filterCtrl.selectApp(defaultFilters.appName)"><a>{{defaultFilters.appName | translate}}</a></li>\n' +
    '          <li ng-if="appNames &amp;&amp; appNames.length>0" class="divider"></li>\n' +
    '          <li ng-repeat="appName in appNames" ng-click="filterCtrl.selectApp(appName)"><a>{{appName}}</a></li>\n' +
    '        </ul>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="col-md-3 button-filter">{{\'Process version\' | translate }}\n' +
    '      <div class="btn-group" dropdown id="case-app-version-filter">\n' +
    '        <button type="button" dropdown-toggle class="btn btn-primary dropdown-toggle " ng-disabled="selectedFilters.selectedApp  === defaultFilters.appName">{{selectedFilters.selectedVersion | translate}} <span class="caret"></span></button>\n' +
    '        <ul class="dropdown-menu" role="menu">\n' +
    '          <li ng-click="filterCtrl.selectVersion(defaultFilters.appVersion)"><a>{{defaultFilters.appVersion | translate}}</a></li>\n' +
    '          <li class="divider"></li>\n' +
    '          <li ng-repeat="version in versions" ng-click="filterCtrl.selectVersion(version)"><a>{{version}}</a></li>\n' +
    '        </ul>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="col-md-3 button-filter">\n' +
    '    </div>\n' +
    '    <div class="col-md-3 button-filter">\n' +
    '      <form role="form" name="searchForm" novalidate ng-submit="filterCtrl.submitSearch()">\n' +
    '          <div class="input-group">\n' +
    '            <input type="text" class="form-control" ng-model="selectedFilters.currentSearch" name="searchField" id="case-list-search" placeholder="{{ \'Search...\' | translate }}">\n' +
    '            <span ng-click="filterCtrl.submitSearch()" class="input-group-addon pointer"><span class="glyphicon glyphicon-search"></span></span>\n' +
    '          </div>\n' +
    '      </form>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/admin/cases/list/cases-list-deletion-modal.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/cases/list/cases-list-deletion-modal.html',
    '<div class="modal-header">\n' +
    '  <h3 class="modal-title">{{ \'Confirm delete?\' | translate }}</h3>\n' +
    '</div>\n' +
    '\n' +
    '<div ng-if="\'archived\' !==  typeOfCase">\n' +
    '  <div class="modal-body" ng-if="1 === caseItems.length">\n' +
    '    {{ \'The deleted case will be permanently deleted and will not be stored in the archives.\' | translate }}\n' +
    '  </div>\n' +
    '\n' +
    '  <div class="modal-body" ng-if="caseItems.length > 1">\n' +
    '    {{ \'These deleted cases will be permanently deleted and will not be stored in the archives.\' | translate }}\n' +
    '  </div>\n' +
    '</div>\n' +
    '\n' +
    '<div ng-if="\'archived\' === typeOfCase ">\n' +
    '  <div class="modal-body" ng-if="1 === caseItems.length">\n' +
    '    {{ \'The deleted case will be permanently deleted from the archives.\' | translate }}\n' +
    '  </div>\n' +
    '\n' +
    '  <div class="modal-body" ng-if="caseItems.length > 1">\n' +
    '    {{ \'These deleted cases will be permanently deleted from the archives.\' | translate }}\n' +
    '  </div>\n' +
    '</div>\n' +
    '\n' +
    '<div class="modal-footer">\n' +
    '    <button id="ValidateCaseDeletionBtn" class="btn btn-primary" ng-click="deleteCaseModalCtrl.ok()">{{ \'Delete\' | translate }}</button>\n' +
    '    <button id="CancelCaseDeletionBtn" class="btn btn-default" ng-click="deleteCaseModalCtrl.cancel()">{{ \'Cancel\' | translate }}</button>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/admin/cases/list/cases-list-filters.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/cases/list/cases-list-filters.html',
    '<div id="case-filters" class="panel panel-default">\n' +
    '  <div class="panel-heading title">{{\'Filters\' | translate}}</div>\n' +
    '  <div class="panel-body">\n' +
    '    <div class="col-md-3 button-filter">{{\'Process name\' | translate}}\n' +
    '      <div class="btn-group" dropdown id="case-app-name-filter">\n' +
    '        <button type="button" dropdown-toggle class="btn btn-primary dropdown-toggle">{{selectedFilters.selectedApp | translate}} <span class="caret"></span></button>\n' +
    '        <ul class="dropdown-menu" role="menu">\n' +
    '          <li ng-click="filterCtrl.selectApp(defaultFilters.appName)"><a>{{defaultFilters.appName | translate}}</a></li>\n' +
    '          <li ng-if="appNames &amp;&amp; appNames.length>0" class="divider"></li>\n' +
    '          <li ng-repeat="appName in appNames" ng-click="filterCtrl.selectApp(appName)"><a>{{appName}}</a></li>\n' +
    '        </ul>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="col-md-3 button-filter">{{\'Process version\' | translate}}\n' +
    '      <div class="btn-group" dropdown id="case-app-version-filter">\n' +
    '        <button type="button" dropdown-toggle class="btn btn-primary dropdown-toggle" ng-disabled="selectedFilters.selectedApp  === defaultFilters.appName">{{selectedFilters.selectedVersion | translate}} <span class="caret"></span></button>\n' +
    '        <ul class="dropdown-menu" role="menu">\n' +
    '          <li ng-click="filterCtrl.selectVersion(defaultFilters.appVersion)"><a>{{defaultFilters.appVersion | translate}}</a></li>\n' +
    '          <li class="divider"></li>\n' +
    '          <li ng-repeat="version in versions" ng-click="filterCtrl.selectVersion(version)"><a>{{version}}</a></li>\n' +
    '        </ul>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="col-md-3 button-filter">{{\'Case state\' | translate}}\n' +
    '      <div class="btn-group" dropdown id="case-app-status-filter">\n' +
    '        <button type="button" dropdown-toggle class="btn btn-primary dropdown-toggle">{{caseStatesValues[selectedFilters.selectedStatus] | translate}} <span class="caret"></span></button>\n' +
    '        <ul class="dropdown-menu" role="menu">\n' +
    '          <li ng-click="filterCtrl.selectCaseStatus(defaultFilters.caseStatus)"><a>{{defaultFilters.caseStatus | translate}}</a></li>\n' +
    '          <li class="divider"></li>\n' +
    '          <li ng-click="filterCtrl.selectCaseStatus(\'error\')"><a>{{\'With failures\' | translate}}</a></li>\n' +
    '        </ul>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="col-md-3">\n' +
    '      <form role="form" name="searchForm" novalidate ng-submit="filterCtrl.submitSearch()">\n' +
    '        <div class="input-group">\n' +
    '          <input type="text" class="form-control" ng-model="selectedFilters.currentSearch" name="searchField" id="case-list-search" placeholder="{{ \'Search...\' | translate }}">\n' +
    '          <span ng-click="filterCtrl.submitSearch()" class="input-group-addon pointer"><span class="glyphicon glyphicon-search"></span></span>\n' +
    '        </div>\n' +
    '      </form>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/admin/cases/list/cases-list.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/cases/list/cases-list.html',
    '<div>\n' +
    '\n' +
    '  <div ng-switch on="archivedTabName">\n' +
    '    <archived-case-filters ng-switch-when="true"> </archived-case-filters>\n' +
    '    <active-case-filters ng-switch-default> </active-case-filters>\n' +
    '  </div>\n' +
    '  <div class="panel panel-default">\n' +
    '\n' +
    '    <div class="panel-heading title">{{ \'Case list\' | translate }} <span id="infoPopover" class="glyphicon glyphicon-info-sign" popover="{{\'Only cases from root processes are displayed in the table below. No details are available for cases started by call activities.\' | translate}}" popover-trigger="mouseenter"></span> <span ng-click="caseCtrl.reinitCases()" tooltip="{{ \'Refresh\' | translate}}" tooltip-animation="false" tooltip-popup-delay="300" class="case-list-refresh glyphicon glyphicon-repeat"></span></div>\n' +
    '    <div class="panel-body">\n' +
    '      <div growl></div>\n' +
    '      <div ng-show="cases.length">\n' +
    '        <div class="col-md-12">\n' +
    '          <table ng-if="!archivedTabName" bonitable bo-storable="admin-cases-list" on-storage-loaded="caseCtrl.loadContent()" bo-repeatable  on-sort="caseCtrl.updateSortField(sortOptions)" sort-options="sortOptions" resizable-column="$columns" resize-selector="tr th.case-column" class="table table-striped table-hover table-responsive">\n' +
    '            <thead>\n' +
    '              <tr>\n' +
    '                <th colspan="{{$columns.length+2}}">\n' +
    '                  <div class="pull-left case-action table-buttons">\n' +
    '                    <div class="case-action table-buttons"> <active-case-delete>{{\'Delete\' | translate}}</active-case-delete></div>\n' +
    '                  </div>\n' +
    '                  <div class="pull-right table-buttons">\n' +
    '                    <table-settings class="pull-right" page-size="pagination.itemsPerPage" sizes="pageSizes" columns="$columns" update-page-size="caseCtrl.changeItemPerPage(size)"></table-settings>\n' +
    '                    <span  ng-if="pagination.total" id="cases-results-size-top" class="pull-right">{{ \'{}-{} of {}\' | translate | stringTemplater:[currentFirstResultIndex, currentLastResultIndex, pagination.total]}}</span>\n' +
    '                  </div>\n' +
    '                </th>\n' +
    '              </tr>\n' +
    '              <tr data-headers>\n' +
    '                <th class="case-checkbox" data-ignore><div bo-selectall></div></th>\n' +
    '                <th class="text-right case-column" bo-sorter="id" bo-sorter-title-asc="{{\'sort by ID ascending\' | translate}}" bo-sorter-title-desc="{{\'sort by ID descending\' | translate}}">{{\'ID\' | translate}}</th>\n' +
    '\n' +
    '                <th class="case-column" bo-sorter="name" bo-sorter-title-asc="{{\'sort by Process name ascending\' | translate}}" bo-sorter-title-desc="{{\'sort by Process name descending\' | translate}}">{{\'Process name\' | translate}}</th>\n' +
    '                <th class="case-column" >{{\'Version\' | translate}}</th>\n' +
    '                <th bo-sorter="startDate" class="case-column" bo-sorter-title-asc="{{\'sort by Start date ascending\' | translate}}" bo-sorter-title-desc="{{\'sort by Start date descending\' | translate}}">{{\'Start date\' | translate}}</th>\n' +
    '                <th class="case-column">{{\'Started by\' | translate}}</th>\n' +
    '                <th class="text-right case-column">{{\'Failed Flow Nodes\' | translate}}</th>\n' +
    '                <th class="text-right case-column">{{\'Pending Flow Nodes\' | translate}}</th>\n' +
    '                <th bo-sorter="index1" class="case-column" remove-column="{{!caseCtrl.displayKeys()}}" ng-hide="!caseCtrl.displayKeys()"><span id="infoPopover" class="glyphicon glyphicon-info-sign" popover="{{\'To personalize the display of search keys (and columns in general), use the table settings button on the right. You can search on up to 5 search keys.\' | translate}}" popover-trigger="mouseenter"></span> {{\'Search Key 1\' | translate}}</th>\n' +
    '                <th bo-sorter="index2" visible="false" class="case-column" remove-column="{{!caseCtrl.displayKeys()}}" ng-hide="!caseCtrl.displayKeys()">{{\'Search Key 2\' | translate}}</th>\n' +
    '                <th bo-sorter="index3" visible="false" class="case-column" remove-column="{{!caseCtrl.displayKeys()}}" ng-hide="!caseCtrl.displayKeys()">{{\'Search Key 3\' | translate}}</th>\n' +
    '                <th bo-sorter="index4" visible="false" class="case-column" remove-column="{{!caseCtrl.displayKeys()}}" ng-hide="!caseCtrl.displayKeys()">{{\'Search Key 4\' | translate}}</th>\n' +
    '                <th bo-sorter="index5" visible="false" class="case-column" remove-column="{{!caseCtrl.displayKeys()}}" ng-hide="!caseCtrl.displayKeys()">{{\'Search Key 5\' | translate}}</th>\n' +
    '                <th data-ignore class="text-center">{{\'Actions\' | translate}}</th>\n' +
    '              </tr>\n' +
    '            </thead>\n' +
    '            <tbody>\n' +
    '\n' +
    '            <tr ng-repeat="case in cases" id="caseId-{{::case.id}}" class="case-row" ng-class="{\'info\' : case.selected}">\n' +
    '              <td class="case-checkbox">\n' +
    '                <input id="case-check-{{::case.id}}" type="checkbox" bo-selector="case" >\n' +
    '              </td>\n' +
    '\n' +
    '              <td class="text-right case-detail"><a id="case-detail-link-{{case.id}}" target="_parent" href="{{::caseCtrl.getLinkToCase(case)}}">{{case[\'ID\']}}</a></td>\n' +
    '              <td class="case-detail"><a id="case-process-link-{{case.id}}" target="_parent" href="{{::caseCtrl.getLinkToProcess(case)}}">{{case[\'Process name\']}}</a></td>\n' +
    '              <td class="case-detail">{{::case[\'Version\']}}</td>\n' +
    '              <td class="case-detail">{{::caseCtrl.parseAndFormat(case[\'Start date\'])}}</td>\n' +
    '              <td class="case-detail">{{::case[\'Started by\'] || (\'System\' | translate)}}</td>\n' +
    '              <td class="case-detail text-right" ng-switch="case.fullCase.state">\n' +
    '                <div ng-switch-when="error">\n' +
    '                  <span tooltip="{{\'One or more connectors on case start or case end failed\' | translate}}" tooltip-animation="false" tooltip-popup-delay="500" class="alert-error glyphicon glyphicon-exclamation-sign"></span>\n' +
    '                  {{::case[\'Failed Flow Nodes\']}}\n' +
    '                </div>\n' +
    '                <!--need a switch otherwise, the counter is not aligned with the glyphicon-->\n' +
    '                <div ng-switch-default>\n' +
    '                  {{::case[\'Failed Flow Nodes\']}}\n' +
    '                </div>\n' +
    '\n' +
    '              </td>\n' +
    '              <td class="case-detail text-right">{{::(case[\'Pending Flow Nodes\'] - case[\'Failed Flow Nodes\'])}}</td>\n' +
    '              <td class="case-detail" ng-hide="!caseCtrl.displayKeys()"><search-index case="case" index="1"></search-index></td>\n' +
    '              <td class="case-detail" ng-hide="!caseCtrl.displayKeys()"><search-index case="case" index="2"></search-index></td>\n' +
    '              <td class="case-detail" ng-hide="!caseCtrl.displayKeys()"><search-index case="case" index="3"></search-index></td>\n' +
    '              <td class="case-detail" ng-hide="!caseCtrl.displayKeys()"><search-index case="case" index="4"></search-index></td>\n' +
    '              <td class="case-detail" ng-hide="!caseCtrl.displayKeys()"><search-index case="case" index="5"></search-index></td>\n' +
    '              <td class="case-link text-center">\n' +
    '                <case-visu process-id=\'{{::case.processDefinitionId.id}}\' case-id=\'{{::case.ID}}\'></case-visu>\n' +
    '                <a id="case-overview-btn-{{::case.id}}" tooltip="{{\'View case overview\' | translate }}"  tooltip-popup-delay="500" tooltip-animation="false" target="_parent" ng-href="{{::caseCtrl.getLinkToCaseOverview(case)}}" class="open-link">\n' +
    '                  <span class="glyphicon glyphicon-eye-open"></span>\n' +
    '                </a>\n' +
    '                <a id="case-detail-btn-{{::case.id}}" tooltip="{{\'View case details\' | translate }}"  tooltip-popup-delay="500" tooltip-animation="false" target="_parent" ng-href="{{::caseCtrl.getLinkToCase(case)}}" class="open-link">\n' +
    '                  <span class="glyphicon glyphicon-option-horizontal"></span>\n' +
    '                </a>\n' +
    '              </td>\n' +
    '            </tr>\n' +
    '            </tbody>\n' +
    '          </table>\n' +
    '\n' +
    '          <table ng-if="archivedTabName" bonitable bo-storable="archived-admin-cases-list" on-storage-loaded="caseCtrl.loadContent()" bo-repeatable on-sort="caseCtrl.updateSortField(sortOptions)" sort-options="sortOptions" resizable-column="$columns" resize-selector="tr th.case-column" class="table table-striped table-hover table-responsive">\n' +
    '            <thead>\n' +
    '              <tr>\n' +
    '                <th colspan="{{$columns.length+2}}">\n' +
    '                  <div class="pull-left case-action table-buttons">\n' +
    '                    <div class="case-action table-buttons"> <archived-case-delete>{{\'Delete\' | translate}}</archived-case-delete></div>\n' +
    '                  </div>\n' +
    '                  <div class="pull-right table-buttons">\n' +
    '                    <table-settings class="pull-right" page-size="pagination.itemsPerPage" sizes="pageSizes" columns="$columns"  update-page-size="caseCtrl.changeItemPerPage(size)"></table-settings>\n' +
    '                       <span ng-if="pagination.total" id="cases-results-size-top" class="pull-right">{{ \'{}-{} of {}\' | translate | stringTemplater:[currentFirstResultIndex, currentLastResultIndex, pagination.total]}}</span>\n' +
    '                  </div>\n' +
    '                </th>\n' +
    '              </tr>\n' +
    '              <tr data-headers>\n' +
    '                <th class="case-checkbox" data-ignore><div bo-selectall></div></th>\n' +
    '                <th class="text-right case-column" bo-sorter="sourceObjectId" bo-sorter-title-asc="{{\'sort by ID ascending\' | translate}}" bo-sorter-title-desc="{{\'sort by ID descending\' | translate}}">{{\'ID\' | translate}}</th>\n' +
    '                <th class="case-column" bo-sorter="name" bo-sorter-title-asc="{{\'sort by Process name ascending\' | translate}}" bo-sorter-title-desc="{{\'sort by Process name descending\' | translate}}">{{\'Process name\' | translate}}</th>\n' +
    '                <th class="case-column" >{{\'Version\' | translate}}</th>\n' +
    '                <th bo-sorter="startDate" class="case-column" bo-sorter-title-asc="{{\'sort by Start date ascending\' | translate}}" bo-sorter-title-desc="{{\'sort by Start date descending\' | translate}}">{{\'Start date\' | translate}}</th>\n' +
    '                <th class="case-column" >{{\'Started by\' | translate}}</th>\n' +
    '                <th bo-sorter="endDate" class="case-column" bo-sorter-title-asc="{{\'sort by End date ascending\' | translate}}" bo-sorter-title-desc="{{\'sort by End date descending\' | translate}}">{{\'End date\' | translate}}</th>\n' +
    '                <th class="case-column" >{{\'State\' | translate}}</th>\n' +
    '                <th bo-sorter="index1" class="case-column" remove-column="{{!caseCtrl.displayKeys()}}" ng-hide="!caseCtrl.displayKeys()"><span id="infoPopover" class="glyphicon glyphicon-info-sign" popover="{{\'To personalize the display of search keys (and columns in general), use the table settings button on the right. You can search on up to 5 search keys.\' | translate}}" popover-trigger="mouseenter"></span> {{\'Search Key 1\' | translate}}</th>\n' +
    '                <th bo-sorter="index2" visible="false" class="case-column" remove-column="{{!caseCtrl.displayKeys()}}" ng-hide="!caseCtrl.displayKeys()">{{\'Search Key 2\' | translate}}</th>\n' +
    '                <th bo-sorter="index3" visible="false" class="case-column" remove-column="{{!caseCtrl.displayKeys()}}" ng-hide="!caseCtrl.displayKeys()">{{\'Search Key 3\' | translate}}</th>\n' +
    '                <th bo-sorter="index4" visible="false" class="case-column" remove-column="{{!caseCtrl.displayKeys()}}" ng-hide="!caseCtrl.displayKeys()">{{\'Search Key 4\' | translate}}</th>\n' +
    '                <th bo-sorter="index5" visible="false" class="case-column" remove-column="{{!caseCtrl.displayKeys()}}" ng-hide="!caseCtrl.displayKeys()">{{\'Search Key 5\' | translate}}</th>\n' +
    '\n' +
    '                <th data-ignore class="text-center">{{\'Actions\' | translate}}</th>\n' +
    '              </tr>\n' +
    '            </thead>\n' +
    '            <tbody>\n' +
    '\n' +
    '            <tr ng-repeat="case in cases" id="caseId-{{::case.id}}" class="case-row" ng-class="{\'info\' : case.selected}">\n' +
    '              <td class="case-checkbox">\n' +
    '                <input id="case-check-{{::case.id}}" type="checkbox" bo-selector="case" >\n' +
    '              </td>\n' +
    '\n' +
    '              <td class="case-detail text-right"><a id="case-detail-link-{{case.id}}" target="_parent" href="{{::caseCtrl.getLinkToCase(case)}}">{{case[\'ID\']}}</a></td>\n' +
    '              <td class="case-detail"><a id="case-process-link-{{case.id}}" target="_parent" href="{{::caseCtrl.getLinkToProcess(case)}}">{{case[\'Process name\']}}</a></td>\n' +
    '              <td class="case-detail">{{::case[\'Version\']}}</td>\n' +
    '              <td class="case-detail">{{::caseCtrl.parseAndFormat(case[\'Start date\'])}}</td>\n' +
    '              <td class="case-detail">{{::case[\'Started by\'] || (\'System\' | translate)}}</td>\n' +
    '              <td class="case-detail">{{::caseCtrl.parseAndFormat(case[\'End date\'])}}</td>\n' +
    '              <td class="case-detail">{{::case[\'State\']}}</td>\n' +
    '              <td class="case-detail" ng-hide="!caseCtrl.displayKeys()"><search-index case="case" index="1"></search-index></td>\n' +
    '              <td class="case-detail" ng-hide="!caseCtrl.displayKeys()"><search-index case="case" index="2"></search-index></td>\n' +
    '              <td class="case-detail" ng-hide="!caseCtrl.displayKeys()"><search-index case="case" index="3"></search-index></td>\n' +
    '              <td class="case-detail" ng-hide="!caseCtrl.displayKeys()"><search-index case="case" index="4"></search-index></td>\n' +
    '              <td class="case-detail" ng-hide="!caseCtrl.displayKeys()"><search-index case="case" index="5"></search-index></td>\n' +
    '              <td class="case-link text-center">\n' +
    '                <case-visu process-id=\'{{::case.processDefinitionId.id}}\' case-id=\'{{::case.ID}}\'></case-visu>\n' +
    '                <a id="case-overview-btn-{{::case.id}}" tooltip="{{\'View case overview\' | translate }}"  tooltip-popup-delay="500" tooltip-animation="false" target="_parent" ng-href="{{::caseCtrl.getLinkToArchivedCaseOverview(case)}}" class="open-link">\n' +
    '                  <span class="glyphicon glyphicon-eye-open"></span>\n' +
    '                </a>\n' +
    '                <a id="case-detail-btn-{{::case.id}}" tooltip="{{\'View case details\' | translate }}"  tooltip-popup-delay="500" tooltip-animation="false" target="_parent" ng-href="{{::caseCtrl.getLinkToCase(case)}}" class="open-link">\n' +
    '                  <span class="glyphicon glyphicon-option-horizontal"></span>\n' +
    '                </a>\n' +
    '              </td>\n' +
    '            </tr>\n' +
    '            </tbody>\n' +
    '          </table>\n' +
    '        </div>\n' +
    '        <div class="col-md-12">\n' +
    '          <div class="pull-right" ng-if="pagination.total">\n' +
    '            <span id="cases-results-size-bottom" class="pull-left">{{ \'{}-{} of {}\' | translate | stringTemplater:[currentFirstResultIndex, currentLastResultIndex, pagination.total]}}</span>\n' +
    '            <pagination id="cases-results-pages" ng-if="pagination.total > pagination.itemsPerPage" ng-click="caseCtrl.searchForCases()" boundary-links="true" total-items="pagination.total" ng-model="pagination.currentPage" items-per-page="pagination.itemsPerPage " previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;" max-size="5"></pagination>\n' +
    '           </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '      <div ng-show="loading">\n' +
    '        <p class="text-muted"><span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>&nbsp;{{ \'Loading...\' | translate}}</p>\n' +
    '      </div>\n' +
    '      <div ng-show="!loading &amp;&amp; cases &amp;&amp; cases.length===0">\n' +
    '        <p class="text-muted animated fadeIn">{{ \'No cases to display\' | translate }}</p>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/admin/cases/list/cases.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/cases/list/cases.html',
    '<div id="case-list" class="container">\n' +
    '  <h1 id="case-title">{{\'Cases\' | translate }}</h1>\n' +
    '\n' +
    '  <div>\n' +
    '    <ul class="nav nav-tabs" role="tablist">\n' +
    '      <li role="presentation" ng-repeat="caseState in casesStates" ng-class="{\'active\' : state.is(caseState.state)}"><a class="title" href="" bonita-href="{\'token\' : currentToken, \'_tab\' : caseState.tabName}" id="{{:: caseState.htmlAttributeId}}">{{:: caseState.title}}</a></li>\n' +
    '    </ul>\n' +
    '    <div ui-view=\'case-list\' id="case-list-tab-content"></div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/admin/mapping/actors.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/mapping/actors.html',
    '<isteven-multi-select\n' +
    '  input-model="actorsCtrl.members"\n' +
    '  output-model="actorsCtrl.selectedMembers.list"\n' +
    '  button-label="buttonLabel"\n' +
    '  item-label="listLabel"\n' +
    '  helper-elements="all filter reset none"\n' +
    '  tick-property="selected"\n' +
    '  max-labels="5"\n' +
    '  max-height="200px"\n' +
    '  translation="localLang"\n' +
    '  on-search-change="actorsCtrl.search(data)"\n' +
    '  on-clear="actorsCtrl.search({})"\n' +
    '  on-reset="actorsCtrl.search({})"\n' +
    '  selection-mode="{{actorsCtrl.selectionMode}}"></isteven-multi-select>\n' +
    '');
}]);

angular.module('portalTemplates/admin/processes/details/actors-mapping.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/processes/details/actors-mapping.html',
    '<div id="process-details-actors">\n' +
    '  <h2>{{\'Actors\' | translate}}</h2>\n' +
    '  <p>{{\'Select the entities (users, groups, roles, memberships) to map to the actors. These entities will do the human tasks in the process.\' | translate}}</p>\n' +
    '  <table class="table  actorMappingList">\n' +
    '    <thead>\n' +
    '      <tr>\n' +
    '        <th>{{\'Actor name\' | translate}}</th>\n' +
    '        <th>{{\'Users\' | translate}}</th>\n' +
    '        <th>{{\'Roles\' | translate}}</th>\n' +
    '        <th>{{\'Groups\' | translate}}</th>\n' +
    '        <th>{{\'Memberships\' | translate}}</th>\n' +
    '      </tr>\n' +
    '    </thead>\n' +
    '    <tbody>\n' +
    '      <tr ng-repeat-start="actor in actorsMappingCtrl.actors">\n' +
    '        <td class="actorName">{{actor.name}}</td>\n' +
    '        <td class="members">\n' +
    '          <span ng-repeat="user in actorsMappingCtrl.actorsMembers[actor.id].users.data" class="label label-default member">\n' +
    '            {{user.user_id.firstname}} {{user.user_id.lastname}}\n' +
    '          </span> \n' +
    '          <span ng-if="actorsMappingCtrl.actorsMembers[actor.id].users.resource.pagination.total > actorsMappingCtrl.membersPerCell" class="label label-default member">{{\'{} more\' | translate | stringTemplater: actorsMappingCtrl.actorsMembers[actor.id].users.resource.pagination.total - actorsMappingCtrl.membersPerCell}}</span>\n' +
    '        </td>\n' +
    '        <td class="members">\n' +
    '          <span ng-repeat="role in actorsMappingCtrl.actorsMembers[actor.id].roles.data" class="label label-default member">\n' +
    '            {{role.role_id.displayName}}\n' +
    '          </span>\n' +
    '          <span ng-if="actorsMappingCtrl.actorsMembers[actor.id].roles.resource.pagination.total > actorsMappingCtrl.membersPerCell" class="label label-default member">{{\'{} more\'|translate}} | stringTemplater: actorsMappingCtrl.actorsMembers[actor.id].roles.resource.pagination.total - actorsMappingCtrl.membersPerCell</span>\n' +
    '        </td>\n' +
    '        <td class="members">\n' +
    '          <span ng-repeat="group in actorsMappingCtrl.actorsMembers[actor.id].groups.data" class="label label-default member">\n' +
    '            {{group.group_id.displayName}}\n' +
    '          </span>\n' +
    '          <span ng-if="actorsMappingCtrl.actorsMembers[actor.id].groups.resource.pagination.total > actorsMappingCtrl.membersPerCell" class="label label-default member">{{\'{} more\' | translate | stringTemplater: actorsMappingCtrl.actorsMembers[actor.id].groups.resource.pagination.total - actorsMappingCtrl.membersPerCell}}</span>\n' +
    '        </td>\n' +
    '        <td class="members">\n' +
    '          <span ng-repeat="membership in actorsMappingCtrl.actorsMembers[actor.id].memberships.data" class="label label-default member">\n' +
    '            {{\'{} of {}\' | translate | stringTemplater: [membership.role_id.displayName, membership.group_id.displayName]}}\n' +
    '          </span>\n' +
    '          <span ng-if="actorsMappingCtrl.actorsMembers[actor.id].memberships.resource.pagination.total > actorsMappingCtrl.membersPerCell" class="label label-default member">{{\'{} more\' | translate | stringTemplater: actorsMappingCtrl.actorsMembers[actor.id].memberships.resource.pagination.total - actorsMappingCtrl.membersPerCell}}</span>\n' +
    '        </td>\n' +
    '      </tr>\n' +
    '      <tr ng-repeat-end class="mappingEdition-actions">\n' +
    '        <td></td>\n' +
    '        <td>\n' +
    '          <div class="cellFooter pull-right">\n' +
    '            <button ng-click="actorsMappingCtrl.editMapping(actor, \'users\')" class="btn btn-primary">\n' +
    '              <span class="glyphicon" ng-class="{\'glyphicon-pencil\': actorsMappingCtrl.actorsMembers[actor.id].users.data.length, \'glyphicon-plus\': !actorsMappingCtrl.actorsMembers[actor.id].users.data.length}"></span>\n' +
    '            </button>\n' +
    '          </div>\n' +
    '        </td>\n' +
    '        <td>\n' +
    '           <div class="cellFooter pull-right">\n' +
    '            <button ng-click="actorsMappingCtrl.editMapping(actor, \'roles\')" class="btn btn-primary">\n' +
    '              <span class="glyphicon" ng-class="{\'glyphicon-pencil\': actorsMappingCtrl.actorsMembers[actor.id].roles.data.length, \'glyphicon-plus\': !actorsMappingCtrl.actorsMembers[actor.id].roles.data.length}"></span>\n' +
    '            </button>\n' +
    '          </div>\n' +
    '        </td>\n' +
    '        <td>\n' +
    '           <div class="cellFooter pull-right">\n' +
    '            <button ng-click="actorsMappingCtrl.editMapping(actor, \'groups\')" class="btn btn-primary">\n' +
    '              <span class="glyphicon" ng-class="{\'glyphicon-pencil\': actorsMappingCtrl.actorsMembers[actor.id].groups.data.length, \'glyphicon-plus\': !actorsMappingCtrl.actorsMembers[actor.id].groups.data.length}"></span>\n' +
    '            </button>\n' +
    '          </div>\n' +
    '        </td>\n' +
    '        <td>\n' +
    '          <div class="cellFooter pull-right">\n' +
    '            <button ng-click="actorsMappingCtrl.editMapping(actor, \'memberships\')" class="btn btn-primary">\n' +
    '              <span class="glyphicon" ng-class="{\'glyphicon-pencil\': actorsMappingCtrl.actorsMembers[actor.id].memberships.data.length, \'glyphicon-plus\': !actorsMappingCtrl.actorsMembers[actor.id].memberships.data.length}"></span>\n' +
    '            </button>\n' +
    '          </div>\n' +
    '        </td>\n' +
    '      </tr>\n' +
    '    </tbody>\n' +
    '  </table>\n' +
    '  <pagination ng-if="actorsMappingCtrl.actors.resource.pagination.total>actorsMappingCtrl.actors.resource.pagination.numberPerPage" ng-click="actorsMappingCtrl.getProcessActors()" boundary-links="true" total-items="actorsMappingCtrl.actors.resource.pagination.total" ng-model="actorsMappingCtrl.actors.resource.pagination.currentPage" items-per-page="actorsMappingCtrl.actors.resource.pagination.numberPerPage " previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;" max-size="5"></pagination>\n' +
    '  <p>{{\'For each actor, check that each entity (user, group, role, membership) has the relevant user profile in the Portal.\' | translate}} {{\'To do so, go to\' | translate}} <a href="" bonita-href="profilelisting">{{\'Profiles\' | translate}}</a>.</p>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/admin/processes/details/delete-process-modal.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/processes/details/delete-process-modal.html',
    '<div id="delete-process-modal">\n' +
    '    <div class="modal-header header">\n' +
    '        <h3 class="modal-title">{{\'Delete process\'| translate }}</h3>\n' +
    '    </div>\n' +
    '    <div class="modal-body body">\n' +
    '      <p class="text-muted">{{ \'Delete the process\' | translate }} {{deleteProcessModalInstanceCtrl.process.name}}</p>\n' +
    '    </div>\n' +
    '    <div class="modal-footer">\n' +
    '        <button  class="start-for btn btn-primary" ng-click="deleteProcessModalInstanceCtrl.delete()">{{ \'Delete\' | translate }}</button>\n' +
    '        <button class="btn btn-default close_popup" ng-click="deleteProcessModalInstanceCtrl.cancel()">{{ \'Cancel\' | translate }}</button>\n' +
    '    </div>\n' +
    '</div>');
}]);

angular.module('portalTemplates/admin/processes/details/edit-actor-members.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/processes/details/edit-actor-members.html',
    '<div id="editActorsMembersModal" ng-init="editActorMembersCtrl.initView()" class="process-details">\n' +
    '\n' +
    '  <div class="modal-header">\n' +
    '    <h1 class="modal-title">{{editActorMembersCtrl.title | translate | stringTemplater:[editActorMembersCtrl.actor.displayName]}}</h1>\n' +
    '  </div>\n' +
    '  <div class="modal-body">\n' +
    '    <h2>{{\'{} mapped\' | translate | stringTemplater:[editActorMembersCtrl.currentMemberLabel]}}</h2>\n' +
    '    <p class="members">\n' +
    '      <span ng-repeat="member in editActorMembersCtrl.members" class="tag label label-default member">\n' +
    '          {{member.label}} <i ng-click="editActorMembersCtrl.removeMember(member)" class="glyphicon glyphicon-remove"></i>\n' +
    '      </span>\n' +
    '      <span ng-click="editActorMembersCtrl.removeAll()" class="tag label label-danger" ng-if="!!editActorMembersCtrl.members.length"> {{\'Remove all\' | translate}}</span>\n' +
    '    </p>\n' +
    '    <p class="text-muted" ng-if="!editActorMembersCtrl.members.length">\n' +
    '      {{\'No mapping\' | translate}}\n' +
    '    </p>\n' +
    '    <div ng-if="!editActorMembersCtrl.isMembershipEdit()">\n' +
    '      <h3>{{\'Add\' | translate}}</h3>\n' +
    '      <p>\n' +
    '      <actors-select-box local-lang="editActorMembersCtrl.localLang"\n' +
    '        selected-members="editActorMembersCtrl.newMembers"\n' +
    '        already-mapped-actors-ids="editActorMembersCtrl.mappedIds"\n' +
    '        type="{{editActorMembersCtrl.memberType}}"></actors-select-box>\n' +
    '      </p>\n' +
    '    </div>\n' +
    '    <div ng-if="editActorMembersCtrl.isMembershipEdit()">\n' +
    '      <h3>{{\'Create a new membership\' | translate}}</h3>\n' +
    '      <p>\n' +
    '       <actors-select-box local-lang="editActorMembersCtrl.localLangRole"\n' +
    '        selected-members="editActorMembersCtrl.newMembers.membership.group"\n' +
    '        already-mapped-actors-ids="editActorMembersCtrl.mappedIds"\n' +
    '        type="ROLE" selection-mode="single"></actors-select-box>\n' +
    '      <span style="clear:both">{{\' of \' | translate }}</span>\n' +
    '       <actors-select-box local-lang="editActorMembersCtrl.localLangGroup"\n' +
    '        selected-members="editActorMembersCtrl.newMembers.membership.role"\n' +
    '        already-mapped-actors-ids="editActorMembersCtrl.mappedIds"\n' +
    '        type="GROUP" selection-mode="single"></actors-select-box>\n' +
    '      </p>\n' +
    '    </div>\n' +
    '    <div ng-if="!!editActorMembersCtrl.membersToDelete.length">\n' +
    '      <h3>{{\'{} mappings to delete\' | translate | stringTemplater:[editActorMembersCtrl.currentMemberLabel]}}</h3>\n' +
    '      <p class="members">\n' +
    '        <span ng-repeat="member in editActorMembersCtrl.membersToDelete" class="member label label-default">\n' +
    '          {{member.label}} <i ng-click="editActorMembersCtrl.reenableMember(member)" class="glyphicon glyphicon-remove"></i>\n' +
    '        </span>\n' +
    '        <span ng-click="editActorMembersCtrl.reenableAll()" class="label label-success" ng-if="editActorMembersCtrl.membersToDelete.length>0"> {{\'Enable all\' | translate}}</span>\n' +
    '      </p>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '  <div class="modal-footer">\n' +
    '    <a ng-if="editActorMembersCtrl.hasModificationToApply()" class="btn btn-primary" ng-click="editActorMembersCtrl.apply()">{{\'Apply\' | translate }}</a>\n' +
    '    <a ng-click="editActorMembersCtrl.cancel()" class="btn btn-default">{{\'Cancel\'|translate}}</a>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/admin/processes/details/information.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/processes/details/information.html',
    '<div id="process-details-information">\n' +
    '  <h2>{{\'General\' | translate}}</h2>\n' +
    '  <div class="panel panel-default">\n' +
    '    <div class="panel-body">\n' +
    '      <div class="col-md-12 row">\n' +
    '        <div class="metatags-label form-group">{{ \'Configuration state\' | translate }}\n' +
    '          <b>{{::processInformationCtrl.process.configurationState}}</b>\n' +
    '        </div>\n' +
    '        <div class="metatags-label  form-group">\n' +
    '          {{ \'Activation state\' | translate }}&nbsp;\n' +
    '              <toggle-button on="Enabled" off="Disabled" process-id="{{::processInformationCtrl.process.id}}" initial-state="{{::processInformationCtrl.process.activationState === \'ENABLED\'}}" enable-toggle="processInformationCtrl.isProcessResolved"></toggle-button>\n' +
    '        </div>\n' +
    '        <div class="metatags-label form-group">\n' +
    '            {{ \'Updated on\' | translate }}\n' +
    '            <b >{{::processInformationCtrl.parseAndFormat(processInformationCtrl.process.last_update_date)}}</b>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '      <div class="col-md-12 row">\n' +
    '\n' +
    '        <p ng-if="processInformationCtrl.process.description" >{{processInformationCtrl.process.description}}</p>\n' +
    '        <p class="text-muted" ng-if="!processInformationCtrl.process.description" >{{\'No description.\' | translate}}</p>\n' +
    '      </div>\n' +
    '      <div class="col-md-12 row">\n' +
    '        <div class="col-md-12 row categories">\n' +
    '          <div class="col-md-2 row metatags-label">\n' +
    '          {{\'Categories\' | translate}} <button class="btn btn-primary" ng-click="processInformationCtrl.openProcessCategoryManagementModal()"><span class="glyphicon glyphicon-pencil"></span></button>\n' +
    '          </div>\n' +
    '          <div class="col-md-10 bootstrap-tags">\n' +
    '            <bonitags tags-suggestion="processInformationCtrl.categories" tags-selection="processInformationCtrl.selectedCategories" read-only></bonitags>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '<div ng-if="processInformationCtrl.process.id">\n' +
    '  <monitoring-status process=\'processInformationCtrl.process\'></monitoring-status>\n' +
    '\n' +
    '  <process-manager-mapping process=\'processInformationCtrl.process\'></process-manager-mapping>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/admin/processes/details/manage-category-mapping-modal.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/processes/details/manage-category-mapping-modal.html',
    '<div id="manage-categories-modal" class="process-details">\n' +
    '    <div class="modal-header header">\n' +
    '        <h3 class="modal-title">{{\'Manage Categories\'| translate }}</h3>\n' +
    '    </div>\n' +
    '    <div class="modal-body body">\n' +
    '        <bonitags tags-suggestion="manageCategoryMappingInstanceCtrl.tags" tags-selection="manageCategoryMappingInstanceCtrl.selectedTags" tag-class="label-default editable"></bonitags>\n' +
    '    <hr>\n' +
    '        {{\'Use Arrow up and Arrow down keys to browse among existing categories.\' | translate}} <br>\n' +
    '        {{\'Enter a new category name and press "Enter" key to create a new category and assign it to the current process.\' | translate}}\n' +
    '    </div>\n' +
    '    <div class="modal-footer">\n' +
    '        <button class="btn btn-primary" ng-click="manageCategoryMappingInstanceCtrl.updateCategories()">{{ \'Save\' | translate }}</button>\n' +
    '        <button class="btn btn-default close_popup" ng-click="manageCategoryMappingInstanceCtrl.cancel()">{{ \'Cancel\' | translate }}</button>\n' +
    '    </div>\n' +
    '\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/admin/processes/details/menu.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/processes/details/menu.html',
    '<div id="process-details" class="process-details">\n' +
    '  <div class="col-md-12 actions">\n' +
    '    <div class="col-md-2">\n' +
    '        <a id="processDetails-back" class="btn btn-default" ng-click="processMenuCtrl.goBack()">{{\'Back\' | translate}}</a>\n' +
    '    </div>\n' +
    '    <div class="col-md-10 text-right">\n' +
    '      <start-for process="processMenuCtrl.process"></start-for>&nbsp;\n' +
    '      <button id="processDetails-deleteProcess" type="button" class="btn btn-default" ng-disabled="processMenuCtrl.process.activationState === \'ENABLED\'" ng-click="processMenuCtrl.deleteProcess()">{{\'Delete\' | translate}}</button>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '  <div class="col-md-12">\n' +
    '    <h1>{{processMenuCtrl.process.name}} ({{processMenuCtrl.process.version}})</h1>\n' +
    '  </div>\n' +
    '  <div class="col-md-12" style="padding-top: 10px;">\n' +
    '    <div ng-if="processMenuCtrl.processResolutionProblems.length" style=" padding-bottom: 0px;" class="panel panel-danger slide">\n' +
    '      <div class="panel-heading"><span class="glyphicon glyphicon-exclamation-sign"></span> {{ \'The Process cannot be enabled\' | translate }}</div>\n' +
    '      <div class="panel-body">\n' +
    '        <div class="col-md-12">\n' +
    '          <ul>\n' +
    '            <li ng-repeat="problem in processMenuCtrl.processResolutionProblems">\n' +
    '              {{problem.message | translate | stringTemplater: problem.args}}\n' +
    '            </li>\n' +
    '          </ul>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '  <div class="col-sm-3 col-md-3 col-lg-2">\n' +
    '    <div class="list-group">\n' +
    '      <a class="list-group-item" ng-repeat="item in processMenuCtrl.menuContent" ng-class="{active: processMenuCtrl.includesCurrentState(item.state) }" ui-sref="{{item.defaultDestinationState || item.state}}" ui-sref-opts="{location:false}">{{item.name | translate}} <span ng-if="processMenuCtrl.hasResolutionProblem(item.resolutionLabel)" ng-class="{\'text-danger\': !processMenuCtrl.includesCurrentState(item.state) }" class="glyphicon glyphicon-exclamation-sign"></span> </a>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '  <div class="col-sm-9 col-md-9 col-lg-10">\n' +
    '    <div growl></div>\n' +
    '\n' +
    '    <div class="col-md-12">\n' +
    '      <ui-view></ui-view>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/admin/processes/details/params.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/processes/details/params.html',
    '<div id="process-details-params">\n' +
    '  <h2>{{\'Parameters\' | translate}}</h2>\n' +
    '  <div ng-if="!processParamsCtrl.parameters.length">\n' +
    '    {{ \'The current process has no parameters defined.\' | translate}}\n' +
    '  </div>\n' +
    '  <div ng-if="!!processParamsCtrl.parameters.length">\n' +
    '    <table class="table table-striped">\n' +
    '        <thead>\n' +
    '            <tr>\n' +
    '                <th>{{\'Name\' | translate}}</th> \n' +
    '                <th>{{\'Description\' | translate}}</th>\n' +
    '                <th>{{\'Type\' | translate}}</th>\n' +
    '                <th>{{\'Value\' | translate}}</th>\n' +
    '            </tr>\n' +
    '        </thead>\n' +
    '        <tbody>\n' +
    '            <tr ng-repeat="parameter in processParamsCtrl.parameters">\n' +
    '              <td>{{parameter.name}}</td>\n' +
    '              <td>{{parameter.description}}</td>\n' +
    '              <td>{{parameter.type}}</td>\n' +
    '              <td ng-if="!processParamsCtrl.showActions">{{parameter.value}}</td>\n' +
    '              <td ng-if="processParamsCtrl.showActions" class="xeditable">\n' +
    '                <div ng-switch="parameter.type">\n' +
    '                  <div ng-switch-when="java.lang.Boolean" class="form-group">\n' +
    '                    <a href="" editable-select="parameter.value" onbeforesave="processParamsCtrl.updateParameter(parameter, $data)"  e-ng-options="s.value as s.value for s in processParamsCtrl.booleanValues">{{ parameter.value || \'No Value\' | translate}}</a>\n' +
    '                  </div>\n' +
    '                  <div ng-switch-default class="form-group">\n' +
    '                    <a href="" editable-text="parameter.value" e-style="width: 400px;" onbeforesave="processParamsCtrl.updateParameter(parameter, $data)" >{{ parameter.value || \'No Value\' | translate}}</a>\n' +
    '                  </div>\n' +
    '                </div>\n' +
    '              </td>\n' +
    '            </tr>\n' +
    '        </tbody>\n' +
    '    </table> \n' +
    '  </div>\n' +
    '</div>');
}]);

angular.module('portalTemplates/admin/processes/details/process-connectors.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/admin/processes/details/process-connectors.html',
    '<div id="process-details-connectors">\n' +
    '  <h2>{{\'Connectors\' | translate}}</h2>\n' +
    '  <div ng-if="!processConnectorsCtrl.processConnectors.length">\n' +
    '    {{ \'The current process has no connectors defined.\' | translate}}\n' +
    '  </div>\n' +
    '  <div ng-if="!!processConnectorsCtrl.processConnectors.length">\n' +
    '    <table class="table table-hover processConnectorsList">\n' +
    '      <thead>\n' +
    '        <tr data-headers>\n' +
    '          <th>{{\'Type\' | translate}}</th>\n' +
    '          <th>{{\'Implementation version\' | translate}}</th>\n' +
    '          <th>{{\'Class name\' | translate}}</th>\n' +
    '          <th ng-if="processConnectorsCtrl.showActions">{{\'Actions\' | translate}}</th>\n' +
    '        </tr>\n' +
    '      </thead>\n' +
    '      <tbody>\n' +
    '        <tr ng-repeat="processConnector in processConnectorsCtrl.processConnectors">\n' +
    '          <td>{{processConnector.definition_id}}</td>\n' +
    '          <td>{{processConnector.impl_version}}</td>\n' +
    '          <td>{{processConnector.classname}}</td>\n' +
    '          <td ng-if="processConnectorsCtrl.showActions"><edit-process-connector-implementation-link process-connector="processConnector" process="processConnectorsCtrl.process"></edit-process-connector-implementation-link></td>\n' +
    '        </tr>\n' +
    '      </tbody>\n' +
    '    </table>\n' +
    '  </div>\n' +
    '</div>');
}]);

angular.module('portalTemplates/user/cases/list/archived-cases-list-filters.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/user/cases/list/archived-cases-list-filters.html',
    '<div id="case-filters" class="panel panel-default">\n' +
    '\n' +
    '  <div class="panel-heading title">{{ \'Filters\' | translate }}</div>\n' +
    '  <div class="panel-body">\n' +
    '    <div class="col-md-3 button-filter"> {{ \'Process name\' | translate }}\n' +
    '      <div class="btn-group" dropdown id="case-app-name-filter">\n' +
    '        <button type="button" dropdown-toggle class="btn btn-primary dropdown-toggle ">{{selectedFilters.selectedApp | translate}}<span class="caret"></span></button>\n' +
    '        <ul class="dropdown-menu" role="menu">\n' +
    '          <li ng-click="filterUserCtrl.selectApp(defaultUserFilters.appName)"><a>{{defaultUserFilters.appName | translate}}</a></li>\n' +
    '          <li ng-if="appNames &amp;&amp; appNames.length>0" class="divider"></li>\n' +
    '          <li ng-repeat="appName in appNames" ng-click="filterUserCtrl.selectApp(appName)"><a>{{appName}}</a></li>\n' +
    '        </ul>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="col-md-3 button-filter">{{\'Started by\' | translate}}\n' +
    '      <div class="btn-group" dropdown id="case-app-startedby-filter">\n' +
    '          <button type="button" dropdown-toggle class="btn btn-primary dropdown-toggle">{{caseStatesUserValues[selectedFilters.selectedStartedBy] | translate}} <span class="caret"></span></button>\n' +
    '          <ul class="dropdown-menu" role="menu">\n' +
    '              <li ng-click="filterUserCtrl.selectCaseStartedBy(defaultUserFilters.startedBy)"><a>{{defaultUserFilters.startedBy | translate}}</a></li>\n' +
    '              <li class="divider"></li>\n' +
    '              <li ng-click="filterUserCtrl.selectCaseStartedBy(\'Me\')"><a>{{\'Me\' | translate}}</a></li>\n' +
    '          </ul>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="col-md-3 button-filter">\n' +
    '    </div>\n' +
    '    <div class="col-md-3 button-filter">\n' +
    '      <form role="form" name="searchForm" novalidate ng-submit="filterUserCtrl.submitSearch()">\n' +
    '          <div class="input-group">\n' +
    '            <input type="text" class="form-control" ng-model="selectedFilters.currentSearch" name="searchField" id="case-list-search" placeholder="{{ \'Search...\' | translate }}">\n' +
    '            <span ng-click="filterUserCtrl.submitSearch()" class="input-group-addon pointer"><span class="glyphicon glyphicon-search"></span></span>\n' +
    '          </div>\n' +
    '      </form>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/user/cases/list/cases-list-filters.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/user/cases/list/cases-list-filters.html',
    '<div id="case-filters" class="panel panel-default">\n' +
    '  <div class="panel-heading title">{{\'Filters\' | translate}}</div>\n' +
    '  <div class="panel-body">\n' +
    '    <div class="col-md-3 button-filter">{{\'Process name\' | translate}}\n' +
    '      <div class="btn-group" dropdown id="case-app-name-filter">\n' +
    '        <button type="button" dropdown-toggle class="btn btn-primary dropdown-toggle">{{selectedFilters.selectedApp | translate}}<span class="caret"></span></button>\n' +
    '        <ul class="dropdown-menu" role="menu">\n' +
    '          <li ng-click="filterUserCtrl.selectApp(defaultUserFilters.appName)"><a>{{defaultUserFilters.appName | translate}}</a></li>\n' +
    '          <li ng-if="appNames &amp;&amp; appNames.length>0" class="divider"></li>\n' +
    '          <li ng-repeat="appName in appNames" ng-click="filterUserCtrl.selectApp(appName)"><a>{{appName}}</a></li>\n' +
    '        </ul>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="col-md-3 button-filter">{{\'Started by\' | translate}}\n' +
    '      <div class="btn-group" dropdown id="case-app-startedby-filter">\n' +
    '        <button type="button" dropdown-toggle class="btn btn-primary dropdown-toggle">{{caseStatesUserValues[selectedFilters.selectedStartedBy] | translate}} <span class="caret"></span></button>\n' +
    '        <ul class="dropdown-menu" role="menu">\n' +
    '          <li ng-click="filterUserCtrl.selectCaseStartedBy(defaultUserFilters.startedBy)"><a>{{defaultUserFilters.startedBy | translate}}</a></li>\n' +
    '          <li class="divider"></li>\n' +
    '          <li ng-click="filterUserCtrl.selectCaseStartedBy(\'Me\')"><a>{{\'Me\' | translate}}</a></li>\n' +
    '        </ul>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="col-md-3" style="float:right">\n' +
    '      <form role="form" name="searchForm" novalidate ng-submit="filterUserCtrl.submitSearch()">\n' +
    '        <div class="input-group">\n' +
    '          <input type="text" class="form-control" ng-model="selectedFilters.currentSearch" name="searchField" id="case-list-search" placeholder="{{ \'Search...\' | translate }}">\n' +
    '          <span ng-click="filterUserCtrl.submitSearch()" class="input-group-addon pointer"><span class="glyphicon glyphicon-search"></span></span>\n' +
    '        </div>\n' +
    '      </form>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/user/cases/list/cases-list.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/user/cases/list/cases-list.html',
    '<div>\n' +
    '\n' +
    '  <div ng-switch on="archivedTabName">\n' +
    '    <archived-case-user-filters ng-switch-when="true"> </archived-case-user-filters>\n' +
    '    <active-case-user-filters ng-switch-default> </active-case-user-filters>\n' +
    '  </div>\n' +
    '  <div class="panel panel-default">\n' +
    '\n' +
    '    <div class="panel-heading title">{{ \'Case list\' | translate }}  <span ng-click="caseUserCtrl.reinitCases()" tooltip="{{ \'Refresh\' | translate}}" tooltip-animation="false" tooltip-popup-delay="300" class="case-list-refresh glyphicon glyphicon-repeat"></span></div>\n' +
    '    <div class="panel-body">\n' +
    '      <div growl></div>\n' +
    '        <div ng-show="cases.length">\n' +
    '        <div class="col-md-12">\n' +
    '          <table ng-if="!archivedTabName" bonitable bo-storable="user-cases-list" on-storage-loaded="caseUserCtrl.loadContent()" bo-repeatable  on-sort="caseUserCtrl.updateSortField(sortOptions)" sort-options="sortOptions" resizable-column="$columns" resize-selector="tr th.case-column" class="table table-striped table-hover table-responsive">\n' +
    '            <thead>\n' +
    '              <tr>\n' +
    '                <th colspan="{{$columns.length+2}}">\n' +
    '                  <div class="pull-right table-buttons">\n' +
    '                    <table-settings class="pull-right" page-size="pagination.itemsPerPage" sizes="pageSizes" columns="$columns" update-page-size="caseUserCtrl.changeItemPerPage(size)"></table-settings>\n' +
    '                    <span  ng-if="pagination.total" id="cases-results-size-top" class="pull-right">{{ \'{}-{} of {}\' | translate | stringTemplater:[currentFirstResultIndex, currentLastResultIndex, pagination.total]}}</span>\n' +
    '                  </div>\n' +
    '                </th>\n' +
    '              </tr>\n' +
    '              <tr data-headers>\n' +
    '                <th class="text-right case-column" bo-sorter="id" bo-sorter-title-asc="{{\'sort by ID ascending\' | translate}}" bo-sorter-title-desc="{{\'sort by ID descending\' | translate}}">{{\'ID\' | translate}}</th>\n' +
    '                <th class="case-column" bo-sorter="name" bo-sorter-title-asc="{{\'sort by Process name ascending\' | translate}}" bo-sorter-title-desc="{{\'sort by Process name descending\' | translate}}">{{\'Process name\' | translate}}</th>\n' +
    '                <th class="case-column" visible="false">{{\'Version\' | translate}}</th>\n' +
    '                <th bo-sorter="startDate" class="case-column" bo-sorter-title-asc="{{\'sort by Start date ascending\' | translate}}" bo-sorter-title-desc="{{\'sort by Start date descending\' | translate}}">{{\'Start date\' | translate}}</th>\n' +
    '                <th class="case-column">{{\'Started by\' | translate}}</th>\n' +
    '                <th class="text-right case-column">{{\'Available tasks\' | translate}}</th>\n' +
    '                <th bo-sorter="index1" class="case-column" remove-column="{{!caseUserCtrl.displayKeys()}}" ng-hide="!caseUserCtrl.displayKeys()"><span id="infoPopover" class="glyphicon glyphicon-info-sign" popover="{{\'To personalize the display of search keys (and columns in general), use the table settings button on the right. You can search on up to 5 search keys.\' | translate}}" popover-trigger="mouseenter"></span> {{\'Search Key 1\' | translate}}</th>\n' +
    '                <th bo-sorter="index2" visible="false" class="case-column" remove-column="{{!caseUserCtrl.displayKeys()}}" ng-hide="!caseUserCtrl.displayKeys()">{{\'Search Key 2\' | translate}}</th>\n' +
    '                <th bo-sorter="index3" visible="false" class="case-column" remove-column="{{!caseUserCtrl.displayKeys()}}" ng-hide="!caseUserCtrl.displayKeys()">{{\'Search Key 3\' | translate}}</th>\n' +
    '                <th bo-sorter="index4" visible="false" class="case-column" remove-column="{{!caseUserCtrl.displayKeys()}}" ng-hide="!caseUserCtrl.displayKeys()">{{\'Search Key 4\' | translate}}</th>\n' +
    '                <th bo-sorter="index5" visible="false" class="case-column" remove-column="{{!caseUserCtrl.displayKeys()}}" ng-hide="!caseUserCtrl.displayKeys()">{{\'Search Key 5\' | translate}}</th>\n' +
    '                <th data-ignore class="text-center">{{\'Actions\' | translate}}</th>\n' +
    '\n' +
    '              </tr>\n' +
    '            </thead>\n' +
    '            <tbody>\n' +
    '\n' +
    '            <tr ng-repeat="case in cases" id="caseId-{{::case.id}}" class="case-row" ng-class="{\'info\' : case.selected}">\n' +
    '              <td class="text-right case-detail"><a id="case-detail-link-{{case.id}}" target="_parent" href="{{::caseUserCtrl.getLinkToCase(case)}}">{{case[\'ID\']}}</a></td>\n' +
    '              <td class="case-detail">{{::case[\'Process name\']}}</td>\n' +
    '              <td class="case-detail">{{::case[\'Version\']}}</td>\n' +
    '              <td class="case-detail">{{::caseUserCtrl.parseAndFormat(case[\'Start date\'])}}</td>\n' +
    '              <td class="case-detail">{{::case[\'Started by\'] || (\'System\' | translate)}}</td>\n' +
    '              <td class="case-detail text-right">{{::case[\'Available tasks\']}}</td>\n' +
    '              <td class="case-detail" ng-hide="!caseUserCtrl.displayKeys()"><search-index case="case" index="1"></search-index></td>\n' +
    '              <td class="case-detail" ng-hide="!caseUserCtrl.displayKeys()"><search-index case="case" index="2"></search-index></td>\n' +
    '              <td class="case-detail" ng-hide="!caseUserCtrl.displayKeys()"><search-index case="case" index="3"></search-index></td>\n' +
    '              <td class="case-detail" ng-hide="!caseUserCtrl.displayKeys()"><search-index case="case" index="4"></search-index></td>\n' +
    '              <td class="case-detail" ng-hide="!caseUserCtrl.displayKeys()"><search-index case="case" index="5"></search-index></td>\n' +
    '              <td class="case-link text-center">\n' +
    '                <a id="case-overview-btn-{{::case.id}}" tooltip="{{\'View case overview\' | translate }}"  tooltip-popup-delay="500" tooltip-animation="false" target="_parent" ng-href="{{::caseUserCtrl.getLinkToCaseOverview(case)}}" class="open-link">\n' +
    '                  <span class="glyphicon glyphicon-eye-open"></span>\n' +
    '                </a>\n' +
    '                <a id="case-detail-btn-{{::case.id}}" tooltip="{{\'View case details\' | translate }}"  tooltip-popup-delay="500" tooltip-animation="false" target="_parent" ng-href="{{::caseUserCtrl.getLinkToCase(case)}}" class="open-link">\n' +
    '                  <span class="glyphicon glyphicon-option-horizontal"></span>\n' +
    '                </a>\n' +
    '              </td>\n' +
    '            </tr>\n' +
    '            </tbody>\n' +
    '          </table>\n' +
    '\n' +
    '          <table ng-if="archivedTabName" bonitable bo-storable="archived-user-cases-list" on-storage-loaded="caseUserCtrl.loadContent()" bo-repeatable on-sort="caseUserCtrl.updateSortField(sortOptions)" sort-options="sortOptions" resizable-column="$columns" resize-selector="tr th.case-column" class="table table-striped table-hover table-responsive">\n' +
    '            <thead>\n' +
    '              <tr>\n' +
    '                <th colspan="{{$columns.length+2}}">\n' +
    '                  <div class="pull-right table-buttons">\n' +
    '                    <table-settings class="pull-right" page-size="pagination.itemsPerPage" sizes="pageSizes" columns="$columns"  update-page-size="caseUserCtrl.changeItemPerPage(size)"></table-settings>\n' +
    '                       <span ng-if="pagination.total" id="cases-results-size-top" class="pull-right">{{ \'{}-{} of {}\' | translate | stringTemplater:[currentFirstResultIndex, currentLastResultIndex, pagination.total]}}</span>\n' +
    '                  </div>\n' +
    '                </th>\n' +
    '              </tr>\n' +
    '              <tr data-headers>\n' +
    '                <th class="text-right case-column" bo-sorter="sourceObjectId" bo-sorter-title-asc="{{\'sort by ID ascending\' | translate}}" bo-sorter-title-desc="{{\'sort by ID descending\' | translate}}">{{\'ID\' | translate}}</th>\n' +
    '                <th class="case-column" bo-sorter="name" bo-sorter-title-asc="{{\'sort by Process name ascending\' | translate}}" bo-sorter-title-desc="{{\'sort by Process name descending\' | translate}}">{{\'Process name\' | translate}}</th>\n' +
    '                <th class="case-column" visible="false">{{\'Version\' | translate}}</th>\n' +
    '                <th bo-sorter="startDate" class="case-column" bo-sorter-title-asc="{{\'sort by Start date ascending\' | translate}}" bo-sorter-title-desc="{{\'sort by Start date descending\' | translate}}">{{\'Start date\' | translate}}</th>\n' +
    '                <th class="case-column" >{{\'Started by\' | translate}}</th>\n' +
    '                <th bo-sorter="endDate" class="case-column" bo-sorter-title-asc="{{\'sort by End date ascending\' | translate}}" bo-sorter-title-desc="{{\'sort by End date descending\' | translate}}">{{\'End date\' | translate}}</th>\n' +
    '                <th bo-sorter="index1" class="case-column" remove-column="{{!caseUserCtrl.displayKeys()}}" ng-hide="!caseUserCtrl.displayKeys()"><span id="infoPopover" class="glyphicon glyphicon-info-sign" popover="{{\'To personalize the display of search keys (and columns in general), use the table settings button on the right. You can search on up to 5 search keys.\' | translate}}" popover-trigger="mouseenter"></span> {{\'Search Key 1\' | translate}}</th>\n' +
    '                <th bo-sorter="index2" visible="false" class="case-column" remove-column="{{!caseUserCtrl.displayKeys()}}" ng-hide="!caseUserCtrl.displayKeys()">{{\'Search Key 2\' | translate}}</th>\n' +
    '                <th bo-sorter="index3" visible="false" class="case-column" remove-column="{{!caseUserCtrl.displayKeys()}}" ng-hide="!caseUserCtrl.displayKeys()">{{\'Search Key 3\' | translate}}</th>\n' +
    '                <th bo-sorter="index4" visible="false" class="case-column" remove-column="{{!caseUserCtrl.displayKeys()}}" ng-hide="!caseUserCtrl.displayKeys()">{{\'Search Key 4\' | translate}}</th>\n' +
    '                <th bo-sorter="index5" visible="false" class="case-column" remove-column="{{!caseUserCtrl.displayKeys()}}" ng-hide="!caseUserCtrl.displayKeys()">{{\'Search Key 5\' | translate}}</th>\n' +
    '\n' +
    '                <th data-ignore class="text-center">{{\'Actions\' | translate}}</th>\n' +
    '              </tr>\n' +
    '            </thead>\n' +
    '            <tbody>\n' +
    '            <tr ng-repeat="case in cases" id="caseId-{{::case.id}}" class="case-row" ng-class="{\'info\' : case.selected}">\n' +
    '              <td class="case-detail text-right"><a id="case-detail-link-{{case.id}}" target="_parent" href="{{::caseUserCtrl.getLinkToCase(case)}}">{{case[\'ID\']}}</a></td>\n' +
    '              <td class="case-detail">{{::case[\'Process name\']}}</td>\n' +
    '              <td class="case-detail">{{::case[\'Version\']}}</td>\n' +
    '              <td class="case-detail">{{::caseUserCtrl.parseAndFormat(case[\'Start date\'])}}</td>\n' +
    '              <td class="case-detail">{{::case[\'Started by\'] || (\'System\' | translate)}}</td>\n' +
    '              <td class="case-detail">{{::caseUserCtrl.parseAndFormat(case[\'End date\'])}}</td>\n' +
    '              <td class="case-detail" ng-hide="!caseUserCtrl.displayKeys()"><search-index case="case" index="1"></search-index></td>\n' +
    '              <td class="case-detail" ng-hide="!caseUserCtrl.displayKeys()"><search-index case="case" index="2"></search-index></td>\n' +
    '              <td class="case-detail" ng-hide="!caseUserCtrl.displayKeys()"><search-index case="case" index="3"></search-index></td>\n' +
    '              <td class="case-detail" ng-hide="!caseUserCtrl.displayKeys()"><search-index case="case" index="4"></search-index></td>\n' +
    '              <td class="case-detail" ng-hide="!caseUserCtrl.displayKeys()"><search-index case="case" index="5"></search-index></td>\n' +
    '              <td class="case-link text-center">\n' +
    '                <a id="case-overview-btn-{{::case.id}}" tooltip="{{\'View case overview\' | translate }}"  tooltip-popup-delay="500" tooltip-animation="false" target="_parent" ng-href="{{::caseUserCtrl.getLinkToArchivedCaseOverview(case)}}" class="open-link">\n' +
    '                  <span class="glyphicon glyphicon-eye-open"></span>\n' +
    '                </a>\n' +
    '                <a id="case-detail-btn-{{::case.id}}" tooltip="{{\'View case details\' | translate }}"  tooltip-popup-delay="500" tooltip-animation="false" target="_parent" ng-href="{{::caseUserCtrl.getLinkToCase(case)}}" class="open-link">\n' +
    '                  <span class="glyphicon glyphicon-option-horizontal"></span>\n' +
    '                </a>\n' +
    '              </td>\n' +
    '            </tr>\n' +
    '            </tbody>\n' +
    '          </table>\n' +
    '        </div>\n' +
    '        <div class="col-md-12">\n' +
    '          <div class="pull-right" ng-if="pagination.total">\n' +
    '            <span id="cases-results-size-bottom" class="pull-left">{{ \'{}-{} of {}\' | translate | stringTemplater:[currentFirstResultIndex, currentLastResultIndex, pagination.total]}}</span>\n' +
    '            <pagination id="cases-results-pages" ng-if="pagination.total > pagination.itemsPerPage" ng-click="caseUserCtrl.searchForCases()" boundary-links="true" total-items="pagination.total" ng-model="pagination.currentPage" items-per-page="pagination.itemsPerPage " previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;" max-size="5"></pagination>\n' +
    '           </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '      <div ng-show="loading">\n' +
    '        <p class="text-muted"><span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>&nbsp;{{ \'Loading...\' | translate}}</p>\n' +
    '      </div>\n' +
    '      <div ng-show="!loading &amp;&amp; cases &amp;&amp; cases.length===0">\n' +
    '        <p class="text-muted animated fadeIn">{{ \'No cases to display\' | translate }}</p>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/user/cases/list/cases.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/user/cases/list/cases.html',
    '<div id="case-list" class="container">\n' +
    '  <h1 id="case-title">{{\'Cases\' | translate }}</h1>\n' +
    '\n' +
    '  <div>\n' +
    '    <ul class="nav nav-tabs" role="tablist">\n' +
    '      <li role="presentation" ng-repeat="caseState in casesStates" ng-class="{\'active\' : state.is(caseState.state)}"><a class="title" href="" bonita-href="{\'token\' : currentToken, \'_tab\' : caseState.tabName}" id="{{:: caseState.htmlAttributeId}}">{{:: caseState.title}}</a></li>\n' +
    '    </ul>\n' +
    '    <div ui-view=\'case-list\' id="case-list-tab-content"></div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/user/tasks/list/common/directive/bonita-iframe-viewer.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/user/tasks/list/common/directive/bonita-iframe-viewer.html',
    '<div class="Viewer-wrapper">\n' +
    '  <iframe\n' +
    '    class="Viewer-frame"\n' +
    '    seamless\n' +
    '    ng-src="{{url}}"\n' +
    '    width="100%" height="100%"\n' +
    '    frameborder="0"></iframe>\n' +
    '  <div class="Viewer-overlay" ng-if="!isEditable"></div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/user/tasks/list/tasks-details.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/user/tasks/list/tasks-details.html',
    '<button class="pull-right btn btn-primary"\n' +
    '        id="Button{{editable? \'Release\' : \'Take\'}}DetailsColumn"\n' +
    '        ng-click="onTakeReleaseTask()" title="{{editable ? \'Unassign the task and put it back in Available tasks\' : \'Assign the task to myself and move it to My tasks.\'}}">\n' +
    '  <i class="glyphicon" ng-class="{\'glyphicon-save\':!editable, \'glyphicon-open\':editable}"></i>\n' +
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
    '          {{currentCase.sourceObjectId || currentCase.id}}\n' +
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
    '        ng-if="!inactive && hasForm"\n' +
    '        is-editable="editable"\n' +
    '        frame-url="formUrl"\n' +
    '        is-visible="tab.form">\n' +
    '      </bonita-iframe-viewer>\n' +
    '      <no-form class="FormViewer"\n' +
    '        ng-if="!hasForm"\n' +
    '        current-task="currentTask"\n' +
    '        editable="editable"\n' +
    '        inactive="inactive">\n' +
    '      </no-form>\n' +
    '    </div>\n' +
    '  </tab>\n' +
    '</tabset>\n' +
    '');
}]);

angular.module('portalTemplates/user/tasks/list/tasks-filters.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/user/tasks/list/tasks-filters.html',
    '<ul class="TaskFilters nav nav-pills nav-stacked">\n' +
    '  <!-- <a href="#" > is not good for a11n but it\'s a tradeoff for being themable\n' +
    '     that\'s why we use bottstrap markup-->\n' +
    '  <li role="presentation" ng-class="{\'active\':TASK_FILTERS.TODO===taskStatus}">\n' +
    '    <a href="#" id="todo-tasks" title="Show all tasks that I can do, assigned to me or not assigned"\n' +
    '       ng-click="setStatusTaskFilter(TASK_FILTERS.TODO)">\n' +
    '      <span class="badge pull-right" ng-show="count.TODO>0">{{count.TODO}}</span>\n' +
    '      To do\n' +
    '    </a>\n' +
    '    <div collapse="TASK_FILTERS.DONE === taskStatus">\n' +
    '      <ul class="TaskFilters nav nav-pills nav-stacked">\n' +
    '        <li role="presentation" ng-class="{\'active\':TASK_FILTERS.MY_TASK===taskStatus}">\n' +
    '          <a href="#" id="my-tasks" class="TaskFilter"\n' +
    '             title="Show tasks assigned to me, automatically, by me or by another user"\n' +
    '             ng-click="setStatusTaskFilter(TASK_FILTERS.MY_TASK)">\n' +
    '            <span class="badge pull-right" ng-show="count.MY_TASK>0">{{count.MY_TASK}}</span>\n' +
    '            My tasks\n' +
    '          </a>\n' +
    '        </li><!-- my tasks -->\n' +
    '        <li role="presentation" ng-class="{\'active\':TASK_FILTERS.POOL_TASK===taskStatus}">\n' +
    '          <a href="#" id="available-tasks" class="TaskFilter"\n' +
    '             title="Show tasks that I can do that are not assigned"\n' +
    '             ng-click="setStatusTaskFilter(TASK_FILTERS.POOL_TASK)" >\n' +
    '            <span class="badge pull-right" ng-show="count.POOL_TASK>0">{{count.POOL_TASK}}</span>\n' +
    '            Available tasks\n' +
    '          </a>\n' +
    '        </li><!-- available tasks -->\n' +
    '      </ul>\n' +
    '    </div>\n' +
    '  </li><!-- tasks -->\n' +
    '  <li role="presentation" ng-class="{\'active\':TASK_FILTERS.DONE===taskStatus}">\n' +
    '    <a href="#" id="done-tasks" title="Show done tasks"\n' +
    '       ng-click="setStatusTaskFilter(TASK_FILTERS.DONE)" >\n' +
    '      Done tasks\n' +
    '    </a>\n' +
    '  </li> <!-- done tasks -->\n' +
    '</ul>\n' +
    '');
}]);

angular.module('portalTemplates/user/tasks/list/tasks-layoutswitch.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/user/tasks/list/tasks-layoutswitch.html',
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

angular.module('portalTemplates/user/tasks/list/tasks-list.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/user/tasks/list/tasks-list.html',
    '<link rel="stylesheet" href="features/user/tasks/list/css/icomoon.css">\n' +
    '    <link rel="stylesheet" href="features/user/tasks/list/css/task-app.css">\n' +
    '    <link rel="stylesheet" href="features/user/tasks/list/css/task-filters.css">\n' +
    '    <link rel="stylesheet" href="features/user/tasks/list/css/task-list.css">\n' +
    '    <link rel="stylesheet" href="features/user/tasks/list/css/task-details.css">\n' +
    '  <!-- endbuild -->\n' +
    '\n' +
    '  <toast></toast>\n' +
    '  <div class="TaskListPage" ng-cloak task-app form-spy spy-submit="app.onFormSubmited(message)"\n' +
    '    ng-class="{\n' +
    '      \'TaskListPage--small\':app.smallScreen,\n' +
    '      \'TaskListPage--withMenu\':!app.smallScreen && app.showMenu}">\n' +
    '    <div class="OffcanvasMenu navbar">\n' +
    '      <h3 class="OffcanvasMenu-title">Filters</h3>\n' +
    '      <button ng-hide="app.smallScreen" title="{{app.showMenu ? \'Hide\' : \'Show\'}} Menu"\n' +
    '        class="FilterToggle btn btn-default" btn-checkbox ng-model="app.showMenu">\n' +
    '        <span class="glyphicon" ng-class="{\'glyphicon-chevron-left\':app.showMenu,\'glyphicon-chevron-right\': !app.showMenu }"></span>\n' +
    '        <span class="sr-only">menu</span>\n' +
    '      </button>\n' +
    '      <task-filters filter="app.request.taskFilter"\n' +
    '                    filters="app.TASK_FILTERS"\n' +
    '                    count="app.count"\n' +
    '                    filter-change="app.changeFilter(filter)">\n' +
    '      </task-filters>\n' +
    '    </div>\n' +
    '    <div class="AppWrapper">\n' +
    '      <div class="AppHeader">\n' +
    '        <h1>\n' +
    '          <i class="icon-inbox TitleIcon"></i>\n' +
    '          <span>{{app.request.taskFilter.title}}</span>\n' +
    '\n' +
    '          <layout-switch value="app.showDetails" on-change="app.updateLayout(showDetails)" ng-hide="app.smallScreen"/>\n' +
    '        </h1>\n' +
    '\n' +
    '      </div>\n' +
    '\n' +
    '        <div class="alert alert-warning" ng-show="error">\n' +
    '          <p ng-bind-template="Please login to your bonita portal (Error {{error.status}})"></p>\n' +
    '        </div>\n' +
    '      <div class="" ng-hide="error">\n' +
    '        <div>\n' +
    '          <div class="TaskList col-md-{{app.getSize()}}"\n' +
    '               ng-if="!(app.showDetails && app.expandDetails) || app.smallScreen">\n' +
    '            <div class="panel panel-default">\n' +
    '              <div class="Settings">\n' +
    '                <div class="Settings-filter">\n' +
    '                  <form name="searchForm" class="form-inline" ng-submit="app.searchTask()">\n' +
    '                    <fieldset class="SearchBox">\n' +
    '                      <legend class="sr-only">searchLegend</legend>\n' +
    '                      <div class="form-group">\n' +
    '                        <i class="icon-search SearchBox-icon"></i>\n' +
    '                        <input class="form-control SearchBox-input" id="search"\n' +
    '                          input-focus\n' +
    '                          placeholder="Search on task name"\n' +
    '                          ng-model="app.request.search"\n' +
    '                          ng-model-options="{updateOn:\'keyup\', debounce:{\'default\':250, \'blur\':0} }"\n' +
    '                          ng-change="app.searchTask()"\n' +
    '                          >\n' +
    '\n' +
    '                      </div>\n' +
    '                      {{"Process name"}}\n' +
    '                      <div class="ProcessList" dropdown>\n' +
    '                        <button dropdown-toggle type="button"\n' +
    '                                class="btn btn-primary"\n' +
    '                                title="{{\'Process: \' + app.request.process.name + (app.request.process.version ? \' \' + app.request.process.version : \'\') }}"\n' +
    '                                ng-disabled="app.request.taskFilter === app.TASK_FILTERS.DONE || !app.processes || app.processes.length === 0">\n' +
    '                          <div class="ProcessList-label">{{app.request.process.name + (app.request.process.version?" "+app.request.process.version:"")}} <span class="caret"></span></div>\n' +
    '                        </button>\n' +
    '                        <ul class="dropdown-menu">\n' +
    '                          <li ng-repeat="p in app.processes" >\n' +
    '                            <a ng-click="app.setProcess(p)" ng-class="{\'active\':p.id === app.request.process.id}" class="processOptionLink">\n' +
    '                              {{p.name+"&nbsp;"+p.version}}\n' +
    '                            </a>\n' +
    '                          </li>\n' +
    '                        </ul>\n' +
    '                      </div>\n' +
    '                      <span class="Loading pull-right" ng-show="app.loadingTasks" ></span>\n' +
    '                      <button class="btn btn-default pull-right"\n' +
    '                        type="button"\n' +
    '                        title="refresh data"\n' +
    '                        ng-hide="app.loadingTasks"\n' +
    '                        ng-click="app.updateAll()">\n' +
    '                        <i class="icon-refresh"></i>\n' +
    '                        <span class="sr-only">Refresh data</span>\n' +
    '                      </button>\n' +
    '                    </fieldset>\n' +
    '                  </form>\n' +
    '\n' +
    '                </div> <!-- Settings-filter -->\n' +
    '              </div> <!-- .Settings -->\n' +
    '              <div class="panel-body">\n' +
    '              <task-list tasks="app.tasks"\n' +
    '                         current-task="app.currentTask"\n' +
    '                         request="app.request"\n' +
    '                         user="app.user"\n' +
    '                         mode="app.getMode(app.showDetails, app.smallScreen)"\n' +
    '                         page-sizes="app.PAGE_SIZES"\n' +
    '                         refresh-tasks="app.updateTasks()"\n' +
    '                         refresh-count="app.updateCount()"\n' +
    '                         select-task="app.selectTask(task)"\n' +
    '                         do-task="app.showTasksFormPopup(task)"\n' +
    '                         view-task="app.showTaskDetailsPopup(task)">\n' +
    '                </task-list>\n' +
    '              </div>\n' +
    '            </div>\n' +
    '          </div> <!-- .Tasklist -->\n' +
    '\n' +
    '          <div class="TaskDetails col-md-{{app.getSize()}}" id="details" ng-if="app.smallScreen || app.showDetails">\n' +
    '            <div class="panel panel-default">\n' +
    '              <div class="panel-heading">\n' +
    '                <button class="pull-right btn btn-default"\n' +
    '                        ng-model="app.expandDetails"\n' +
    '                        btn-checkbox\n' +
    '                        title="{{app.expandDetails ? \'Expand\' : \'Reduce\'}}">\n' +
    '                  <span ng-class="{\'glyphicon glyphicon-resize-full\':!app.expandDetails,\'glyphicon glyphicon-resize-small\':app.expandDetails}"></span>\n' +
    '                  <span class="sr-only">{{app.expandDetails ? \'Expand\' : \'Reduce\'}}</span>\n' +
    '                </button>\n' +
    '                <h3 class="panel-title">Task Details</h3>\n' +
    '              </div>\n' +
    '              <div class="panel-body">\n' +
    '                <task-details current-task="app.currentTask"\n' +
    '                              current-case="app.currentCase"\n' +
    '                              refresh-count="app.updateCount()"\n' +
    '                              editable="app.currentTask.assigned_id === app.user.user_id"\n' +
    '                              hide-form="app.request.taskFilter === app.TASK_FILTERS.DONE"\n' +
    '                              inactive="app.tasks.length === 0">\n' +
    '                </task-details>\n' +
    '              </div>\n' +
    '            </div>\n' +
    '          </div> <!-- .TaskDetails -->\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '\n' +
    '  <!-- build:js resources/js/vendors.js -->\n' +
    '  <!--  <script src="../bower_components/angular/angular.js" ></script> -->\n' +
    '  <!--  <script src="../bower_components/angular-animate/angular-animate.js" ></script> -->\n' +
    '  <!--  <script src="../bower_components/angular-bootstrap/ui-bootstrap-tpls.js" ></script> -->\n' +
    '  <!--  <script src="../bower_components/angular-cookies/angular-cookies.js" ></script> -->\n' +
    '  <!--  <script src="../bower_components/angular-resource/angular-resource.js" ></script> -->\n' +
    '  <!--  <script src="../bower_components/angular-sanitize/angular-sanitize.js" ></script> -->\n' +
    '  <!--  <script src="../bower_components/angular-touch/angular-touch.js" ></script> -->\n' +
    '  <!--  <script src="../bower_components/bonita-js-components/dist/bonita-lib-tpl.js" ></script> -->\n' +
    '  <!--  <script src="../bower_components/ngtoast/dist/ngToast.js" ></script> -->\n' +
    '  <!--  <script src="../bower_components/keymaster/keymaster.js" ></script> -->\n' +
    '  <!--  <script src="../bower_components/momentjs/moment.js" ></script> -->\n' +
    '  <!-- endbuild -->\n' +
    '\n' +
    '  <!-- build:js resources/js/app.js -->\n' +
    '  <!--   <script src="js/templates.js" ></script> -->\n' +
    '  <!--   <script src="js/common/security.js" ></script> -->\n' +
    '  <!--   <script src="js/common/keymaster.js" ></script> -->\n' +
    '  <!--   <script src="js/common/api.js" ></script> -->\n' +
    '  <!--   <script src="js/common/filters.js" ></script> -->\n' +
    '  <!--   <script src="js/common/screen.js" ></script> -->\n' +
    '  <!--   <script src="js/common/iframeUrl.js" ></script> -->\n' +
    '  <!--   <script src="js/common/directive/input-focus.js" ></script> -->\n' +
    '  <!--   <script src="js/common/directive/bonita-iframe-viewer.js"></script> -->\n' +
    '  <!--   <script src="js/common/directive/bonita-form-spy.js"></script> -->\n' +
    '  <!--   <script src="js/common/taskRequest.js" ></script> -->\n' +
    '  <!--   <script src="js/common/preference.js" ></script> -->\n' +
    '  <!--   <script src="js/common/store.js" ></script> -->\n' +
    '  <!--   <script src="js/modal/modalForm.js" ></script> -->\n' +
    '  <!--   <script src="js/modal/modalDetails.js" ></script> -->\n' +
    '  <!--   <script src="js/layoutswitch/layoutswitch.js" ></script> -->\n' +
    '  <!--   <script src="js/tasklist/taskList.js" ></script> -->\n' +
    '  <!--   <script src="js/taskdetails/taskDetails.js" ></script> -->\n' +
    '  <!--   <script src="js/taskfilters/taskFilters.js" ></script> -->\n' +
    '  <!--   <script src="js/taskApp.js" ></script> -->\n' +
    '  <!--   <script src="js/app.config.js" ></script> -->\n' +
    '  <!--   <script src="js/app.js" ></script> -->\n' +
    '  <!-- endbuild -->\n' +
    '');
}]);

angular.module('portalTemplates/user/tasks/list/tasks-modal-details.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/user/tasks/list/tasks-modal-details.html',
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
    '                hide-form="modal.task.archivedDate"\n' +
    '                inactive="false"\n' +
    '                active-tab="context"\n' +
    '                refresh-count="modal.onRefreshCountHandler()">\n' +
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

angular.module('portalTemplates/user/tasks/list/tasks-modal-form.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/user/tasks/list/tasks-modal-form.html',
    '<div class="modal-body">\n' +
    '  <button type="button" ng-click="modal.cancel()" class="close" title="close form">\n' +
    '    <span aria-hidden="true">&times;</span>\n' +
    '    <span class="sr-only">Close</span>\n' +
    '  </button>\n' +
    '   <bonita-iframe-viewer class="FormViewer"\n' +
    '      ng-if="modal.hasForm"\n' +
    '      tabindex="0"\n' +
    '      is-editable="modal.isFormEditable"\n' +
    '      frame-url="modal.formUrl"\n' +
    '      is-visible="modal.isFormVisible">\n' +
    '    </bonita-iframe-viewer>\n' +
    '    <no-form class="FormViewer"\n' +
    '      ng-if="!modal.hasForm"\n' +
    '      current-task="modal.task"\n' +
    '      editable="modal.isFormEditable">\n' +
    '    </no-form>\n' +
    '</div>\n' +
    '<div class="modal-footer">\n' +
    '  <button type="button" class="btn btn-warning" title="close form" ng-click="modal.cancel()">Close form</button>\n' +
    '</div>\n' +
    '');
}]);

angular.module('portalTemplates/user/tasks/list/tasks-no-form.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/user/tasks/list/tasks-no-form.html',
    '<div class="Viewer-wrapper" ng-if="!inactive">\n' +
    '        <h4>{{currentTask.displayName || currentTask.name}}</h4>\n' +
    '        <p>No form is needed. You can enter a comment and confirm.</p>\n' +
    '        <form role="form">\n' +
    '          <div class="form-group">\n' +
    '            <label for="task-comment">Comment:</label>\n' +
    '            <textarea ng-model="currentTask.comment" id="task-comment" class="form-control"></textarea>\n' +
    '          </div>\n' +
    '          <button ng-click="onExecuteTask()" class="btn btn-primary center-block">Submit</button>\n' +
    '        </form>\n' +
    '        <div class="Viewer-overlay" ng-if="!editable"></div>\n' +
    '      </div>\n' +
    '');
}]);

angular.module('portalTemplates/user/tasks/list/tasks-table.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('portalTemplates/user/tasks/list/tasks-table.html',
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
    '      <button class="btn btn-primary" type="button" title="Assign the task to myself and move it to My tasks."\n' +
    '         ng-disabled="!canTake($selectedItems)" ng-click="takeTasks($selectedItems)">\n' +
    '         <i class="glyphicon glyphicon-save"></i> Take\n' +
    '      </button>\n' +
    '      <button class="btn btn-default"  type="button" title="Unassign the task and put it back in Available tasks"\n' +
    '        ng-disabled="!canRelease($selectedItems)" ng-click="releaseTasks($selectedItems)">\n' +
    '        <i class="glyphicon glyphicon-open"></i> Release\n' +
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
    '                    ng-if="request.taskFilter !== TASK_FILTERS.DONE"\n' +
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
    '      <button class="btn btn-primary" type="button" title="Assign the task to myself and move it to My tasks."\n' +
    '         ng-disabled="!canTake($selectedItems)" ng-click="takeTasks($selectedItems)">\n' +
    '         <i class="glyphicon glyphicon-save"></i> Take\n' +
    '      </button>\n' +
    '      <button class="btn btn-default" type="button" title="Unassign the task and put it back in Available tasks"\n' +
    '        ng-disabled="!canRelease($selectedItems)" ng-click="releaseTasks($selectedItems)">\n' +
    '        <i class="glyphicon glyphicon-open"></i> Release\n' +
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
