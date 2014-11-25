(function () {
  'use strict';
  /**
   * @ngdoc overview
   * @name o.b.f.admin.cases.list.formatContent
   *
   * @description
   * describes the case list components
   */

  angular.module('org.bonita.features.admin.cases.list.formatContent', [
    'org.bonita.features.admin.cases.list.values',
    'org.bonita.features.admin.cases.list.flownodePopover',
    'gettext',
    'ui.bootstrap',
    'org.bonita.services.topurl'
  ])
  .factory('contentFactory', ['$filter', 'manageTopUrl', 'gettextCatalog', function ($filter, manageTopUrl, gettextCatalog) {

    var factory = {};

    /**
     * Load the template for an element from its content
     * @param  {Objec}   config {col,caseItem,processManager,moreDetailToken} attr from the directive
     * @return {void}
     */
    function load(config) {

      if (config.col && config.col.date && config.caseItem[config.col.name] && typeof config.caseItem[config.col.name] === 'string') {
        //received date is in a non-standard format...
        // convert 2014-10-17 16:05:42.626 to ISO-8601 Format 2014-10-17T16:05:42.626Z
        var dateFormat = gettextCatalog.getString('MM/dd/yyyy h:mm:ss a');
        return $filter('date')(config.caseItem[config.col.name].replace(/ /, 'T'), dateFormat);
      } else if (config.col && config.col.popover) {
        return '<span class="badge">' + (config.caseItem[config.col.name] || '') + '</span>';

      } else if (config.col && config.col.linkToProcess) {

        var linkToProcess = manageTopUrl.getPath() + manageTopUrl.getSearch() + '#?id=' + config.caseItem.processDefinitionId.id + '&_p=processmoredetails'+ (!!Number(config.processManager) ? 'pm' : 'admin') + '&' + manageTopUrl.getCurrentProfile();
        return '<a id="case-process-link-' + config.caseItem.id + '" target="_top" href="' + linkToProcess + '">' + config.caseItem[config.col.name] + '</a>';

      } else if (config.col && config.col.linkToCase) {
        var linkToCase = manageTopUrl.getPath() + manageTopUrl.getSearch() + '#?id=' + config.caseItem.id + '&_p=' + (config.moreDetailToken || '') + '&' + manageTopUrl.getCurrentProfile();
        return '<a id="case-detail-link-' + config.caseItem.id + '" target="_top" href="' + linkToCase + '">' + config.caseItem[config.col.name] + '</a>';

      } else {
        return config.caseItem[config.col.name] || gettextCatalog.getString(config.col.defaultValue);
      }
    }


    factory.load = load;
    return factory;
  }])
    .directive('formatContent', ['$compile', 'contentFactory', function ($compile, contentFactory) {
        return {
          template: '<div></div>',
          replace: true,
          restrict: 'AE',
          scope: true,
          link: function (scope, element, attr) {

            element
              .html(contentFactory.load({
                col: JSON.parse(attr.column),
                caseItem: JSON.parse(attr.caseItem),
                moreDetailToken: attr.moreDetailToken,
                processManager: attr.processManager
              }));
          }
        };
      }]);
})();
