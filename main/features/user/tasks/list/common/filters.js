(function() {
  'use strict';
  /* global moment */
  /**
   * Common filters Module
   *
   * Description
   */
  angular
    .module('common.filters',[])
    .filter('translate', function(){
      return function(input){
        return input;
      };
    })
    .filter('moment', function(){
      return function(date, format) {
        // if date is invalid, we return a '-'
        if (moment(date).isValid() === false) {
          return '-';
        }

        date = moment(date);

        if(date.year() === moment().year()) {
          format = format.replace(/\s+YYYY/,'');
        }
        return date.format(format);
      };
    })
    .filter('encodeURI', function() {
      return window.encodeURI;
    });

})();
