'use strict';
describe('module tasks.filters', function(){

  beforeEach(module('org.bonitasoft.features.user.tasks.filters'));
  beforeEach(module('org.bonitasoft.portalTemplates'));


  describe('task-filter directive', function(){
    var element;
    var scope;

    beforeEach(inject(function($injector, $compile, $httpBackend){
      $httpBackend.whenGET(/portalTemplates\/user\/tasks\/list\/.*\.html/gi).respond('');

      scope = $injector.get('$rootScope').$new();
      scope.taskStatus = null;
      scope.count = {
        TODO:20,
        MA_TASK:10
      };

      scope.filterChangeHandler = function(){};

      var markup =
        '<task-filters  filter="request.taskFilter" '+
        '               count="count"  '+
        '               filter-change="filterChangeHandler(filter)">'+
        '</task-details>';
      element = $compile(markup)(scope);
      scope.$digest();
    }));


    it('should trigger tasks update', function(){
      spyOn(scope, 'filterChangeHandler');
      var isolated = element.isolateScope();
      var filter = {name:'filter'};
      isolated.setStatusTaskFilter(filter);

      expect(scope.filterChangeHandler).toHaveBeenCalledWith(filter);
    });

  });
});
