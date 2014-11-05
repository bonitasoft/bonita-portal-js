/* jshint sub:true*/
(function () {
  'use strict';

  angular.module('org.bonita.services.topurl', [])
    .service('manageTopUrl', ['$window', function ($window) {

      function replaceTab(tab){
        console.log($window.top.location.hash);
        if(tab && !!$window.top.location.hash){
          var tabMatches = $window.top.location.hash.match(/(^|&)_tab=[^&]*(&|$)/);
          if(!tabMatches || !tabMatches.length){
            var currentHash = $window.top.location.hash;
            $window.top.location.hash += ((currentHash.indexOf('&', currentHash.length-2)>=0)?'':'&') + '_tab='+tab;
          }else{
            $window.top.location.hash = $window.top.location.hash.replace(/(^|&)_tab=[^&]*(&|$)/, '$1_tab='+tab+'$2');
          }
        }else{
          $window.top.location.hash = $window.top.location.hash.replace(/(^|&)_tab=[^&]*(&|$)/, '$1$2');
        }
      }

      return {
        replaceTab : replaceTab
      };
    }]);
})();

