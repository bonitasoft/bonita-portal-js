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
  ]).factory('contentFactory', function ($filter, manageTopUrl, gettextCatalog) {

    var factory = {};

    function defineContent(column, caseItem, opt) {
      if (column && column.date && caseItem[column.name] && typeof caseItem[column.name] === 'string') {
        //received date is in a non-standard format...
        // convert 2014-10-17 16:05:42.626 to ISO-8601 Format 2014-10-17T16:05:42.626Z
        var dateFormat = gettextCatalog.getString('MM/dd/yyyy h:mm:ss a');
        return $filter('date')(caseItem[column.name].replace(/ /, 'T'), dateFormat);
      } else if (column && column.popover) {
        return '<span class="badge">' + caseItem[column.name] + '</span>';

      } else if (column && column.linkToProcess) {
        var linkToProcess = manageTopUrl.getPath() + manageTopUrl.getSearch() + '#?id=' + caseItem.processDefinitionId.id + '&_p=processmoredetails'+
          ((!!Number(opt.processManager))?'pm':'admin') +
          '&' + manageTopUrl.getCurrentProfile();
        return '<a id="case-process-link-' + caseItem.id + '" target="_top" href="' + linkToProcess + '">' + caseItem[column.name] + '</a>';

      } else if (column && column.linkToCase) {
        var linkToCase = manageTopUrl.getPath() + manageTopUrl.getSearch() + '#?id=' + caseItem.id + '&_p=' + opt.moreDetailToken + '&' + manageTopUrl.getCurrentProfile();
        return '<a id="case-detail-link-' + caseItem.id + '" target="_top" href="' + linkToCase + '">' + caseItem[column.name] + '</a>';

      } else {
        return caseItem[column.name] || gettextCatalog.getString(column.defaultValue);
      }
    }

    factory.load = function load(config, cb) {

      var content;
      cb = cb || angular.noop;
      content = defineContent(config.col, config.caseItem, {
        processManager: config.processManager,
        moreDetailToken: config.moreDetailToken
      });
      cb(content);
    };

    return factory;
  })
    .directive('formatContent', ['$compile', 'contentFactory',
      function ($compile, contentFactory) {
        return {
          template: '<div></div>',
          replace: true,
          restrict: 'AE',
          scope: true,
          link: function (scope, element, attr) {

            function loadContent(content) {
              element.html(content);
            }
            contentFactory.load({
              col: JSON.parse(attr.column),
              caseItem: JSON.parse(attr.caseItem),
              moreDetailToken: attr.moreDetailToken,
              processManager: attr.processManager
            }, loadContent);

          }
        };
      }]);
})();
