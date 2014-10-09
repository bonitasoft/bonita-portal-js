(function () {
    'use strict';

    angular.module('org.bonita.portal', [
        'ngCookies',
        'ngResource',
        'ui.router',
        'gettext',
        'org.bonita.common.resources',
        'org.bonita.features.admin'
    ]).run(['gettextCatalog', '$cookies', 'I18N', function (gettextCatalog, $cookies, I18N) {

        I18N.query({
            f: 'locale=' + ($cookies['BOS_Locale'] || 'en_EN')
        }, function (result) {
            gettextCatalog.currentLanguage = $cookies['BOS_Locale'];
            var catalog = {};
            for (var i = 0; i < result.length; i++) {
                catalog[result[i].key] = result[i].value;
            }
            gettextCatalog.setStrings($cookies['BOS_Locale'], catalog);
        });
        gettextCatalog.debug = true;
    }]);

})();

