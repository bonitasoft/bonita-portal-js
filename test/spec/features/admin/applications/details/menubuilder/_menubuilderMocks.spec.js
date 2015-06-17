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