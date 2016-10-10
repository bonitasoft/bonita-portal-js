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

        var urlParams = getURLParams();

        function getURLParams() {
          var urlParams = {};
          var queryString = $window.location.search;
          if (queryString && queryString.length > 0) {
            var search = /([^&=]+)=?([^&]*)/g;
            var query = queryString.substring(1);
            var match;
            while ((match = search.exec(query)) !== null) {
              urlParams[decode(match[1])] = decode(match[2]);
            }
          }
          return urlParams;
        }

        // replace addition symbol with a space
        function decode(s) {
          return decodeURIComponent(s.replace(/\+/g, ' '));
        }

        /**
         * get a proper bonita form url
         * @param  {Object} process
         * @param  {Object} task
         * @param  {String} userId
         * @return {String}      the form url for the associated task
         */
        this.getTaskForm = function(process, task, userId, confirmation) {
          // the formurl template
          var tpl=this.getPortalUrl()+'/portal/resource/taskInstance/<process.name>/<process.version>/<task.name>/content/?id=<task.id><tenantQueryString><localeQueryString><appQueryString>';

          var dict = [
            ['<process.name>', encodeURIComponentForPathSegment(process.name)],
            ['<process.version>', encodeURIComponentForPathSegment(process.version)],
            ['<task.name>', encodeURIComponentForPathSegment(task.name)],
            ['<task.id>', task.id],
            ['<user.id>', userId],
            ['<tenantQueryString>', getParamFromHash('&', 'tenant')],
            ['<localeQueryString>', getParamFromHash('&', 'locale')],
            ['<appQueryString>', getParamFromQueryString('&', 'app')]
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
            ['<tenantQueryString>', getParamFromHash('?', 'tenant')],
            ['<localeQueryString>', getParamFromHash('&', 'locale')],
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
          var tpl=this.getPortalUrl()+'/portal/resource/processInstance/<process.name>/<process.version>/content/?id=<case.id><tenantQueryString><localeQueryString><appQueryString>';

          var dict = [
            ['<process.name>', encodeURIComponentForPathSegment(process.name)],
            ['<process.version>', encodeURIComponentForPathSegment(process.version)],
            ['<case.id>', Case.sourceObjectId || Case.id],
            ['<tenantQueryString>', getParamFromHash('&', 'tenant')],
            ['<localeQueryString>', getParamFromHash('&', 'locale')],
            ['<appQueryString>', getParamFromQueryString('&', 'app')]
          ];

          return dict.reduce(function(buf, el) {
            return buf.replace(el[0], el[1]);
          }, tpl);

        };

        function encodeURIComponentForPathSegment(stringToEncode) {
          return encodeURIComponent(stringToEncode).replace(new RegExp('%2F', 'g'),'/');
        }

        function getParamFromQueryString(prefix, paramName) {
          return getParamString(urlParams, prefix, paramName);
        }

        function getParamFromHash(prefix, paramName) {
          return getParamString($location.search(), prefix, paramName);
        }

        function getParamString(params, prefix, paramName) {
          var paramValue = params[paramName];
          if (angular.isDefined(paramValue)) {
            return prefix + paramName + '=' + paramValue;
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
