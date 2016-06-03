'use strict';

describe('API Request', function(){
  var PAGE_SIZES;
  var DEFAULT_PAGE_SIZE;
  var TASK_FILTERS;

  var request;

  beforeEach(module('api.request'));


  beforeEach(inject(function($injector){
    PAGE_SIZES = $injector.get('PAGE_SIZES');
    DEFAULT_PAGE_SIZE = $injector.get('DEFAULT_PAGE_SIZE');
    TASK_FILTERS = $injector.get('TASK_FILTERS');
    request = $injector.get('taskRequest');
  }));

  describe('constant', function(){
    it('should exposed DEFAULT_PAGE_SIZE', function(){
      expect(DEFAULT_PAGE_SIZE).toBeDefined();
    });

    it('should exposed PAGE_SIZES', function(){
      expect(PAGE_SIZES).toBeDefined();
      expect(PAGE_SIZES).toEqual([25,50,100]);
    });
  });

  describe('getRequest', function(){
    it('should return an api search request ', function(){

      request.search = 'toto';
      request.pagination.numberPerPage = 25;
      request.pagination.currentPage = 4;
      request.taskFilter.sortOption = { direction: true, property: 'Name' };

      var req = request.getRequest();

      expect(req.params.s).toEqual('toto');
      expect(req.params.c).toEqual(25);
      expect(req.params.o).toEqual('Name DESC');

    });

    it('should append processId filter if process is supplied ', function(){
      request.process= {id:9999};
      var req = request.getRequest();
      var filters = req.params.f.filter(function(filter){
        return filter.match(/processId/);
      });
      expect(filters.length).toBe(1);
    });

    it('should not append processId filter if filter on DONE task ', function(){
      request.process = {id:9999};
      request.taskFilter = TASK_FILTERS.DONE;
      var req = request.getRequest();
      var filters = req.params.f.filter(function(filter){
        return filter.match(/processId/);
      });
      expect(filters.length).toBe(0);
    });
  });
});
