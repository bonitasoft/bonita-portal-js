(function (global) {
    'use strict';

    angular
        .module('org.bonita.portal', [
            'ngCookies',
            'ngResource',
            'ngRoute',
            'ui.router',
            'common',
            'bonita.common.resources',
            'bonita.admin.users.list'
        ]);


})(this);

