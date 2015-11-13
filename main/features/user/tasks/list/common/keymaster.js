(function(){
  'use strict';
  /**
   * keymaster wraps the third party Keymaster library
   * and exposes it as a service.
   */

  angular
    .module('keymaster',[])
    .service('key', function() {
      /**
       * configuring keymaster lib to allow listening event on checkbox
       * https://github.com/madrobby/keymaster#filter-key-presses
       */
      window.key.filter = function filter(event){
        var tagName = (event.target || event.srcElement).tagName;
        return !((tagName === 'INPUT' && event.target.getAttribute('type')!=='checkbox') || tagName === 'SELECT' || tagName === 'TEXTAREA');
      };

      return window.key;
    });

})();
