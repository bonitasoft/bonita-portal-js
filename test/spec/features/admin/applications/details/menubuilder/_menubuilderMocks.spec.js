/** Copyright (C) 2015 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This library is free software; you can redistribute it and/or modify it under the terms
 * of the GNU Lesser General Public License as published by the Free Software Foundation
 * version 2.1 of the License.
 * This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License along with this
 * program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth
 * Floor, Boston, MA 02110-1301, USA.
 */

(function () {
  'use strict';

  var menubuilderMocks = {};

  menubuilderMocks.answer = [{
    id: '001',
    displayName: '',
    applicationId: '1001',
    parentMenuId: '',
    menuIndex: 1,
    urlToken: 'toto-mange',
    customPage: ''
  }];

  menubuilderMocks.mockModalDirective = {
    templateUrl: 'features/admin/applications/details/menubuilder-addCustomMenuModal.html',
    controller: 'addCustomMenuCtrl',
    controllerAs: 'addCustomMenuCtrl',
    size: 'sm',
    resolve: {
      AppID: jasmine.any(Function),
      customDataModal: jasmine.any(Function)
    }
  };

  window.menubuilderMocks = menubuilderMocks;

})();