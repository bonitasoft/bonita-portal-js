(function () {
  'use strict';

  angular
    .module('org.bonitasoft.features.admin.organisation.users')
    .directive('boCard', boCard);

  function boCard() {
    return {
      scope: {
        cardData: '=',
        onSave: '=',
        buttonText: '@'
      },
      replace: true,
      bindToController: true,
      controllerAs: 'vm',
      controller: BoCardController,
      templateUrl: 'features/admin/organisation/users/details/card.html'
    };
  }

  function BoCardController() {
    var vm = this;

    vm.save = function(card) {
      vm.onSave(card);
    };
  }

})();
