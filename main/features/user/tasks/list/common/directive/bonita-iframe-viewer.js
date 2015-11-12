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
    .directive('bonitaIframeViewer', [
    '$timeout',
    function($timeout){
        // Runs during compile
        return {
          templateUrl:'portalTemplates/user/tasks/list/common/directive/bonita-iframe-viewer.html',
          scope:{
            trigger:'=isVisible',
            isEditable:'=',
            frameUrl:'='
          },
          replace:true,
          link: function(scope, $elem) {
            var elem = $elem.find('iframe')[0];
            var iframe = $elem.find('iframe');
            var switched = true;
            var measure;
            var unWatchTrigger;

            /**
             * Poll function to check if the iframe's ajax loading is ended
             *
             */
            function pollerFunction () {
              $timeout(function(){
                scope.loading = true;
                elem.style.height = elem.contentWindow.document.body.offsetHeight+'px';
              }, 50);

              return;
            }

            /**
             * Watcher for the frameUrl parameter
             * @param  {String} newSrc the url of the ifram content
             */
            scope.$watch('frameUrl', function(newSrc){
              if (!newSrc) {
                return;
              }

              scope.loading = false;
              if (elem.contentDocument.body && elem.contentDocument.body.children.length>0) {
                var m = elem.contentDocument.getElementById('main');
                var l = elem.contentDocument.getElementById('loading');
                if (l) {
                  l.style.display = '';
                }
                if(m){
                  m.style.display = 'none';
                }
              }

              scope.url = newSrc;

              /**
               * By default, changing hash parameters don't trigger iframe's
               * reload so by swaping the first two parameters we force it.
               */
              if ((switched =! switched)) {
                scope.url = newSrc.replace(/^(.*\?)([^&]+)&([^&]+)(.*)$/, '$1$3&$2$4');
              }

              // clean previous listener / watch function
              iframe.off('load');
              if (unWatchTrigger) {
                unWatchTrigger();
                unWatchTrigger = null;
              }
              // wait to onload event to start measuring content height
              iframe.one('load', function(){
                var loading =   elem.contentDocument.getElementById('loading');
                var main    =   elem.contentDocument.getElementById('main');

                measure = pollerFunction.bind(null, loading, main);

                // Since the iframe could be not visible, we need to wait for
                // the display trigger to start measuring content.
                // (while iframe is display:none, iframe element's height
                // will be equal to zero
                if (scope.trigger) {
                  measure();
                }
                else {
                  unWatchTrigger = scope.$watch('trigger', function(isIframeVisible) {
                    if (isIframeVisible) {
                      unWatchTrigger();
                      measure();
                    }
                  });
                }
              });
            });
          }
        };
      }
  ]);
})();
