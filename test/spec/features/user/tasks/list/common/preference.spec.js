'use strict';

describe('preference', function() {
  var pref;
  var localStrorage;
  var DEFAULT_DETAILS;
  var COLUMNS_SETTINGS;

  beforeEach(module('org.bonitasoft.features.user.tasks.app.pref'));

  beforeEach(inject( function($injector){
    pref = $injector.get('preference');
    localStrorage = $injector.get('$localStorage');
    DEFAULT_DETAILS = $injector.get('DEFAULT_DETAILS');
    COLUMNS_SETTINGS = $injector.get('COLUMNS_SETTINGS');
  }));

  afterEach(function() {
    localStrorage.$reset();
  });

  describe('get', function(){

    it('should return default showDetails value', function(){
      var showDetails = pref.get('showDetails');
      expect(showDetails).toBe(DEFAULT_DETAILS);
    });

    it('should return default "max" value', function(){
      var value = pref.get('max');
      expect(value).toBe(COLUMNS_SETTINGS.max);
    });

    it('should return default "min" value', function(){
      var value = pref.get('min');
      expect(value).toBe(COLUMNS_SETTINGS.min);
    });

    it('should return default "mid" value', function(){
      var value = pref.get('mid');
      expect(value).toBe(COLUMNS_SETTINGS.mid);
    });

    it('should throw an error if key is unknown', function(){
      var getUnknown = function(){
        pref.get('abcd');
      };
      expect(getUnknown).toThrow();
    });

  });

  describe('set', function(){
    it('should store a value', function(){
      var o = {name:'abcd'};
      pref.set('showDetails', o);

      var value = pref.get('showDetails');
      expect(value).toEqual(o);
    });
    it('should persists a value', function(){
      var o = {name:'abcd'};
      pref.set('showDetails', o);

      var value = localStrorage['bonita-user-task-list'].showDetails;
      expect(value).toEqual(o);
    });
  });

  describe('getMode', function(){
    it('should return max', function(){
      var showDetails = false;
      var smallScreen = false;

      var mode = pref.getMode(showDetails, smallScreen);

      expect(mode).toBe('max');
    });
    it('should return mid', function(){
      var showDetails = true;
      var smallScreen = false;

      var mode = pref.getMode(showDetails, smallScreen);

      expect(mode).toBe('mid');
    });
    it('should return min', function(){
      var showDetails = true;
      var smallScreen = true;

      var mode = pref.getMode(showDetails, smallScreen);
      expect(mode).toBe('min');

      showDetails = false;
      mode = pref.getMode(showDetails, smallScreen);
      expect(mode).toBe('min');

    });
  });

});
