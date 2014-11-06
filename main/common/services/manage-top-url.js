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

      function getCurrentProfile(){
        if($window && $window.top && $window.top.location && $window.top.location.hash){
          var currentProfileMatcher = $window.top.location.hash.match(/\b_pf=\d+\b/);
          return (currentProfileMatcher && currentProfileMatcher.length)?currentProfileMatcher[0]:'';
        }
      }

      function getPath(){
        return $window.top.location.pathname;
      }
      function getSearch() {
        return $window.top.location.search || '';
      }
      return {
        replaceTab : replaceTab,
        getCurrentProfile : getCurrentProfile,
        getPath : getPath,
        getSearch : getSearch
      };
    }]);
})();

