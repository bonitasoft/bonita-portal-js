(function() {
  'use strict';

  angular.module('org.bonitasoft.common.i18n.factories',['gettext', 'org.bonitasoft.services.i18n'])

    /**
     * This factory is to append the translations in each Object message for a form, a title attr etc.
     * @param  {[type]} gettext [description]
     * @return {[type]}         [description]
     */
    .factory('i18nMsg', ['i18nService', 'gettext', 'gettextCatalog', function (i18nService, gettext, gettextCatalog) {

      var translations = {};


      // About gettex
      /*
      * Does nothing, simply returns the input string.
      *
      * This function serves as a marker for `grunt-angular-gettext` to know that
      * this string should be extracted for translations.
      */
     // Yolo

      translations.field = {
        mandatory: gettextCatalog.getString(gettext('This field is mandatory')),
        duplicateUrl: gettextCatalog.getString(gettext('This URL is already in use')),
        duplicateName: gettextCatalog.getString(gettext('This name is already in use')),
        reservedToken: i18nService.getKey('application.edit.reservedTokenError')
      };

      return translations;

    }]);


})();
