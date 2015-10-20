(function() {
  'use strict';

  /**
   * layout-switcher directive is a smal UI switch component
   * the directive has 2 parameters
   *  - value: the switch value (true/false)
   *  - on-change: a function to call when value changed
   */
  angular
    .module('org.bonitasoft.features.user.tasks.ui.switcher', ['ui.bootstrap.buttons'])
    .directive('layoutSwitch', function() {
      // Runs during compile
      return {
        scope: {
          'value': '=',
          'onChange': '&'
        }, // {} = isolate, true = child, false/undefined = no change
        restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: 'portalTemplates/user/tasks/list/tasks-layoutswitch.html',
        replace: true,
        link: function(scope) {
          scope.changeHandler = function(value) {
            scope.onChange({
              'showDetails': value
            });
          };
        }
      };
    });
})();