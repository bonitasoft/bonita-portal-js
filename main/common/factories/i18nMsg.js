(function() {
  'use strict';

  angular.module('org.bonitasoft.common.i18n.factories',['gettext'])

    /**
     * This factory is to append the translations in each Object message for a form, a title attr etc.
     * @param  {[type]} gettext [description]
     * @return {[type]}         [description]
     */
    .factory('i18nMsg', ['gettext', 'gettextCatalog', function (gettext, gettextCatalog) {

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
        duplicateName: gettextCatalog.getString(gettext('This name is already in use'))
      };

      return translations;

    }]);


})();
