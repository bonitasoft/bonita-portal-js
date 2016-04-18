(function() {
  'use strict';

  /**
   * Bonita iframe viewer display task's form or case's overview using an iframe.
   * This directive also compute the iframe height and resize the container
   * accordingly.
   * The directive accept 3 params
   *  - {boolean} is-visible  component's visible
   *  - {boolean} is-editable component's editable state (will show an alert
   *                          + an overlay to prevent user to interact with
   *                          the form )
   *  - {boolean} frame-url   the url of the iframe source.
   */
  angular
    .module('org.bonitasoft.features.user.tasks.ui.iframe', [])
    .directive('bonitaIframeViewer', bonitaIframeViewer);

  function bonitaIframeViewer() {
    return {
      templateUrl: 'portalTemplates/user/tasks/list/common/directive/bonita-iframe-viewer.html',
      scope: {
        trigger: '=isVisible',
        isEditable: '=',
        frameUrl: '='
      },
      replace: true,
      link: function(scope, $elem) {
        var elem = $elem.find('iframe')[0];
        var switched = true;

        /**
         * Watcher for the frameUrl parameter
         * @param  {String} newSrc the url of the ifram content
         */
        scope.$watch('frameUrl', function(newSrc) {
          if (!newSrc) {
            return;
          }

          if (elem.contentDocument.body && elem.contentDocument.body.children.length > 0) {
            var m = elem.contentDocument.getElementById('main');
            var l = elem.contentDocument.getElementById('loading');
            if (l) {
              l.style.display = '';
            }
            if (m) {
              m.style.display = 'none';
            }
          }

          scope.url = newSrc;

          /**
           * By default, changing hash parameters don't trigger iframe's
           * reload so by swaping the first two parameters we force it.
           */
          if ((switched = !switched)) {
            scope.url = newSrc.replace(/^(.*\?)([^&]+)&([^&]+)(.*)$/, '$1$3&$2$4');
          }
        });
      }
    };
  }
})();
