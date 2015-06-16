(function() {
  'use strict';

  angular.module('org.bonitasoft.common.i18n.filters',['gettext'])

    .filter('dateI18n', ['$window', 'gettextCatalog', function ($window, gettextCatalog) {
      return function translateDate(input, output) {

        if(!input) {
          return '';
        }

        if(!output) {
          throw new Error('[com.bonitasoft.common.i18n.filters@dateI18nFilter] You cannot use the date filter without a format');
        }

        if(!$window.moment) {
          throw new Error('[com.bonitasoft.common.i18n.filters@dateI18nFilter] We need moment.js to translate our dates');
        }

        $window.moment.locale(gettextCatalog.currentLanguage || gettextCatalog.baseLanguage);

        return $window.moment(+input).format(output);
      };

    }])
    .filter('dateAgo', ['$window', 'gettextCatalog', function ($window, gettextCatalog) {
      return function dateAgo(input) {

        if(!$window.moment) {
          throw new Error('[com.bonitasoft.common.i18n.filters@dateAgoFilter] We need moment.js to translate our dates');
        }

        $window.moment.locale(gettextCatalog.currentLanguage || gettextCatalog.baseLanguage);

        var compar = new Date(+input || Date.now());
        return $window.moment(compar).fromNow();
      };
    }]);


})();
