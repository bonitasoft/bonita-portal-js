(function(){
  'use strict';


  /**
   * Screen service listen to window.resize events and trigger update when
   * breakpoint changes. Breakpoints values are extract from Bootstrap,
   * since the app rely on bootstrap responsive grid.
   */
  angular
    .module('common.screen',[])
    .service('screen', [
      '$document',
      '$window',
      '$rootScope',
      '$timeout',
      function($document, $window, $rootScope, $timeout){

        var deltaT = 10;
        var tid;
        var doc = $document[0];

        this.size = false;

        this.breakpoints = [
          {name: 'xs', size:[0,767]},
          {name: 'sm', size:[768, 991]},
          {name: 'md', size:[992, 1199]},
          {name: 'lg', size:[1200, Number.POSITIVE_INFINITY]}
        ];

        this.on = function(handler) {
          $rootScope.$on('responsive:update', handler);
        };

        this.off = function(handler) {
          $rootScope.$off('responsive:update', handler);
        };


        this.getWidth = function(){
          return doc.body && doc.body.offsetWidth;
        };

        this.update = function(){

          var w = this.getWidth();
          var size = this.breakpoints.filter(function(b){
            return w > b.size[0] && w < b.size[1];
          });
          if (size.length === 1 && size[0].name !== this.size.name ) {
            this.size = size[0];
            $timeout(function(){
              $rootScope.$broadcast('responsive:update');
            });
          }

        };

        /**
         * internal resize event handler
         * @return {[type]} [description]
         */
        this.onResize = function(){
          if (tid) {
            $timeout.cancel(tid);
          }

          tid = $timeout(this.update.bind(this), deltaT, false);
        };

        $window.addEventListener('resize', this.update.bind(this));

        /** trigger update */
        this.update();
      }
    ]);
})();
