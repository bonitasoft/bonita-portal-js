(function() {
  'use strict';

  /**
   * Helper service which retrun a bonita url for task form or task overview
   * these url are used to displayed bonita portal pages whitin an iframe
   */

  angular
    .module('common.iframe', [])
    .service('iframe', [
      '$location', '$window',
      function($location, $window) {

        /**
         * get a proper bonita form url
         * @param  {Object} process
         * @param  {Object} task
         * @param  {String} userId
         * @return {String}      the form url for the associated task
         */
        this.getTaskForm = function(process, task, userId, confirmation) {
          // the formurl template
          var tpl=this.getPortalUrl()+'/portal/resource/taskInstance/<process.name>/<process.version>/<task.name>/content/?id=<task.id><tenantQueryString><localeQueryString>';

          var dict = [
            ['<process.name>', encodeURIComponentForPathSegment(process.name)],
            ['<process.version>', encodeURIComponentForPathSegment(process.version)],
            ['<task.name>', encodeURIComponentForPathSegment(task.name)],
            ['<task.id>', task.id],
            ['<user.id>', userId],
            ['<tenantQueryString>', getParamQueryString('&', 'tenant')],
            ['<localeQueryString>', getParamQueryString('&', 'locale')]
          ];

          var url = dict.reduce(function(buf, el) {
            return buf.replace(el[0], el[1]);
          }, tpl);

          if (confirmation === false) {
            url += '&displayConfirmation=false';
          }

          return url;
        };

        /**
         * get a proper bonita case visu url
         * @param  {Object} case
         * @param  {Object} process
         */
        this.getCaseVisu = function(Case, process) {
          var tpl=this.getPortalUrl()+'/portal.js/<tenantQueryString><localeQueryString>#/admin/monitoring/<process.id>-<case.id>?diagramOnly=1';

          var dict = [
            ['<tenantQueryString>', getParamQueryString('?', 'tenant')],
            ['<localeQueryString>', getParamQueryString('&', 'locale')],
            ['<process.id>', process.id],
            ['<case.id>', Case.id]
          ];

          return dict.reduce(function(buf, el) {
            return buf.replace(el[0], el[1]);
          }, tpl);

        };

        /**
         * get a proper bonita case overview url
         * @param  {Object} case
         * @param  {Object} process
         */
        this.getCaseOverview = function(Case, process) {
          // Case Overview iframe template
          var tpl=this.getPortalUrl()+'/portal/resource/processInstance/<process.name>/<process.version>/content/?id=<case.id><tenantQueryString><localeQueryString>';

          var dict = [
            ['<process.name>', encodeURIComponentForPathSegment(process.name)],
            ['<process.version>', encodeURIComponentForPathSegment(process.version)],
            ['<case.id>', Case.sourceObjectId || Case.id],
            ['<tenantQueryString>', getParamQueryString('&', 'tenant')],
            ['<localeQueryString>', getParamQueryString('&', 'locale')]
          ];

          return dict.reduce(function(buf, el) {
            return buf.replace(el[0], el[1]);
          }, tpl);

        };

        function encodeURIComponentForPathSegment(stringToEncode) {
          return encodeURIComponent(stringToEncode).replace(new RegExp('%2F', 'g'),'/')
        }

        function getParamQueryString(prefix, param) {
          var paramValue = $location.search()[param];
          if (angular.isDefined(paramValue)) {
            return prefix + param + '=' + paramValue;
          } else {
            return '';
          }
        }
        this.getPortalUrl = function getPortalUrl(){
          var locationHref = $window.location.href;
          var indexOfPortal = locationHref.indexOf('/portal');
          return locationHref.substring(0, indexOfPortal);
        };
      }
    ]);

})();
